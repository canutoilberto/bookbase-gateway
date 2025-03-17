
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface BookPublishingInfoProps {
  control: Control<any>;
}

const BookPublishingInfo: React.FC<BookPublishingInfoProps> = ({
  control,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={control}
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
        control={control}
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
        control={control}
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
        control={control}
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
  );
};

export default BookPublishingInfo;
