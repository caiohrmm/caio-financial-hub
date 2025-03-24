
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { toast } from "sonner";

// Types
export type TransactionType = "income" | "expense";

export type TransactionStatus = "completed" | "pending" | "overdue";

export type TransactionCategory =
  | "salary"
  | "investment"
  | "freelance"
  | "gift"
  | "housing"
  | "food"
  | "transportation"
  | "utilities"
  | "healthcare"
  | "entertainment"
  | "education"
  | "shopping"
  | "other";

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: TransactionType;
  category: TransactionCategory;
  status: TransactionStatus;
}

interface FinanceContextValue {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  getTransactionsByPeriod: (startDate: string, endDate: string) => Transaction[];
  getTransactionsByCategory: (category: TransactionCategory) => Transaction[];
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getBalance: () => number;
  getCategoryTotals: () => Record<TransactionCategory, number>;
  loading: boolean;
}

// Mock data
const mockTransactions: Transaction[] = [
  {
    id: "t1",
    description: "Salário",
    amount: 5000,
    date: "2023-06-05",
    type: "income",
    category: "salary",
    status: "completed",
  },
  {
    id: "t2",
    description: "Aluguel",
    amount: 1200,
    date: "2023-06-10",
    type: "expense",
    category: "housing",
    status: "completed",
  },
  {
    id: "t3",
    description: "Supermercado",
    amount: 450,
    date: "2023-06-15",
    type: "expense",
    category: "food",
    status: "completed",
  },
  {
    id: "t4",
    description: "Internet",
    amount: 120,
    date: "2023-06-22",
    type: "expense",
    category: "utilities",
    status: "completed",
  },
  {
    id: "t5",
    description: "Freelance Design",
    amount: 2000,
    date: "2023-06-25",
    type: "income",
    category: "freelance",
    status: "completed",
  },
  {
    id: "t6",
    description: "Academia",
    amount: 100,
    date: "2023-06-05",
    type: "expense",
    category: "healthcare",
    status: "completed",
  },
  {
    id: "t7",
    description: "Jantar fora",
    amount: 150,
    date: "2023-06-18",
    type: "expense",
    category: "food",
    status: "completed",
  },
  {
    id: "t8",
    description: "Uber",
    amount: 50,
    date: "2023-06-20",
    type: "expense",
    category: "transportation",
    status: "completed",
  },
  {
    id: "t9",
    description: "Streaming",
    amount: 45,
    date: "2023-06-10",
    type: "expense",
    category: "entertainment",
    status: "completed",
  },
  {
    id: "t10",
    description: "Dividendos",
    amount: 300,
    date: "2023-06-15",
    type: "income",
    category: "investment",
    status: "completed",
  },
];

// Create context
const FinanceContext = createContext<FinanceContextValue | null>(null);

// Context provider component
export function FinanceProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize with mock data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Load from local storage or use mock data
        const storedData = localStorage.getItem("finance_transactions");
        if (storedData) {
          setTransactions(JSON.parse(storedData));
        } else {
          setTransactions(mockTransactions);
        }
      } catch (error) {
        console.error("Failed to load transactions:", error);
        toast.error("Falha ao carregar transações");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Save to local storage when transactions change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("finance_transactions", JSON.stringify(transactions));
    }
  }, [transactions, loading]);

  // Add a new transaction
  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = {
      ...transaction,
      id: `t${Date.now()}`,
    };
    setTransactions((prev) => [...prev, newTransaction]);
    toast.success("Transação adicionada com sucesso");
  };

  // Update an existing transaction
  const updateTransaction = (id: string, transaction: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...transaction } : t))
    );
    toast.success("Transação atualizada com sucesso");
  };

  // Delete a transaction
  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    toast.success("Transação excluída com sucesso");
  };

  // Get transactions by date range
  const getTransactionsByPeriod = (startDate: string, endDate: string) => {
    return transactions.filter(
      (t) => t.date >= startDate && t.date <= endDate
    );
  };

  // Get transactions by category
  const getTransactionsByCategory = (category: TransactionCategory) => {
    return transactions.filter((t) => t.category === category);
  };

  // Get total income
  const getTotalIncome = () => {
    return transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
  };

  // Get total expenses
  const getTotalExpenses = () => {
    return transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
  };

  // Get balance
  const getBalance = () => {
    return getTotalIncome() - getTotalExpenses();
  };

  // Get category totals
  const getCategoryTotals = () => {
    const categoryTotals: Record<TransactionCategory, number> = {
      salary: 0,
      investment: 0,
      freelance: 0,
      gift: 0,
      housing: 0,
      food: 0,
      transportation: 0,
      utilities: 0,
      healthcare: 0,
      entertainment: 0,
      education: 0,
      shopping: 0,
      other: 0,
    };

    transactions.forEach((t) => {
      if (t.type === "expense") {
        categoryTotals[t.category] += t.amount;
      }
    });

    return categoryTotals;
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        getTransactionsByPeriod,
        getTransactionsByCategory,
        getTotalIncome,
        getTotalExpenses,
        getBalance,
        getCategoryTotals,
        loading,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

// Custom hook to use finance context
export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
}
