
import { useFinance, TransactionCategory } from "@/context/finance-context";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { FinanceCard, FinanceCardContent, FinanceCardHeader, FinanceCardTitle } from "@/components/ui/finance-card";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = [
  "#0055CC", // Primary blue
  "#338eff",
  "#66aaff",
  "#99c7ff",
  "#cce3ff",
  "#22C55E", // Green
  "#10B981",
  "#059669",
  "#047857",
  "#065F46",
];

interface CategoryData {
  name: string;
  value: number;
  category: TransactionCategory;
}

const categoryLabels: Record<TransactionCategory, string> = {
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

export function ExpenseChart() {
  const { getCategoryTotals, loading } = useFinance();

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

  const categoryTotals = getCategoryTotals();

  // Transform data for chart
  const data: CategoryData[] = Object.entries(categoryTotals)
    .filter(([_, value]) => value > 0)
    .map(([category, value]) => ({
      name: categoryLabels[category as TransactionCategory] || category,
      value,
      category: category as TransactionCategory,
    }))
    .sort((a, b) => b.value - a.value);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border border-border rounded-lg shadow-md">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-finance-blue-500 font-semibold">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <FinanceCard>
      <FinanceCardHeader>
        <FinanceCardTitle>Despesas por categoria</FinanceCardTitle>
      </FinanceCardHeader>
      <FinanceCardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                innerRadius={50}
                fill="#8884d8"
                dataKey="value"
                animationDuration={500}
                animationBegin={200}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {data.slice(0, 6).map((entry, index) => (
            <div key={entry.category} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></div>
              <span className="text-xs truncate">{entry.name}</span>
            </div>
          ))}
        </div>
      </FinanceCardContent>
    </FinanceCard>
  );
}
