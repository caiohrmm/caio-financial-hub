
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Transaction,
  TransactionCategory,
  TransactionStatus,
  TransactionType,
  useFinance,
} from "@/context/finance-context";
import { useState, useEffect } from "react";

const initialTransactionState: Omit<Transaction, "id"> = {
  description: "",
  amount: 0,
  date: new Date().toISOString().split("T")[0],
  type: "expense",
  category: "other",
  status: "completed",
};

interface TransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction;
}

export function TransactionDialog({
  open,
  onOpenChange,
  transaction,
}: TransactionDialogProps) {
  const { addTransaction, updateTransaction } = useFinance();
  const [formData, setFormData] = useState<Omit<Transaction, "id">>(
    initialTransactionState
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when dialog opens/closes or transaction changes
  useEffect(() => {
    if (open) {
      if (transaction) {
        setFormData({
          description: transaction.description,
          amount: transaction.amount,
          date: transaction.date,
          type: transaction.type,
          category: transaction.category,
          status: transaction.status,
        });
      } else {
        setFormData(initialTransactionState);
      }
      setErrors({});
    }
  }, [open, transaction]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || 0 : value,
    }));
    
    // Clear error when field changes
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when field changes
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.description.trim()) {
      newErrors.description = "Descrição é obrigatória";
    }

    if (formData.amount <= 0) {
      newErrors.amount = "Valor deve ser maior que zero";
    }

    if (!formData.date) {
      newErrors.date = "Data é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (transaction) {
      updateTransaction(transaction.id, formData);
    } else {
      addTransaction(formData);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {transaction ? "Editar transação" : "Nova transação"}
          </DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para {transaction ? "editar a" : "adicionar uma nova"} transação.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? "border-finance-red" : ""}
            />
            {errors.description && (
              <p className="text-xs text-finance-red">{errors.description}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="amount">Valor</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              className={errors.amount ? "border-finance-red" : ""}
            />
            {errors.amount && (
              <p className="text-xs text-finance-red">{errors.amount}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className={errors.date ? "border-finance-red" : ""}
            />
            {errors.date && (
              <p className="text-xs text-finance-red">{errors.date}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="type">Tipo</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleSelectChange("type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Receita</SelectItem>
                <SelectItem value="expense">Despesa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Categoria</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleSelectChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {formData.type === "income" ? (
                  <>
                    <SelectItem value="salary">Salário</SelectItem>
                    <SelectItem value="investment">Investimentos</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="gift">Presente</SelectItem>
                    <SelectItem value="other">Outros</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="housing">Moradia</SelectItem>
                    <SelectItem value="food">Alimentação</SelectItem>
                    <SelectItem value="transportation">Transporte</SelectItem>
                    <SelectItem value="utilities">Serviços</SelectItem>
                    <SelectItem value="healthcare">Saúde</SelectItem>
                    <SelectItem value="entertainment">Entretenimento</SelectItem>
                    <SelectItem value="education">Educação</SelectItem>
                    <SelectItem value="shopping">Compras</SelectItem>
                    <SelectItem value="other">Outros</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleSelectChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completed">Concluído</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="overdue">Atrasado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            {transaction ? "Salvar alterações" : "Adicionar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
