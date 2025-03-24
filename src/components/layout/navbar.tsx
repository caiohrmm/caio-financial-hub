
import { cn } from "@/lib/utils";
import { Bell, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";

interface NavbarProps {
  onMenuClick: () => void;
  className?: string;
}

export function Navbar({ onMenuClick, className }: NavbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <nav
      className={cn(
        "h-16 w-full border-b border-border bg-background/70 backdrop-blur-lg fixed top-0 z-50 px-4 flex items-center justify-between",
        className
      )}
    >
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden mr-2"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="hidden md:flex items-center gap-2">
          <img 
            src="/lovable-uploads/c6960142-f9b1-43d8-b880-84978080fb13.png" 
            alt="CaioMartinsFinance Logo" 
            className="h-8 w-8"
          />
          <span className="font-heading font-semibold text-lg text-finance-blue-500">
            CaioMartinsFinance
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Popover open={showNotifications} onOpenChange={setShowNotifications}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-finance-red text-[10px] text-white flex items-center justify-center">
                3
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="p-4 border-b border-border">
              <h4 className="font-medium">Notificações</h4>
            </div>
            <div className="py-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="px-4 py-3 hover:bg-muted transition-colors duration-200 cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium">Fatura próxima do vencimento</p>
                    <span className="text-xs text-muted-foreground">
                      {i === 1 ? "Agora" : i === 2 ? "3h atrás" : "1d atrás"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {i === 1
                      ? "Cartão de crédito vence em 3 dias"
                      : i === 2
                      ? "Internet vence hoje"
                      : "Aluguel vence em 5 dias"}
                  </p>
                </div>
              ))}
            </div>
            <div className="p-2 border-t border-border">
              <Button variant="ghost" size="sm" className="w-full justify-center">
                Ver todas
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback className="bg-finance-blue-500 text-white">
                  CM
                </AvatarFallback>
              </Avatar>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-0" align="end">
            <div className="p-4 border-b border-border">
              <p className="font-medium">Caio Martins</p>
              <p className="text-xs text-muted-foreground">caio@example.com</p>
            </div>
            <div className="py-2">
              <Button
                variant="ghost"
                className="w-full justify-start px-4 py-2 h-9"
              >
                Perfil
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start px-4 py-2 h-9"
              >
                Configurações
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start px-4 py-2 h-9 text-finance-red"
              >
                Sair
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </nav>
  );
}
