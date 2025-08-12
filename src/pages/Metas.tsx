import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Plus, 
  TrendingUp, 
  Calendar,
  DollarSign,
  Users,
  Edit,
  Trash2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Metas() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const metas = [
    {
      id: 1,
      nome: "Meta Mensal - Janeiro 2024",
      valor: 850000,
      realizado: 650000,
      periodo: "01/01/2024 - 31/01/2024",
      responsavel: "Equipe Geral",
      tipo: "Vendas",
      status: "Em Andamento"
    },
    {
      id: 2,
      nome: "Meta Individual - João Silva",
      valor: 120000,
      realizado: 98750,
      periodo: "01/01/2024 - 31/01/2024",
      responsavel: "João Silva",
      tipo: "Individual",
      status: "Em Andamento"
    },
    {
      id: 3,
      nome: "Meta Trimestral Q1",
      valor: 2500000,
      realizado: 1850000,
      periodo: "01/01/2024 - 31/03/2024",
      responsavel: "Todas as Equipes",
      tipo: "Vendas",
      status: "Em Andamento"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Concluída": return "bg-success text-success-foreground";
      case "Em Andamento": return "bg-warning text-warning-foreground";
      case "Atrasada": return "bg-destructive text-destructive-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  const calcularProgresso = (realizado: number, valor: number) => {
    return Math.round((realizado / valor) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Metas</h1>
          <p className="text-muted-foreground">
            Gerencie e acompanhe o desempenho das metas de vendas
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Meta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Criar Nova Meta</DialogTitle>
              <DialogDescription>
                Defina uma nova meta para acompanhamento de desempenho
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome da Meta</Label>
                <Input id="nome" placeholder="Ex: Meta Mensal Janeiro" />
              </div>
              <div>
                <Label htmlFor="valor">Valor da Meta (R$)</Label>
                <Input id="valor" type="number" placeholder="850000" />
              </div>
              <div>
                <Label htmlFor="tipo">Tipo</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vendas">Vendas</SelectItem>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="equipe">Equipe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="responsavel">Responsável</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o responsável" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="geral">Equipe Geral</SelectItem>
                    <SelectItem value="joao">João Silva</SelectItem>
                    <SelectItem value="maria">Maria Santos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="inicio">Data Início</Label>
                  <Input id="inicio" type="date" />
                </div>
                <div>
                  <Label htmlFor="fim">Data Fim</Label>
                  <Input id="fim" type="date" />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={() => setIsDialogOpen(false)} className="flex-1">
                  Criar Meta
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Resumo de Metas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Metas Ativas</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Em andamento</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Realização Média</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">76%</div>
            <p className="text-xs text-muted-foreground">Das metas ativas</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Realizado</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 2.599M</div>
            <p className="text-xs text-muted-foreground">No período ativo</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Metas */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Metas Ativas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metas.map((meta) => (
              <div key={meta.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{meta.nome}</h3>
                    <p className="text-sm text-muted-foreground">{meta.responsavel}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(meta.status)}>
                      {meta.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Período</p>
                    <p className="font-medium">{meta.periodo}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Meta</p>
                    <p className="font-medium">R$ {meta.valor.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Realizado</p>
                    <p className="font-medium text-success">R$ {meta.realizado.toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso</span>
                    <span className="font-medium">{calcularProgresso(meta.realizado, meta.valor)}%</span>
                  </div>
                  <Progress value={calcularProgresso(meta.realizado, meta.valor)} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}