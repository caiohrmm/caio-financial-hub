
import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { BalanceSummary } from "@/components/finance/balance-summary";
import { TransactionList } from "@/components/finance/transaction-list";
import { IncomeExpenseChart } from "@/components/finance/income-expense-chart";
import { ExpenseChart } from "@/components/finance/expense-chart";
import { Transaction } from "@/context/finance-context";
import { TransactionDialog } from "@/components/finance/transaction-dialog";
import { FinanceCard, FinanceCardContent, FinanceCardHeader, FinanceCardTitle } from "@/components/ui/finance-card";
import { PlusCircle } from "lucide-react";

export default function Dashboard() {
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>(undefined);

  const handleAddTransaction = () => {
    setSelectedTransaction(undefined);
    setTransactionDialogOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setTransactionDialogOpen(true);
  };

  return (
    <>
      <PageHeader
        title="Resumo Financeiro"
        description="Visualize sua situação financeira atual"
      >
        <Button onClick={handleAddTransaction}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Nova Transação
        </Button>
      </PageHeader>

      <div className="mb-8">
        <BalanceSummary />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <IncomeExpenseChart />
        <ExpenseChart />
      </div>

      <FinanceCard>
        <FinanceCardHeader>
          <FinanceCardTitle>Transações Recentes</FinanceCardTitle>
        </FinanceCardHeader>
        <FinanceCardContent>
          <TransactionList
            limit={5}
            onEdit={handleEditTransaction}
            onDelete={() => {}}
          />
          <div className="mt-4 flex justify-center">
            <Button variant="outline" size="sm" asChild>
              <a href="/transactions">Ver todas as transações</a>
            </Button>
          </div>
        </FinanceCardContent>
      </FinanceCard>

      <TransactionDialog
        open={transactionDialogOpen}
        onOpenChange={setTransactionDialogOpen}
        transaction={selectedTransaction}
      />
    </>
  );
}
