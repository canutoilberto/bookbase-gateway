
export enum BookLanguage {
  PORTUGUESE = "Português",
  ENGLISH = "English",
  SPANISH = "Español",
  FRENCH = "Français",
  GERMAN = "Deutsch",
  ITALIAN = "Italiano",
  JAPANESE = "日本語",
  CHINESE = "中文",
  RUSSIAN = "Русский",
  ARABIC = "العربية",
  OTHER = "Other",
}

export enum BookCategory {
  FICTION = "Fiction",
  NON_FICTION = "Non-Fiction",
  SCIENCE = "Science",
  TECHNOLOGY = "Technology",
  HISTORY = "History",
  PHILOSOPHY = "Philosophy",
  ARTS = "Arts",
  BIOGRAPHY = "Biography",
  BUSINESS = "Business",
  COOKING = "Cooking",
  HEALTH = "Health",
  TRAVEL = "Travel",
  RELIGION = "Religion",
  SELF_HELP = "Self-Help",
  REFERENCE = "Reference",
  COMICS = "Comics & Graphic Novels",
  CHILDREN = "Children's Books",
  EDUCATION = "Education & Teaching",
  SPORTS = "Sports & Outdoors",
  OTHER = "Other",
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
