

export enum BookLanguage {
  PORTUGUESE = "Português",
  ENGLISH = "Inglês",
  SPANISH = "Espanhol",
  FRENCH = "Francês",
  GERMAN = "Alemão",
  ITALIAN = "Italiano",
  JAPANESE = "Japonês",
  CHINESE = "Chinês",
  RUSSIAN = "Russo",
  ARABIC = "Árabe",
  OTHER = "Outro",
}

export enum BookCategory {
  FICTION = "Ficção",
  NON_FICTION = "Não-Ficção",
  SCIENCE = "Ciência",
  TECHNOLOGY = "Tecnologia",
  HISTORY = "História",
  PHILOSOPHY = "Filosofia",
  ARTS = "Artes",
  BIOGRAPHY = "Biografia",
  BUSINESS = "Negócios",
  COOKING = "Culinária",
  HEALTH = "Saúde",
  TRAVEL = "Viagens",
  RELIGION = "Religião",
  SELF_HELP = "Autoajuda",
  REFERENCE = "Referência",
  COMICS = "Quadrinhos & Novels Gráficas",
  CHILDREN = "Livros Infantis",
  EDUCATION = "Educação & Ensino",
  SPORTS = "Esportes & Atividades ao Ar Livre",
  OTHER = "Outro",
}

export interface Book {
  id: string;
  catalogCode: string;
  title: string;
  authors: string[];
  publisher: string;
  edition: string;
  year: string;
  location: string;
  isbn: string;
  language: BookLanguage;
  category: BookCategory;
  subjects: string[];
  review: string;
  createdAt: Date;
  updatedAt: Date;
}

export type BookFormData = Omit<Book, "id" | "catalogCode" | "createdAt" | "updatedAt">;

export type BookSearchCriteria = "catalogCode" | "title" | "subjects" | "language";

