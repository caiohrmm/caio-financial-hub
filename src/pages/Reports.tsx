
import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { 
  FinanceCard, 
  FinanceCardContent, 
  FinanceCardHeader, 
  FinanceCardTitle 
} from "@/components/ui/finance-card";
import { useFinance } from "@/context/finance-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CalendarRange, Download, FileText } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { FinanceStat } from "@/components/ui/finance-stat";

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

export default function Reports() {
  const { transactions } = useFinance();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Calculate report data
  const filteredTransactions = transactions.filter((transaction) => {
    if (!startDate && !endDate) return true;
    
    const transactionDate = new Date(transaction.date);
    const start = startDate ? new Date(startDate) : new Date(0);
    const end = endDate ? new Date(endDate) : new Date();
    
    return transactionDate >= start && transactionDate <= end;
  });

  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Category data for pie chart
  const categoryData = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc: Record<string, number>, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const pieChartData = Object.entries(categoryData)
    .map(([category, amount]) => ({
      name: getCategoryLabel(category),
      value: amount,
      category,
    }))
    .sort((a, b) => b.value - a.value);

  // Monthly data for bar chart
  const monthlyData: Record<string, { income: number; expenses: number }> = {};

  filteredTransactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { income: 0, expenses: 0 };
    }
    
    if (transaction.type === "income") {
      monthlyData[monthKey].income += transaction.amount;
    } else {
      monthlyData[monthKey].expenses += transaction.amount;
    }
  });

  const chartData = Object.entries(monthlyData)
    .map(([month, data]) => {
      const [year, monthNum] = month.split("-");
      const date = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
      const monthName = date.toLocaleString("pt-BR", { month: "short" });

      return {
        month: `${monthName.charAt(0).toUpperCase() + monthName.slice(1)}/${year.slice(2)}`,
        receitas: data.income,
        despesas: data.expenses,
      };
    })
    .sort((a, b) => {
      const [monthA, yearA] = a.month.split("/");
      const [monthB, yearB] = b.month.split("/");
      
      if (yearA === yearB) {
        return getMonthIndex(monthA) - getMonthIndex(monthB);
      }
      
      return parseInt(yearA) - parseInt(yearB);
    });

  function getMonthIndex(month: string): number {
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    return months.indexOf(month);
  }

  function getCategoryLabel(category: string): string {
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
  }

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

  const PieTooltip = ({ active, payload }: any) => {
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
    <>
      <PageHeader
        title="Relatórios"
        description="Analise seus dados financeiros"
      >
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            PDF
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Excel
          </Button>
        </div>
      </PageHeader>

      <FinanceCard className="mb-6">
        <FinanceCardHeader>
          <FinanceCardTitle>Filtrar por período</FinanceCardTitle>
        </FinanceCardHeader>
        <FinanceCardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="grid w-full sm:max-w-xs items-center gap-1.5">
              <Label htmlFor="start-date">Data inicial</Label>
              <div className="relative">
                <CalendarRange className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  id="start-date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="grid w-full sm:max-w-xs items-center gap-1.5">
              <Label htmlFor="end-date">Data final</Label>
              <div className="relative">
                <CalendarRange className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  id="end-date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        </FinanceCardContent>
      </FinanceCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <FinanceCard>
          <FinanceStat
            title="Saldo"
            value={formatCurrency(balance)}
            valueClassName={balance >= 0 ? "text-finance-blue-500" : "text-finance-red"}
          />
        </FinanceCard>
        <FinanceCard variant="income">
          <FinanceStat
            title="Total de receitas"
            value={formatCurrency(totalIncome)}
            valueClassName="text-finance-green"
          />
        </FinanceCard>
        <FinanceCard variant="expense">
          <FinanceStat
            title="Total de despesas"
            value={formatCurrency(totalExpenses)}
            valueClassName="text-finance-red"
          />
        </FinanceCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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

        <FinanceCard>
          <FinanceCardHeader>
            <FinanceCardTitle>Distribuição de despesas</FinanceCardTitle>
          </FinanceCardHeader>
          <FinanceCardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
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
                    {pieChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {pieChartData.slice(0, 6).map((entry, index) => (
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
      </div>
    </>
  );
}
