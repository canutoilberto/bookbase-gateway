
import React, { createContext, useContext, useState, useEffect } from "react";
import { Book, BookFormData, BookSearchCriteria } from "@/types/book";
import { createBookFromFormData, searchBooks } from "@/lib/book-utils";
import { useToast } from "@/components/ui/use-toast";

type BookContextType = {
  books: Book[];
  isLoading: boolean;
  addBook: (bookData: BookFormData) => void;
  deleteBook: (id: string) => void;
  updateBook: (id: string, bookData: BookFormData) => void;
  searchBooksByFilter: (criteria: BookSearchCriteria, query: string) => Book[];
  filteredBooks: Book[];
  searchCriteria: BookSearchCriteria;
  setSearchCriteria: (criteria: BookSearchCriteria) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

const BookContext = createContext<BookContextType | undefined>(undefined);

export const useBooks = (): BookContextType => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error("useBooks deve ser usado dentro de um BookProvider");
  }
  return context;
};

export const BookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchCriteria, setSearchCriteria] = useState<BookSearchCriteria>("title");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { toast } = useToast();

  // Carrega dados iniciais do localStorage (em um aplicativo real, isso seria o Firebase)
  useEffect(() => {
    const loadBooks = () => {
      try {
        const savedBooks = localStorage.getItem("books");
        if (savedBooks) {
          const parsedBooks: Book[] = JSON.parse(savedBooks);
          // Converte strings de datas de volta para objetos Date
          const booksWithDates = parsedBooks.map(book => ({
            ...book,
            createdAt: new Date(book.createdAt),
            updatedAt: new Date(book.updatedAt)
          }));
          setBooks(booksWithDates);
          setFilteredBooks(booksWithDates);
        }
      } catch (error) {
        console.error("Falha ao carregar livros do localStorage:", error);
        toast({
          title: "Erro ao carregar livros",
          description: "Houve um problema ao carregar seus dados de livros.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadBooks();
  }, [toast]);

  // Salva livros no localStorage sempre que a coleção muda
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("books", JSON.stringify(books));
    }
  }, [books, isLoading]);

  // Atualiza livros filtrados sempre que os parâmetros de pesquisa ou livros mudam
  useEffect(() => {
    setFilteredBooks(searchBooks(books, searchCriteria, searchQuery));
  }, [books, searchCriteria, searchQuery]);

  const addBook = (bookData: BookFormData) => {
    const newBook = createBookFromFormData(bookData, books);
    setBooks(prevBooks => [...prevBooks, newBook]);
    toast({
      title: "Livro adicionado",
      description: `"${bookData.title}" foi adicionado à sua coleção.`,
    });
  };

  const deleteBook = (id: string) => {
    const bookToDelete = books.find(book => book.id === id);
    setBooks(prevBooks => prevBooks.filter(book => book.id !== id));
    if (bookToDelete) {
      toast({
        title: "Livro removido",
        description: `"${bookToDelete.title}" foi removido da sua coleção.`,
      });
    }
  };

  const updateBook = (id: string, bookData: BookFormData) => {
    setBooks(prevBooks =>
      prevBooks.map(book =>
        book.id === id
          ? {
              ...book,
              ...bookData,
              updatedAt: new Date(),
            }
          : book
      )
    );
    toast({
      title: "Livro atualizado",
      description: `"${bookData.title}" foi atualizado.`,
    });
  };

  const searchBooksByFilter = (criteria: BookSearchCriteria, query: string): Book[] => {
    return searchBooks(books, criteria, query);
  };

  const value = {
    books,
    isLoading,
    addBook,
    deleteBook,
    updateBook,
    searchBooksByFilter,
    filteredBooks,
    searchCriteria,
    setSearchCriteria,
    searchQuery,
    setSearchQuery,
  };

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
};
