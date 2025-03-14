
import { Book, BookFormData } from "@/types/book";

/**
 * Generates a unique catalog code for a new book
 * Format: BK-YYYY-XXXXX where YYYY is the current year and XXXXX is a sequential number
 */
export const generateCatalogCode = (existingBooks: Book[]): string => {
  const currentYear = new Date().getFullYear();
  const yearPrefix = `BK-${currentYear}-`;
  
  // Find the highest sequential number for this year
  const yearBooks = existingBooks.filter(book => 
    book.catalogCode.startsWith(yearPrefix)
  );
  
  let maxSequentialNumber = 0;
  
  yearBooks.forEach(book => {
    const sequentialStr = book.catalogCode.substring(yearPrefix.length);
    const sequentialNum = parseInt(sequentialStr, 10);
    if (!isNaN(sequentialNum) && sequentialNum > maxSequentialNumber) {
      maxSequentialNumber = sequentialNum;
    }
  });
  
  // Format the new sequential number with leading zeros
  const nextSequential = (maxSequentialNumber + 1).toString().padStart(5, '0');
  
  return `${yearPrefix}${nextSequential}`;
};

/**
 * Creates a book object from form data
 */
export const createBookFromFormData = (
  formData: BookFormData, 
  existingBooks: Book[]
): Book => {
  const now = new Date();
  
  return {
    id: crypto.randomUUID(),
    catalogCode: generateCatalogCode(existingBooks),
    ...formData,
    createdAt: now,
    updatedAt: now,
  };
};

/**
 * Formats authors array for display
 */
export const formatAuthors = (authors: string[]): string => {
  if (!authors || authors.length === 0) return "Unknown";
  
  if (authors.length === 1) return authors[0];
  
  if (authors.length === 2) return `${authors[0]} and ${authors[1]}`;
  
  return authors.slice(0, -1).join(", ") + ", and " + authors[authors.length - 1];
};

/**
 * Formats subjects array for display
 */
export const formatSubjects = (subjects: string[]): string => {
  if (!subjects || subjects.length === 0) return "None";
  
  return subjects.join(", ");
};

/**
 * Search books based on search criteria and query
 */
export const searchBooks = (
  books: Book[],
  criteria: string,
  query: string
): Book[] => {
  if (!query || query.trim() === "") return books;
  
  const searchQuery = query.toLowerCase().trim();
  
  return books.filter(book => {
    switch (criteria) {
      case "catalogCode":
        return book.catalogCode.toLowerCase().includes(searchQuery);
      case "title":
        return book.title.toLowerCase().includes(searchQuery);
      case "subjects":
        return book.subjects.some(subject => 
          subject.toLowerCase().includes(searchQuery)
        );
      case "language":
        return book.language.toLowerCase().includes(searchQuery);
      default:
        return true;
    }
  });
};
