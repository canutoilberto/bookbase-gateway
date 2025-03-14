
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookLanguage, BookCategory, BookFormData } from "@/types/book";
import { useBooks } from "@/contexts/BookContext";
import { PlusCircle, X, Save, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

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
      /^(?:ISBN(?:-1[03])?:?\ )?((?=\d{1,5}([ -]?)\d{1,7}\2?\d{1,6}\2?\d)(?:\d\2*){9}[\dX])$/i,
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
  const [authorInput, setAuthorInput] = useState("");
  const [subjectInput, setSubjectInput] = useState("");
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
        ...values,
        // Ensuring all required fields are provided
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
        review: values.review || "", // Providing an empty string as fallback
      };
      addBook(bookData);
      form.reset();
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addAuthor = () => {
    if (authorInput.trim()) {
      const currentAuthors = form.getValues("authors");
      form.setValue("authors", [...currentAuthors, authorInput.trim()]);
      setAuthorInput("");
    }
  };

  const removeAuthor = (index: number) => {
    const currentAuthors = form.getValues("authors");
    form.setValue(
      "authors",
      currentAuthors.filter((_, i) => i !== index)
    );
  };

  const addSubject = () => {
    if (subjectInput.trim()) {
      const currentSubjects = form.getValues("subjects");
      form.setValue("subjects", [...currentSubjects, subjectInput.trim()]);
      setSubjectInput("");
    }
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
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="input-transition"
                      placeholder="Digite o título do livro"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Autores</FormLabel>
              <div className="flex gap-2">
                <Input
                  value={authorInput}
                  onChange={(e) => setAuthorInput(e.target.value)}
                  placeholder="Digite o nome do autor"
                  className="input-transition"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addAuthor();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={addAuthor}
                  variant="outline"
                  size="icon"
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {form.watch("authors").map((author, index) => (
                  <div
                    key={index}
                    className="bg-airbnb-light rounded-full px-3 py-1 flex items-center gap-2 animate-fade-in"
                  >
                    <span className="text-sm">{author}</span>
                    <button
                      type="button"
                      onClick={() => removeAuthor(index)}
                      className="text-airbnb-red hover:text-red-700 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="publisher"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Editora</FormLabel>
                    <FormControl>
                      <Input {...field} className="input-transition" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="edition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Edição</FormLabel>
                    <FormControl>
                      <Input {...field} className="input-transition" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ano</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        className="input-transition"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localização</FormLabel>
                    <FormControl>
                      <Input {...field} className="input-transition" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isbn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ISBN</FormLabel>
                  <FormControl>
                    <Input {...field} className="input-transition" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Idioma</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o idioma" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(BookLanguage).map((language) => (
                          <SelectItem key={language} value={language}>
                            {language}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(BookCategory).map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormLabel>Assuntos</FormLabel>
              <div className="flex gap-2">
                <Input
                  value={subjectInput}
                  onChange={(e) => setSubjectInput(e.target.value)}
                  placeholder="Digite o assunto"
                  className="input-transition"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSubject();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={addSubject}
                  variant="outline"
                  size="icon"
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {form.watch("subjects").map((subject, index) => (
                  <div
                    key={index}
                    className="bg-airbnb-light rounded-full px-3 py-1 flex items-center gap-2 animate-fade-in"
                  >
                    <span className="text-sm">{subject}</span>
                    <button
                      type="button"
                      onClick={() => removeSubject(index)}
                      className="text-airbnb-red hover:text-red-700 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <FormField
              control={form.control}
              name="review"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resenha</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="min-h-[100px] input-transition"
                      placeholder="Escreva uma resenha ou notas sobre o livro..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
