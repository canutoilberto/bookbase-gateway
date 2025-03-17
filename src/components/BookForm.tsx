
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookLanguage, BookCategory, BookFormData } from "@/types/book";
import { useBooks } from "@/contexts/BookContext";
import { BookOpen, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import BookBasicInfo from "./form/BookBasicInfo";
import BookPublishingInfo from "./form/BookPublishingInfo";
import BookDetailsInfo from "./form/BookDetailsInfo";

// Schema de validação
const formSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  authors: z.array(z.string().min(1, "Nome do autor é obrigatório")),
  publisher: z.string().min(1, "Editora é obrigatória"),
  edition: z.string().min(1, "Edição é obrigatória"),
  year: z.string().regex(/^\d{4}$/, "Ano deve ser um número de 4 dígitos"),
  location: z.string().min(1, "Localização é obrigatória"),
  isbn: z
    .string()
    .regex(
      /^(?:ISBN(?:-1[03])?:? )?((?=\d{1,5}([ -]?)\d{1,7}\2?\d{1,6}\2?\d)(?:\d\2*){9}[\dX])$/i,
      "Formato de ISBN inválido"
    ),
  language: z.nativeEnum(BookLanguage, {
    errorMap: () => ({ message: "Por favor selecione um idioma" }),
  }),
  category: z.nativeEnum(BookCategory, {
    errorMap: () => ({ message: "Por favor selecione uma categoria" }),
  }),
  subjects: z.array(z.string().min(1, "Assunto é obrigatório")),
  review: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const BookForm: React.FC = () => {
  const { addBook } = useBooks();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      authors: [],
      publisher: "",
      edition: "",
      year: new Date().getFullYear().toString(),
      location: "",
      isbn: "",
      language: BookLanguage.PORTUGUESE,
      category: BookCategory.OTHER,
      subjects: [],
      review: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const bookData: BookFormData = {
        title: values.title,
        authors: values.authors,
        publisher: values.publisher,
        edition: values.edition,
        year: values.year,
        location: values.location,
        isbn: values.isbn,
        language: values.language,
        category: values.category,
        subjects: values.subjects,
        review: values.review || "",
      };
      addBook(bookData);
      form.reset();
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addAuthor = (author: string) => {
    const currentAuthors = form.getValues("authors");
    form.setValue("authors", [...currentAuthors, author]);
  };

  const removeAuthor = (index: number) => {
    const currentAuthors = form.getValues("authors");
    form.setValue(
      "authors",
      currentAuthors.filter((_, i) => i !== index)
    );
  };

  const addSubject = (subject: string) => {
    const currentSubjects = form.getValues("subjects");
    form.setValue("subjects", [...currentSubjects, subject]);
  };

  const removeSubject = (index: number) => {
    const currentSubjects = form.getValues("subjects");
    form.setValue(
      "subjects",
      currentSubjects.filter((_, i) => i !== index)
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden book-form-transition">
      <CardHeader className="space-y-1 bg-airbnb-light border-b p-6">
        <CardTitle className="text-2xl font-display flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-airbnb-red" />
          Adicionar Novo Livro
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <BookBasicInfo 
              control={form.control}
              authors={form.getValues("authors")}
              addAuthor={addAuthor}
              removeAuthor={removeAuthor}
              watch={form.watch}
            />
            
            <BookPublishingInfo control={form.control} />
            
            <BookDetailsInfo
              control={form.control}
              subjects={form.getValues("subjects")}
              addSubject={addSubject}
              removeSubject={removeSubject}
              watch={form.watch}
            />

            <Button
              type="submit"
              className={cn(
                "w-full bg-airbnb-red hover:bg-red-600 text-white transition-colors",
                isSubmitting && "opacity-50 cursor-not-allowed"
              )}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Adicionando Livro..."
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Livro
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BookForm;
