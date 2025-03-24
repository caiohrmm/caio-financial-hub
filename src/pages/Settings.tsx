
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { 
  FinanceCard, 
  FinanceCardContent, 
  FinanceCardHeader, 
  FinanceCardTitle 
} from "@/components/ui/finance-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { toast } from "sonner";
import { Download, Save, Upload } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [backupEmail, setBackupEmail] = useState("usuario@exemplo.com");
  const [autoBackup, setAutoBackup] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState("weekly");

  const handleBackupNow = () => {
    toast.success("Backup realizado com sucesso");
  };

  const handleRestore = () => {
    toast.success("Dados restaurados com sucesso");
  };

  const handleSaveSettings = () => {
    toast.success("Configurações salvas com sucesso");
  };

  return (
    <>
      <PageHeader
        title="Configurações"
        description="Gerencie as configurações do sistema"
      >
        <Button onClick={handleSaveSettings}>
          <Save className="h-4 w-4 mr-2" />
          Salvar Alterações
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <FinanceCard>
          <FinanceCardHeader>
            <FinanceCardTitle>Backup e Restauração</FinanceCardTitle>
          </FinanceCardHeader>
          <FinanceCardContent className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="backup-email">Email para backup</Label>
              <Input
                type="email"
                id="backup-email"
                value={backupEmail}
                onChange={(e) => setBackupEmail(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch 
                id="auto-backup" 
                checked={autoBackup}
                onCheckedChange={setAutoBackup}
              />
              <Label htmlFor="auto-backup">Backup automático</Label>
            </div>

            {autoBackup && (
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="backup-frequency">Frequência de backup</Label>
                <select
                  id="backup-frequency"
                  value={backupFrequency}
                  onChange={(e) => setBackupFrequency(e.target.value)}
                  className="input-field"
                >
                  <option value="daily">Diário</option>
                  <option value="weekly">Semanal</option>
                  <option value="monthly">Mensal</option>
                </select>
              </div>
            )}

            <div className="flex flex-col gap-2 pt-2">
              <Button className="w-full" onClick={handleBackupNow}>
                <Download className="h-4 w-4 mr-2" />
                Fazer backup agora
              </Button>
              <Button variant="outline" className="w-full" onClick={handleRestore}>
                <Upload className="h-4 w-4 mr-2" />
                Restaurar dados
              </Button>
            </div>
          </FinanceCardContent>
        </FinanceCard>

        <FinanceCard>
          <FinanceCardHeader>
            <FinanceCardTitle>Aparência</FinanceCardTitle>
          </FinanceCardHeader>
          <FinanceCardContent className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="theme">Tema</Label>
              <select
                id="theme"
                value={theme}
                onChange={(e) => setTheme(e.target.value as "light" | "dark" | "system")}
                className="input-field"
              >
                <option value="light">Claro</option>
                <option value="dark">Escuro</option>
                <option value="system">Sistema</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="animations" defaultChecked />
              <Label htmlFor="animations">Animações</Label>
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="language">Idioma</Label>
              <select
                id="language"
                defaultValue="pt-BR"
                className="input-field"
              >
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en-US">English (US)</option>
                <option value="es">Español</option>
              </select>
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="currency">Moeda</Label>
              <select
                id="currency"
                defaultValue="BRL"
                className="input-field"
              >
                <option value="BRL">Real (R$)</option>
                <option value="USD">Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
              </select>
            </div>
          </FinanceCardContent>
        </FinanceCard>
      </div>

      <FinanceCard>
        <FinanceCardHeader>
          <FinanceCardTitle>Notificações</FinanceCardTitle>
        </FinanceCardHeader>
        <FinanceCardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="notify-bills">Notificar contas a vencer</Label>
            <Switch id="notify-bills" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="notify-budget">Alertas de orçamento</Label>
            <Switch id="notify-budget" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="notify-tips">Dicas financeiras</Label>
            <Switch id="notify-tips" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="notify-email">Receber notificações por email</Label>
            <Switch id="notify-email" />
          </div>
        </FinanceCardContent>
      </FinanceCard>
    </>
  );
}
