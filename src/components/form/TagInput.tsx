
import React, { useState } from "react";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, X } from "lucide-react";

interface TagInputProps {
  label: string;
  values: string[];
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
  placeholder: string;
}

const TagInput: React.FC<TagInputProps> = ({
  label,
  values,
  onAdd,
  onRemove,
  placeholder,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-2">
      <FormLabel>{label}</FormLabel>
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          className="input-transition"
          onKeyPress={handleKeyPress}
        />
        <Button
          type="button"
          onClick={handleAdd}
          variant="outline"
          size="icon"
        >
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {values.map((value, index) => (
          <div
            key={index}
            className="bg-airbnb-light rounded-full px-3 py-1 flex items-center gap-2 animate-fade-in"
          >
            <span className="text-sm">{value}</span>
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="text-airbnb-red hover:text-red-700 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagInput;
