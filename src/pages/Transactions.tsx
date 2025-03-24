
import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { TransactionList } from "@/components/finance/transaction-list";
import { Transaction, useFinance } from "@/context/finance-context";
import { TransactionDialog } from "@/components/finance/transaction-dialog";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Filter, PlusCircle, Search } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export default function Transactions() {
  const { transactions } = useFinance();
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const handleAddTransaction = () => {
    setSelectedTransaction(undefined);
    setTransactionDialogOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setTransactionDialogOpen(true);
  };

  // Filter transactions based on search and filters
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    
    const matchesType = 
      typeFilter === "all" || transaction.type === typeFilter;
    
    const matchesStatus = 
      statusFilter === "all" || transaction.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <>
      <PageHeader
        title="Transações"
        description="Gerencie suas receitas e despesas"
      >
        <Button onClick={handleAddTransaction}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Nova Transação
        </Button>
      </PageHeader>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar transações..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="income">Receitas</SelectItem>
              <SelectItem value="expense">Despesas</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filtrar por status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                  <span className="flex-1">Todos os status</span>
                  {statusFilter === "all" && <span>✓</span>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("completed")}>
                  <span className="flex-1">Concluído</span>
                  {statusFilter === "completed" && <span>✓</span>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                  <span className="flex-1">Pendente</span>
                  {statusFilter === "pending" && <span>✓</span>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("overdue")}>
                  <span className="flex-1">Atrasado</span>
                  {statusFilter === "overdue" && <span>✓</span>}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <TransactionList
          onEdit={handleEditTransaction}
          onDelete={() => {}}
        />
        
        {filteredTransactions.length === 0 && searchQuery && (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">
              Nenhuma transação encontrada para "{searchQuery}"
            </p>
          </div>
        )}
      </div>

      <TransactionDialog
        open={transactionDialogOpen}
        onOpenChange={setTransactionDialogOpen}
        transaction={selectedTransaction}
      />
    </>
  );
}
