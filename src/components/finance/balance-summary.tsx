
import { FinanceCard } from "@/components/ui/finance-card";
import { FinanceStat } from "@/components/ui/finance-stat";
import { useFinance } from "@/context/finance-context";
import { ArrowDownCircle, ArrowUpCircle, Wallet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function BalanceSummary() {
  const { getTotalIncome, getTotalExpenses, getBalance, loading } = useFinance();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <FinanceCard key={i}>
            <Skeleton className="h-4 w-1/2 mb-4" />
            <Skeleton className="h-8 w-3/4" />
          </FinanceCard>
        ))}
      </div>
    );
  }

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const balance = getBalance();
  const income = getTotalIncome();
  const expenses = getTotalExpenses();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FinanceCard>
        <FinanceStat
          title="Saldo atual"
          value={formatCurrency(balance)}
          icon={<Wallet className="h-5 w-5 text-finance-blue-500" />}
          valueClassName={balance >= 0 ? "text-finance-blue-500" : "text-finance-red"}
          iconClassName="bg-finance-blue-50 text-finance-blue-500"
        />
      </FinanceCard>

      <FinanceCard variant="income">
        <FinanceStat
          title="Receitas"
          value={formatCurrency(income)}
          icon={<ArrowUpCircle className="h-5 w-5 text-finance-green" />}
          valueClassName="text-finance-green"
          iconClassName="bg-finance-green-light text-finance-green"
        />
      </FinanceCard>

      <FinanceCard variant="expense">
        <FinanceStat
          title="Despesas"
          value={formatCurrency(expenses)}
          icon={<ArrowDownCircle className="h-5 w-5 text-finance-red" />}
          valueClassName="text-finance-red"
          iconClassName="bg-finance-red-light text-finance-red"
        />
      </FinanceCard>
    </div>
  );
}
