
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface FinanceStatProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  valueClassName?: string;
  iconClassName?: string;
}

export function FinanceStat({
  title,
  value,
  icon,
  trend,
  className,
  valueClassName,
  iconClassName,
}: FinanceStatProps) {
  return (
    <div className={cn("flex flex-col space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        {icon && (
          <div className={cn("h-8 w-8 rounded-full flex items-center justify-center", iconClassName)}>
            {icon}
          </div>
        )}
      </div>
      <div className="flex items-end gap-2">
        <span className={cn("text-2xl font-semibold", valueClassName)}>{value}</span>
        {trend && (
          <div
            className={cn(
              "flex items-center text-xs font-medium",
              trend.isPositive ? "text-finance-green" : "text-finance-red"
            )}
          >
            {trend.isPositive ? "↑" : "↓"}{" "}
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>
    </div>
  );
}
