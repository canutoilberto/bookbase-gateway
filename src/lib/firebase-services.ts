
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp, 
  Timestamp 
} from "firebase/firestore";
import { db } from "./firebase";
import { Book, BookFormData } from "@/types/book";
import { createBookFromFormData } from "./book-utils";

// Collection reference - try/catch to handle cases where Firebase isn't initialized
let booksCollectionRef;
try {
  booksCollectionRef = collection(db, "books");
} catch (error) {
  console.error("Error creating books collection reference:", error);
  // Create a mock implementation
  booksCollectionRef = {};
}

/**
 * Busca todos os livros do Firestore
 */
export const fetchBooks = async (): Promise<Book[]> => {
  try {
    const q = query(booksCollectionRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      // Converte os timestamps do Firestore para Dates
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      } as Book;
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    // Return mock data for development
    return [];
  }
};

/**
 * Adiciona um livro no Firestore
 */
export const addBookToFirestore = async (bookData: BookFormData, existingBooks: Book[]): Promise<Book> => {
  try {
    // Criamos um livro com ID local e código de catálogo
    const newBook = createBookFromFormData(bookData, existingBooks);
    
    // Preparamos os dados para o Firestore
    const firestoreBook = {
      ...newBook,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    // Salvamos no Firestore
    const docRef = await addDoc(booksCollectionRef, firestoreBook);
    
    // Atualizamos o newBook com o ID do Firestore e os timestamps
    return {
      ...newBook,
      id: docRef.id,
    };
  } catch (error) {
    console.error("Error adding book:", error);
    // Generate a temporary ID for development
    const tempId = "temp-" + Math.random().toString(36).substring(2, 9);
    return {
      ...createBookFromFormData(bookData, existingBooks),
      id: tempId,
    };
  }
};

/**
 * Atualiza um livro no Firestore
 */
export const updateBookInFirestore = async (id: string, bookData: BookFormData): Promise<void> => {
  try {
    const bookRef = doc(db, "books", id);
    
    await updateDoc(bookRef, {
      ...bookData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating book:", error);
  }
};

/**
 * Remove um livro do Firestore
 */
export const deleteBookFromFirestore = async (id: string): Promise<void> => {
  try {
    const bookRef = doc(db, "books", id);
    await deleteDoc(bookRef);
  } catch (error) {
    console.error("Error deleting book:", error);
  }
};

/**
 * Busca livros com filtros
 */
export const searchBooksInFirestore = async (
  criteria: string,
  query: string
): Promise<Book[]> => {
  try {
    if (!query || query.trim() === "") {
      return fetchBooks();
    }

    // Firestore não suporta pesquisa de texto completo nativa
    // Para pesquisas avançadas, considere usar Algolia ou similar
    // Esta é uma implementação básica

    const q = collection(db, "books");
    const snapshot = await getDocs(q);
    
    const searchQuery = query.toLowerCase().trim();
    
    return snapshot.docs
      .map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as Book;
      })
      .filter(book => {
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
  } catch (error) {
    console.error("Error searching books:", error);
    return [];
  }
};
