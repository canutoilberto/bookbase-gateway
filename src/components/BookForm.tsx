
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookCategory, BookFormData, BookLanguage } from "@/types/book";
import { useBooks } from "@/contexts/BookContext";
import { BookOpen, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import BookBasicInfo from "./form/BookBasicInfo";
import BookDetailsInfo from "./form/BookDetailsInfo";
import { format } from "date-fns";

// Schema de validação
const formSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  authors: z.array(z.string().min(1, "Nome do autor é obrigatório")),
  year: z.string().regex(/^\d{4}$/, "Ano deve ser um número de 4 dígitos"),
  isbn: z.string().regex(
    /^(?:ISBN(?:-1[03])?:? )?(\d{9}[\dX]|\d{13})$/i,
    "Formato de ISBN inválido"
  ),
  category: z.nativeEnum(BookCategory, {
    errorMap: () => ({ message: "Por favor selecione uma categoria" }),
  }),
  edition: z.string().optional(),
  acquisitionDate: z.date().optional(),
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
      year: new Date().getFullYear().toString(),
      isbn: "",
      edition: "",
      category: BookCategory.OTHER,
      acquisitionDate: undefined,
      review: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const bookData: BookFormData = {
        title: values.title,
        authors: values.authors,
        publisher: "", // Campo simplificado
        edition: values.edition || "",
        year: values.year,
        location: "", // Campo simplificado
        isbn: values.isbn,
        language: BookLanguage.PORTUGUESE,
        category: values.category,
        subjects: [], // Campo simplificado
        acquisitionDate: values.acquisitionDate,
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

            <BookDetailsInfo 
              control={form.control} 
              simplified={false}
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
