
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
  title: z.string().min(1, "Title is required"),
  authors: z.array(z.string().min(1, "Author name is required")),
  publisher: z.string().min(1, "Publisher is required"),
  edition: z.string().min(1, "Edition is required"),
  year: z.string().regex(/^\d{4}$/, "Year must be a 4-digit number"),
  location: z.string().min(1, "Location is required"),
  isbn: z
    .string()
    .regex(
      /^(?:ISBN(?:-1[03])?:?\ )?((?=\d{1,5}([ -]?)\d{1,7}\2?\d{1,6}\2?\d)(?:\d\2*){9}[\dX])$/i,
      "Invalid ISBN format"
    ),
  language: z.nativeEnum(BookLanguage, {
    errorMap: () => ({ message: "Please select a language" }),
  }),
  category: z.nativeEnum(BookCategory, {
    errorMap: () => ({ message: "Please select a category" }),
  }),
  subjects: z.array(z.string().min(1, "Subject is required")),
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
      };
      addBook(bookData);
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
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
          Add New Book
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
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="input-transition"
                      placeholder="Enter book title"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Authors</FormLabel>
              <div className="flex gap-2">
                <Input
                  value={authorInput}
                  onChange={(e) => setAuthorInput(e.target.value)}
                  placeholder="Enter author name"
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
                    <FormLabel>Publisher</FormLabel>
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
                    <FormLabel>Edition</FormLabel>
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
                    <FormLabel>Year</FormLabel>
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
                    <FormLabel>Location</FormLabel>
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
                    <FormLabel>Language</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
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
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
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
              <FormLabel>Subjects</FormLabel>
              <div className="flex gap-2">
                <Input
                  value={subjectInput}
                  onChange={(e) => setSubjectInput(e.target.value)}
                  placeholder="Enter subject"
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
                  <FormLabel>Review</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="min-h-[100px] input-transition"
                      placeholder="Write a review or notes about the book..."
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
                "Adding Book..."
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Book
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
