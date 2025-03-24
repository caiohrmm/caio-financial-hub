
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface FinanceCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "income" | "expense" | "glass";
  onClick?: () => void;
}

export function FinanceCard({
  children,
  className,
  variant = "default",
  onClick,
}: FinanceCardProps) {
  const variantStyles = {
    default: "bg-card border-border",
    income: "bg-finance-green-light border-finance-green/20",
    expense: "bg-finance-red-light border-finance-red/20",
    glass: "glassmorphism border-white/20",
  };

  return (
    <div
      className={cn(
        "card-financial animate-fade-up",
        variantStyles[variant],
        onClick && "cursor-pointer card-hover",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function FinanceCardHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-4", className)}>
      {children}
    </div>
  );
}

export function FinanceCardTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3 className={cn("text-lg font-medium", className)}>
      {children}
    </h3>
  );
}

export function FinanceCardDescription({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("text-muted-foreground text-sm", className)}>
      {children}
    </p>
  );
}

export function FinanceCardContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("", className)}>
      {children}
    </div>
  );
}

export function FinanceCardFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mt-4 flex items-center justify-between", className)}>
      {children}
    </div>
  );
}
