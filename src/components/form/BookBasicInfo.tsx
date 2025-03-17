
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import TagInput from "./TagInput";

interface BookBasicInfoProps {
  control: Control<any>;
  authors: string[];
  addAuthor: (author: string) => void;
  removeAuthor: (index: number) => void;
  watch: (field: string) => any;
}

const BookBasicInfo: React.FC<BookBasicInfoProps> = ({
  control,
  authors,
  addAuthor,
  removeAuthor,
  watch,
}) => {
  return (
    <>
      <FormField
        control={control}
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

      <TagInput
        label="Autores"
        values={watch("authors")}
        onAdd={addAuthor}
        onRemove={removeAuthor}
        placeholder="Digite o nome do autor"
      />
    </>
  );
};

export default BookBasicInfo;
