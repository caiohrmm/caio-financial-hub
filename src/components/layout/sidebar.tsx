
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";
import {
  BarChart3,
  CreditCard,
  Home,
  PieChart,
  Settings,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function SidebarLink({ to, icon, children }: SidebarLinkProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
          isActive
            ? "bg-finance-blue-100 text-finance-blue-500"
            : "text-foreground/70 hover:text-foreground hover:bg-muted"
        )
      }
    >
      {icon}
      {children}
    </NavLink>
  );
}

export function Sidebar({ isOpen, onClose, className }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 border-r border-border bg-background p-4 transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0",
          className
        )}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/c6960142-f9b1-43d8-b880-84978080fb13.png" 
              alt="CaioMartinsFinance Logo" 
              className="h-8 w-8"
            />
            <span className="font-heading font-semibold text-lg text-finance-blue-500">
              CaioMartinsFinance
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-1">
          <SidebarLink to="/" icon={<Home className="h-4 w-4" />}>
            Dashboard
          </SidebarLink>
          <SidebarLink
            to="/transactions"
            icon={<CreditCard className="h-4 w-4" />}
          >
            Transações
          </SidebarLink>
          <SidebarLink to="/reports" icon={<BarChart3 className="h-4 w-4" />}>
            Relatórios
          </SidebarLink>
          <SidebarLink to="/categories" icon={<PieChart className="h-4 w-4" />}>
            Categorias
          </SidebarLink>
          <SidebarLink to="/settings" icon={<Settings className="h-4 w-4" />}>
            Configurações
          </SidebarLink>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-xs font-medium">Backup automático</p>
            <p className="text-xs text-muted-foreground mt-1">
              Último backup: 22/06/2023
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 w-full bg-background text-xs"
            >
              Fazer backup agora
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
