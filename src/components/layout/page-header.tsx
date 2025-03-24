
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export function PageHeader({ 
  title, 
  description, 
  children, 
  className 
}: PageHeaderProps) {
  return (
    <div className={cn("mb-6", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight animate-fade-up">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground mt-1 animate-fade-up" style={{ animationDelay: "50ms" }}>
              {description}
            </p>
          )}
        </div>
        {children && <div className="animate-fade-up" style={{ animationDelay: "100ms" }}>{children}</div>}
      </div>
    </div>
  );
}
