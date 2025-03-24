
import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// Mock data for categories
const initialCategories = [
  { id: 1, name: "Moradia", color: "#4F46E5", type: "expense" },
  { id: 2, name: "Alimentação", color: "#10B981", type: "expense" },
  { id: 3, name: "Transporte", color: "#F59E0B", type: "expense" },
  { id: 4, name: "Lazer", color: "#EC4899", type: "expense" },
  { id: 5, name: "Saúde", color: "#EF4444", type: "expense" },
  { id: 6, name: "Educação", color: "#6366F1", type: "expense" },
  { id: 7, name: "Salário", color: "#3B82F6", type: "income" },
  { id: 8, name: "Freelance", color: "#8B5CF6", type: "income" },
  { id: 9, name: "Investimentos", color: "#059669", type: "income" },
];

type Category = {
  id: number;
  name: string;
  color: string;
  type: "income" | "expense";
};

const Categories = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [newCategory, setNewCategory] = useState<Omit<Category, "id">>({
    name: "",
    color: "#4F46E5",
    type: "expense",
  });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) {
      toast({
        title: "Erro",
        description: "O nome da categoria é obrigatório",
        variant: "destructive",
      });
      return;
    }

    const newId = Math.max(...categories.map((c) => c.id), 0) + 1;
    setCategories([...categories, { ...newCategory, id: newId }]);
    setNewCategory({ name: "", color: "#4F46E5", type: "expense" });
    toast({
      title: "Sucesso",
      description: "Categoria adicionada com sucesso",
    });
  };

  const handleUpdateCategory = () => {
    if (!editingCategory || !editingCategory.name.trim()) {
      toast({
        title: "Erro",
        description: "O nome da categoria é obrigatório",
        variant: "destructive",
      });
      return;
    }

    setCategories(
      categories.map((c) => (c.id === editingCategory.id ? editingCategory : c))
    );
    setEditingCategory(null);
    toast({
      title: "Sucesso",
      description: "Categoria atualizada com sucesso",
    });
  };

  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter((c) => c.id !== id));
    toast({
      title: "Sucesso",
      description: "Categoria excluída com sucesso",
    });
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <PageHeader 
        title="Categorias" 
        description="Gerencie as categorias para organizar suas transações."
      >
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Categoria</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, name: e.target.value })
                  }
                  placeholder="Nome da categoria"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="color">Cor</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="color"
                    type="color"
                    value={newCategory.color}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, color: e.target.value })
                    }
                    className="w-16 h-10 p-1"
                  />
                  <span className="text-sm text-muted-foreground">
                    {newCategory.color}
                  </span>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Tipo</Label>
                <select
                  id="type"
                  value={newCategory.type}
                  onChange={(e) =>
                    setNewCategory({
                      ...newCategory,
                      type: e.target.value as "income" | "expense",
                    })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="expense">Despesa</option>
                  <option value="income">Receita</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button onClick={handleAddCategory}>Adicionar</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card key={category.id} className="animate-fade-up">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  ></div>
                  {category.name}
                </div>
                <div className="flex items-center gap-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Categoria</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="edit-name">Nome</Label>
                          <Input
                            id="edit-name"
                            value={editingCategory?.name || ""}
                            onChange={(e) =>
                              setEditingCategory(
                                editingCategory
                                  ? {
                                      ...editingCategory,
                                      name: e.target.value,
                                    }
                                  : null
                              )
                            }
                            placeholder="Nome da categoria"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="edit-color">Cor</Label>
                          <div className="flex gap-2 items-center">
                            <Input
                              id="edit-color"
                              type="color"
                              value={editingCategory?.color || ""}
                              onChange={(e) =>
                                setEditingCategory(
                                  editingCategory
                                    ? {
                                        ...editingCategory,
                                        color: e.target.value,
                                      }
                                    : null
                                )
                              }
                              className="w-16 h-10 p-1"
                            />
                            <span className="text-sm text-muted-foreground">
                              {editingCategory?.color}
                            </span>
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="edit-type">Tipo</Label>
                          <select
                            id="edit-type"
                            value={editingCategory?.type || "expense"}
                            onChange={(e) =>
                              setEditingCategory(
                                editingCategory
                                  ? {
                                      ...editingCategory,
                                      type: e.target.value as "income" | "expense",
                                    }
                                  : null
                              )
                            }
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="expense">Despesa</option>
                            <option value="income">Receita</option>
                          </select>
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancelar</Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button onClick={handleUpdateCategory}>Salvar</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {category.type === "income" ? "Receita" : "Despesa"}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Categories;
