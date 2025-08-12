import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Calendar,
  DollarSign,
  User
} from "lucide-react";

// Mock data
const mockPropostas = [
  {
    id: 1,
    cliente: "João Silva Santos",
    cpf: "123.456.789-01",
    valor: "R$ 85.000,00",
    prazo: "84 meses",
    banco: "Banco do Brasil",
    colaborador: "Maria Santos",
    supervisor: "Carlos Lima",
    status: "Em Análise",
    dataCriacao: "2024-01-15",
    dataVencimento: "2024-01-25"
  },
  {
    id: 2,
    cliente: "Ana Paula Costa",
    cpf: "987.654.321-09",
    valor: "R$ 120.000,00",
    prazo: "96 meses",
    banco: "Caixa Econômica",
    colaborador: "João Silva",
    supervisor: "Roberto Santos",
    status: "Aprovada",
    dataCriacao: "2024-01-14",
    dataVencimento: "2024-01-24"
  },
  {
    id: 3,
    cliente: "Roberto Oliveira",
    cpf: "456.789.123-45",
    valor: "R$ 45.000,00",
    prazo: "60 meses",
    banco: "Bradesco",
    colaborador: "Ana Costa",
    supervisor: "Carlos Lima",
    status: "Recusada",
    dataCriacao: "2024-01-13",
    dataVencimento: "2024-01-23"
  },
  {
    id: 4,
    cliente: "Mariana Souza",
    cpf: "789.123.456-78",
    valor: "R$ 95.000,00",
    prazo: "72 meses",
    banco: "Itaú",
    colaborador: "Pedro Lima",
    supervisor: "Roberto Santos",
    status: "Em Análise",
    dataCriacao: "2024-01-16",
    dataVencimento: "2024-01-26"
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Em Análise":
      return <Clock className="h-4 w-4" />;
    case "Aprovada":
      return <CheckCircle className="h-4 w-4" />;
    case "Recusada":
      return <XCircle className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case "Em Análise":
      return "secondary";
    case "Aprovada":
      return "default";
    case "Recusada":
      return "destructive";
    default:
      return "secondary";
  }
};

export default function Propostas() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("todos");

  const filteredPropostas = mockPropostas.filter(proposta => {
    const matchesSearch = proposta.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proposta.cpf.includes(searchTerm) ||
                         proposta.banco.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === "todos" || 
                         proposta.status.toLowerCase().replace(" ", "_") === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    total: mockPropostas.length,
    emAnalise: mockPropostas.filter(p => p.status === "Em Análise").length,
    aprovadas: mockPropostas.filter(p => p.status === "Aprovada").length,
    recusadas: mockPropostas.filter(p => p.status === "Recusada").length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Propostas</h1>
          <p className="text-muted-foreground">
            Gerencie o ciclo completo de propostas
          </p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Nova Proposta
        </Button>
      </div>

      {/* Status Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{statusCounts.total}</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Em Análise</p>
                <p className="text-2xl font-bold text-warning">{statusCounts.emAnalise}</p>
              </div>
              <Clock className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Aprovadas</p>
                <p className="text-2xl font-bold text-success">{statusCounts.aprovadas}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Recusadas</p>
                <p className="text-2xl font-bold text-destructive">{statusCounts.recusadas}</p>
              </div>
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por cliente, CPF ou banco..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={selectedStatus === "todos" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus("todos")}
              >
                Todos
              </Button>
              <Button
                variant={selectedStatus === "em_análise" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus("em_análise")}
              >
                Em Análise
              </Button>
              <Button
                variant={selectedStatus === "aprovada" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus("aprovada")}
              >
                Aprovadas
              </Button>
              <Button
                variant={selectedStatus === "recusada" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus("recusada")}
              >
                Recusadas
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Propostas List */}
      <div className="space-y-4">
        {filteredPropostas.map((proposta) => (
          <Card key={proposta.id} className="shadow-card hover:shadow-lg transition-smooth">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{proposta.cliente}</h3>
                    <Badge variant={getStatusVariant(proposta.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(proposta.status)}
                        {proposta.status}
                      </div>
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{proposta.cpf}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{proposta.valor}</p>
                  <p className="text-sm text-muted-foreground">{proposta.prazo}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Banco</p>
                    <p className="text-sm font-medium">{proposta.banco}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Colaborador</p>
                    <p className="text-sm font-medium">{proposta.colaborador}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Supervisor</p>
                    <p className="text-sm font-medium">{proposta.supervisor}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Vencimento</p>
                    <p className="text-sm font-medium">{proposta.dataVencimento}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <span className="text-xs text-muted-foreground">
                  Criado em {proposta.dataCriacao}
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                  {proposta.status === "Aprovada" && (
                    <Button size="sm">
                      Converter em Venda
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredPropostas.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="py-12">
            <div className="text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma proposta encontrada</h3>
              <p className="text-muted-foreground mb-4">
                Tente ajustar os filtros ou criar uma nova proposta
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Proposta
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}