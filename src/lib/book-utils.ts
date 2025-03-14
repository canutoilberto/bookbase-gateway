
import { Book, BookFormData } from "@/types/book";

/**
 * Gera um código único de catalogação para um novo livro
 * Formato: BK-YYYY-XXXXX onde YYYY é o ano atual e XXXXX é um número sequencial
 */
export const generateCatalogCode = (existingBooks: Book[]): string => {
  const currentYear = new Date().getFullYear();
  const yearPrefix = `BK-${currentYear}-`;
  
  // Encontra o maior número sequencial para este ano
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
  
  // Formata o novo número sequencial com zeros à esquerda
  const nextSequential = (maxSequentialNumber + 1).toString().padStart(5, '0');
  
  return `${yearPrefix}${nextSequential}`;
};

/**
 * Cria um objeto livro a partir dos dados do formulário
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
 * Formata o array de autores para exibição
 */
export const formatAuthors = (authors: string[]): string => {
  if (!authors || authors.length === 0) return "Desconhecido";
  
  if (authors.length === 1) return authors[0];
  
  if (authors.length === 2) return `${authors[0]} e ${authors[1]}`;
  
  return authors.slice(0, -1).join(", ") + " e " + authors[authors.length - 1];
};

/**
 * Formata o array de assuntos para exibição
 */
export const formatSubjects = (subjects: string[]): string => {
  if (!subjects || subjects.length === 0) return "Nenhum";
  
  return subjects.join(", ");
};

/**
 * Pesquisa livros com base nos critérios de busca e consulta
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
