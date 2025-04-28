import { BookProvider } from "@/contexts/BookContext";
import BookForm from "@/components/BookForm";
import BookTable from "@/components/BookTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, ListFilter } from "lucide-react";

const Index = () => {
  return (
    <BookProvider>
      <div className="min-h-screen bg-white">
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-display text-airbnb-navy flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-airbnb-red" />
              Sistema de Gerenciamento de Livros
            </h1>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Tabs defaultValue="catalog" className="space-y-6">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger
                value="catalog"
                className="data-[state=active]:bg-airbnb-red data-[state=active]:text-white"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Adicionar Livro
              </TabsTrigger>
              <TabsTrigger
                value="list"
                className="data-[state=active]:bg-airbnb-red data-[state=active]:text-white"
              >
                <ListFilter className="w-4 h-4 mr-2" />
                Lista de Livros
              </TabsTrigger>
            </TabsList>

            <TabsContent value="catalog" className="animate-fade-up">
              <BookForm />
            </TabsContent>

            <TabsContent value="list" className="animate-fade-up">
              <BookTable />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </BookProvider>
  );
};

export default Index;
