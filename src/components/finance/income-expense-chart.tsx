
import { useFinance } from "@/context/finance-context";
import { FinanceCard, FinanceCardContent, FinanceCardHeader, FinanceCardTitle } from "@/components/ui/finance-card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

export function IncomeExpenseChart() {
  const { transactions, loading } = useFinance();

  if (loading) {
    return (
      <FinanceCard>
        <FinanceCardHeader>
          <Skeleton className="h-6 w-40" />
        </FinanceCardHeader>
        <FinanceCardContent>
          <Skeleton className="h-64 w-full" />
        </FinanceCardContent>
      </FinanceCard>
    );
  }

  // Group by month
  const monthlyData: Record<string, { income: number; expenses: number }> = {};

  // Get last 6 months
  const today = new Date();
  for (let i = 5; i >= 0; i--) {
    const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthKey = `${month.getFullYear()}-${month.getMonth() + 1}`;
    monthlyData[monthKey] = { income: 0, expenses: 0 };
  }

  // Populate with transaction data
  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
    
    if (monthlyData[monthKey]) {
      if (transaction.type === "income") {
        monthlyData[monthKey].income += transaction.amount;
      } else {
        monthlyData[monthKey].expenses += transaction.amount;
      }
    }
  });

  // Format data for chart
  const chartData = Object.entries(monthlyData).map(([month, data]) => {
    const [year, monthNum] = month.split("-");
    const date = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
    const monthName = date.toLocaleString("pt-BR", { month: "short" });

    return {
      month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
      receitas: data.income,
      despesas: data.expenses,
    };
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border border-border rounded-lg shadow-md">
          <p className="font-medium mb-1">{label}</p>
          <p className="text-xs text-finance-green flex items-center justify-between">
            <span>Receitas:</span>
            <span className="font-semibold ml-2">
              {formatCurrency(payload[0].value)}
            </span>
          </p>
          <p className="text-xs text-finance-red flex items-center justify-between">
            <span>Despesas:</span>
            <span className="font-semibold ml-2">
              {formatCurrency(payload[1].value)}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <FinanceCard>
      <FinanceCardHeader>
        <FinanceCardTitle>Receitas vs Despesas</FinanceCardTitle>
      </FinanceCardHeader>
      <FinanceCardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              barGap={10}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "#E2E8F0" }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "#E2E8F0" }}
                tickFormatter={(value) => `R$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="receitas" 
                fill="#22C55E" 
                radius={[4, 4, 0, 0]} 
                animationDuration={1000}
              />
              <Bar 
                dataKey="despesas" 
                fill="#FF5A5A" 
                radius={[4, 4, 0, 0]} 
                animationDuration={1000}
                animationBegin={300}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </FinanceCardContent>
    </FinanceCard>
  );
}
