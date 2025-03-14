
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
    throw new Error("useBooks must be used within a BookProvider");
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

  // Load initial data from localStorage (in a real app, this would be Firebase)
  useEffect(() => {
    const loadBooks = () => {
      try {
        const savedBooks = localStorage.getItem("books");
        if (savedBooks) {
          const parsedBooks: Book[] = JSON.parse(savedBooks);
          // Convert string dates back to Date objects
          const booksWithDates = parsedBooks.map(book => ({
            ...book,
            createdAt: new Date(book.createdAt),
            updatedAt: new Date(book.updatedAt)
          }));
          setBooks(booksWithDates);
          setFilteredBooks(booksWithDates);
        }
      } catch (error) {
        console.error("Failed to load books from localStorage:", error);
        toast({
          title: "Error loading books",
          description: "There was a problem loading your book data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadBooks();
  }, [toast]);

  // Save books to localStorage whenever the collection changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("books", JSON.stringify(books));
    }
  }, [books, isLoading]);

  // Update filtered books whenever search params or books change
  useEffect(() => {
    setFilteredBooks(searchBooks(books, searchCriteria, searchQuery));
  }, [books, searchCriteria, searchQuery]);

  const addBook = (bookData: BookFormData) => {
    const newBook = createBookFromFormData(bookData, books);
    setBooks(prevBooks => [...prevBooks, newBook]);
    toast({
      title: "Book added",
      description: `"${bookData.title}" has been added to your collection.`,
    });
  };

  const deleteBook = (id: string) => {
    const bookToDelete = books.find(book => book.id === id);
    setBooks(prevBooks => prevBooks.filter(book => book.id !== id));
    if (bookToDelete) {
      toast({
        title: "Book removed",
        description: `"${bookToDelete.title}" has been removed from your collection.`,
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
      title: "Book updated",
      description: `"${bookData.title}" has been updated.`,
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
