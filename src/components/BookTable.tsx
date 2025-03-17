
import React, { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { formatAuthors } from "@/lib/book-utils";
import { useBooks } from "@/contexts/BookContext";
import { BookSearchCriteria } from "@/types/book";
import { Search, Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";

const BookTable: React.FC = () => {
  const {
    filteredBooks,
    searchCriteria,
    setSearchCriteria,
    searchQuery,
    setSearchQuery,
    isLoading,
    deleteBook,
  } = useBooks();
  
  const [bookToDelete, setBookToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSearchCriteriaChange = (value: string) => {
    setSearchCriteria(value as BookSearchCriteria);
  };

  const handleEditBook = (id: string) => {
    navigate(`/edit/${id}`);
  };

  const handleDeleteConfirm = async () => {
    if (bookToDelete) {
      await deleteBook(bookToDelete);
      setBookToDelete(null);
    }
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
              <TableHead>Ano</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="w-[80px] text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBooks.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
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
                  <TableCell>{book.year}</TableCell>
                  <TableCell>{book.category}</TableCell>
                  <TableCell>
                    <div className="flex justify-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditBook(book.id)}
                        title="Editar livro"
                        className="h-8 w-8 text-airbnb-navy hover:text-airbnb-red hover:bg-airbnb-light"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setBookToDelete(book.id)}
                        title="Excluir livro"
                        className="h-8 w-8 text-airbnb-navy hover:text-destructive hover:bg-airbnb-light"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!bookToDelete} onOpenChange={(open) => !open && setBookToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O livro será permanentemente removido da sua coleção.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BookTable;
