
import { useFinance, Transaction, TransactionStatus } from "@/context/finance-context";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit2, MoreVertical, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const statusMap: Record<TransactionStatus, { label: string; variant: "default" | "outline" | "secondary" | "destructive" }> = {
  completed: { label: "Concluído", variant: "default" },
  pending: { label: "Pendente", variant: "secondary" },
  overdue: { label: "Atrasado", variant: "destructive" },
};

interface TransactionItemProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

function TransactionItem({ transaction, onEdit, onDelete }: TransactionItemProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getCategoryLabel = (category: string) => {
    const categoryMap: Record<string, string> = {
      salary: "Salário",
      investment: "Investimentos",
      freelance: "Freelance",
      gift: "Presente",
      housing: "Moradia",
      food: "Alimentação",
      transportation: "Transporte",
      utilities: "Serviços",
      healthcare: "Saúde",
      entertainment: "Entretenimento",
      education: "Educação",
      shopping: "Compras",
      other: "Outros",
    };
    return categoryMap[category] || category;
  };

  const getTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="flex items-center justify-between py-4 px-4 hover:bg-muted/50 rounded-lg transition-colors duration-200">
      <div className="flex items-center gap-3">
        <div
          className={`h-10 w-10 rounded-full flex items-center justify-center ${
            transaction.type === "income"
              ? "bg-finance-green-light text-finance-green"
              : "bg-finance-red-light text-finance-red"
          }`}
        >
          {transaction.type === "income" ? "+" : "-"}
        </div>
        <div>
          <p className="font-medium">{transaction.description}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{getCategoryLabel(transaction.category)}</span>
            <span>•</span>
            <span>{getTimeAgo(transaction.date)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Badge variant={statusMap[transaction.status].variant}>
          {statusMap[transaction.status].label}
        </Badge>
        <span
          className={`font-semibold ${
            transaction.type === "income"
              ? "text-finance-green"
              : "text-finance-red"
          }`}
        >
          {transaction.type === "income" ? "+" : "-"}
          {formatCurrency(transaction.amount)}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onEdit(transaction)}>
              <Edit2 className="h-4 w-4 mr-2" />
              <span>Editar</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(transaction.id)}
              className="text-finance-red focus:text-finance-red"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              <span>Excluir</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

interface TransactionListProps {
  limit?: number;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionList({ limit, onEdit, onDelete }: TransactionListProps) {
  const { transactions, loading, deleteTransaction } = useFinance();

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between py-4 animate-pulse"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div>
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-5 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Sort transactions by date, newest first
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Apply limit if provided
  const displayedTransactions = limit
    ? sortedTransactions.slice(0, limit)
    : sortedTransactions;

  const handleDelete = (id: string) => {
    deleteTransaction(id);
    onDelete(id);
  };

  return (
    <div className="space-y-1 divide-y divide-border">
      {displayedTransactions.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">Nenhuma transação encontrada</p>
        </div>
      ) : (
        displayedTransactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            onEdit={onEdit}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
}
