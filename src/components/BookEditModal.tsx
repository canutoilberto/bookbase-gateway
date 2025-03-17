import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Book, BookCategory } from "@/types/book";
import { useBooks } from "@/contexts/BookContext";
import { Save, Edit } from "lucide-react";
import BookBasicInfo from "./form/BookBasicInfo";
import BookDetailsInfo from "./form/BookDetailsInfo";

const formSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  authors: z.array(z.string().min(1, "Nome do autor é obrigatório")),
  year: z.string().regex(/^\d{4}$/, "Ano deve ser um número de 4 dígitos"),
  isbn: z
    .string()
    .regex(
      /^(?:ISBN(?:-1[03])?:? )?(\d{9}[\dX]|\d{13})$/i,
      "Formato de ISBN inválido"
    ),
  category: z.nativeEnum(BookCategory, {
    errorMap: () => ({ message: "Por favor selecione uma categoria" }),
  }),
  review: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface BookEditModalProps {
  book: Book | null;
  onClose: () => void;
}

const BookEditModal: React.FC<BookEditModalProps> = ({ book, onClose }) => {
  const { updateBook } = useBooks();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      authors: [],
      year: new Date().getFullYear().toString(),
      isbn: "",
      category: BookCategory.OTHER,
      review: "",
    },
  });

  // Update form values when book changes
  useEffect(() => {
    if (book) {
      form.reset({
        title: book.title,
        authors: book.authors,
        year: book.year,
        isbn: book.isbn,
        category: book.category,
        review: book.review || "",
      });
    }
  }, [book, form]);

  const onSubmit = async (values: FormValues) => {
    if (!book) return;

    setIsSubmitting(true);
    try {
      const bookData = {
        title: values.title,
        authors: values.authors,
        publisher: book.publisher,
        edition: book.edition,
        year: values.year,
        location: book.location,
        isbn: values.isbn,
        language: book.language,
        category: values.category,
        subjects: book.subjects,
        review: values.review || "",
      };

      await updateBook(book.id, bookData);
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar livro:", error);
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
    <Dialog open={!!book} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Edit className="w-5 h-5 text-airbnb-red" />
            Editar Livro
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <BookBasicInfo
              control={form.control}
              authors={form.getValues("authors")}
              addAuthor={addAuthor}
              removeAuthor={removeAuthor}
              watch={form.watch}
            />

            <BookDetailsInfo control={form.control} simplified={true} />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-airbnb-red hover:bg-red-600 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Salvando..."
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BookEditModal;
