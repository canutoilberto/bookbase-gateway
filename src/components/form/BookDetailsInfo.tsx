
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookLanguage, BookCategory } from "@/types/book";
import { Control } from "react-hook-form";
import TagInput from "./TagInput";

interface BookDetailsInfoProps {
  control: Control<any>;
  subjects: string[];
  addSubject: (subject: string) => void;
  removeSubject: (index: number) => void;
  watch: (field: string) => any;
}

const BookDetailsInfo: React.FC<BookDetailsInfoProps> = ({
  control,
  subjects,
  addSubject,
  removeSubject,
  watch,
}) => {
  return (
    <>
      <FormField
        control={control}
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
          control={control}
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
          control={control}
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

      <TagInput
        label="Assuntos"
        values={watch("subjects")}
        onAdd={addSubject}
        onRemove={removeSubject}
        placeholder="Digite o assunto"
      />

      <FormField
        control={control}
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
    </>
  );
};

export default BookDetailsInfo;
