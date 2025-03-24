
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center">
      <div className="text-center animate-fade-up">
        <h1 className="text-7xl font-bold text-finance-blue-500 mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">Página não encontrada</p>
        <Button asChild>
          <a href="/" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Voltar ao início
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
