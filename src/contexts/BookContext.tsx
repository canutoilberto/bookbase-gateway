
import React, { createContext, useContext, useState, useEffect } from "react";
import { Book, BookFormData, BookSearchCriteria } from "@/types/book";
import { searchBooks } from "@/lib/book-utils";
import { useToast } from "@/components/ui/use-toast";
import { 
  fetchBooks, 
  addBookToFirestore, 
  updateBookInFirestore, 
  deleteBookFromFirestore
} from "@/lib/firebase-services";

type BookContextType = {
  books: Book[];
  isLoading: boolean;
  addBook: (bookData: BookFormData) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  updateBook: (id: string, bookData: BookFormData) => Promise<void>;
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

  // Carrega dados do Firebase
  useEffect(() => {
    const loadBooks = async () => {
      setIsLoading(true);
      try {
        const booksData = await fetchBooks();
        setBooks(booksData);
        setFilteredBooks(booksData);
      } catch (error) {
        console.error("Falha ao carregar livros do Firebase:", error);
        toast({
          title: "Erro ao carregar livros",
          description: "Houve um problema ao carregar seus dados de livros do Firebase.",
          variant: "destructive",
        });
        
        // Modo fallback - carrega do localStorage se Firebase falhar
        try {
          const savedBooks = localStorage.getItem("books");
          if (savedBooks) {
            const parsedBooks: Book[] = JSON.parse(savedBooks);
            const booksWithDates = parsedBooks.map(book => ({
              ...book,
              createdAt: new Date(book.createdAt),
              updatedAt: new Date(book.updatedAt)
            }));
            setBooks(booksWithDates);
            setFilteredBooks(booksWithDates);
          }
        } catch (localError) {
          console.error("Fallback para localStorage também falhou:", localError);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadBooks();
  }, [toast]);

  // Atualiza livros filtrados sempre que os parâmetros de pesquisa ou livros mudam
  useEffect(() => {
    setFilteredBooks(searchBooks(books, searchCriteria, searchQuery));
  }, [books, searchCriteria, searchQuery]);

  const addBook = async (bookData: BookFormData) => {
    try {
      const newBook = await addBookToFirestore(bookData, books);
      setBooks(prevBooks => [...prevBooks, newBook]);
      toast({
        title: "Livro adicionado",
        description: `"${bookData.title}" foi adicionado à sua coleção.`,
      });
    } catch (error) {
      console.error("Erro ao adicionar livro:", error);
      toast({
        title: "Erro ao adicionar livro",
        description: "Não foi possível adicionar o livro. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const deleteBook = async (id: string) => {
    try {
      const bookToDelete = books.find(book => book.id === id);
      await deleteBookFromFirestore(id);
      setBooks(prevBooks => prevBooks.filter(book => book.id !== id));
      if (bookToDelete) {
        toast({
          title: "Livro removido",
          description: `"${bookToDelete.title}" foi removido da sua coleção.`,
        });
      }
    } catch (error) {
      console.error("Erro ao remover livro:", error);
      toast({
        title: "Erro ao remover livro",
        description: "Não foi possível remover o livro. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const updateBook = async (id: string, bookData: BookFormData) => {
    try {
      await updateBookInFirestore(id, bookData);
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
    } catch (error) {
      console.error("Erro ao atualizar livro:", error);
      toast({
        title: "Erro ao atualizar livro",
        description: "Não foi possível atualizar o livro. Tente novamente.",
        variant: "destructive",
      });
    }
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
