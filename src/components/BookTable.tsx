import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatAuthors, formatSubjects } from "@/lib/book-utils";
import { useBooks } from "@/contexts/BookContext";
import { BookSearchCriteria } from "@/types/book";
import { Search } from "lucide-react";

const BookTable: React.FC = () => {
  const {
    filteredBooks,
    searchCriteria,
    setSearchCriteria,
    searchQuery,
    setSearchQuery,
    isLoading,
  } = useBooks();

  const handleSearchCriteriaChange = (value: string) => {
    setSearchCriteria(value as BookSearchCriteria);
  };

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-pulse text-airbnb-gray">
          Carregando livros...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1">
          <Input
            placeholder="Pesquisar livros..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 input-transition"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-airbnb-gray w-4 h-4" />
        </div>
        <Select
          value={searchCriteria}
          onValueChange={handleSearchCriteriaChange}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Pesquisar por..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="catalogCode">Cód do Catálogo</SelectItem>
            <SelectItem value="title">Título</SelectItem>
            <SelectItem value="subjects">Assunto</SelectItem>
            <SelectItem value="language">Idioma</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-airbnb-light">
            <TableRow>
              <TableHead className="w-[100px]">Cód</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Autores</TableHead>
              <TableHead>Editora</TableHead>
              <TableHead>Idioma</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Assuntos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBooks.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-airbnb-gray"
                >
                  Nenhum livro encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredBooks.map((book) => (
                <TableRow
                  key={book.id}
                  className="table-row-hover hover:bg-airbnb-light/50"
                >
                  <TableCell className="font-mono text-sm">
                    {book.catalogCode}
                  </TableCell>
                  <TableCell className="font-medium">{book.title}</TableCell>
                  <TableCell>{formatAuthors(book.authors)}</TableCell>
                  <TableCell>{book.publisher}</TableCell>
                  <TableCell>{book.language}</TableCell>
                  <TableCell>{book.category}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {formatSubjects(book.subjects)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BookTable;
