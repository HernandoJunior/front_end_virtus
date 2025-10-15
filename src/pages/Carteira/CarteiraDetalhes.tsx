import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  Plus,
  Search,
  Edit,
  Trash2,
  UserPlus,
  Users,
  TrendingUp,
  DollarSign,
  Target,
  Eye,
  Download,
  Filter
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { formatCurrency } from "@/utils/formatter";

const mockCarteiras = [
  {
    id: 1,
    supervisor: {
      nome: "Ana Rodriguez",
      cpf: "123.456.789-01",
      email: "ana.rodriguez@virtus.com",
      telefone: "(11) 99999-5678"
    },
    clientes: [
      {
        id: 1,
        nome: "João Silva Santos",
        cpf: "987.654.321-00",
        email: "joao.santos@email.com",
        telefone: "(11) 98765-4321",
        status: "Ativo",
        valorCarteira: 125000,
        ultimaInteracao: "2024-01-15",
        colaboradorResponsavel: "Maria Santos"
      },
      {
        id: 2,
        nome: "Ana Carolina Lima",
        cpf: "456.789.123-11",
        email: "ana.lima@email.com",
        telefone: "(11) 91234-5678",
        status: "Ativo",
        valorCarteira: 98750,
        ultimaInteracao: "2024-01-14",
        colaboradorResponsavel: "João Silva"
      },
      {
        id: 3,
        nome: "Pedro Costa Silva",
        cpf: "789.123.456-22",
        email: "pedro.costa@email.com",
        telefone: "(11) 95555-1234",
        status: "Inativo",
        valorCarteira: 67200,
        ultimaInteracao: "2024-01-10",
        colaboradorResponsavel: "Pedro Costa"
      }
    ],
    colaboradores: [
      {
        id: 1,
        nome: "Maria Santos",
        cpf: "987.654.321-00",
        vendas: "R$ 125.400",
        clientesAtivos: 15,
        metas: 85,
        comissao: "R$ 6.270",
        status: "Ativo"
      },
      {
        id: 2,
        nome: "João Silva",
        cpf: "456.789.123-11",
        vendas: "R$ 98.750",
        clientesAtivos: 12,
        metas: 78,
        comissao: "R$ 4.937",
        status: "Ativo"
      },
      {
        id: 3,
        nome: "Pedro Costa",
        cpf: "789.123.456-22",
        vendas: "R$ 67.200",
        clientesAtivos: 8,
        metas: 52,
        comissao: "R$ 3.360",
        status: "Férias"
      }
    ],
    estatisticas: {
      totalClientes: 35,
      clientesAtivos: 28,
      totalVendas: 291350,
      metaGeral: 72,
      comissaoTotal: 14567
    }
  }
];

export default function GerenciarCarteira() {
  const { carteiraId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("clientes");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const carteira = mockCarteiras.find(c => c.id === parseInt(carteiraId || "1"));
  
  if (!carteira) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Carteira não encontrada</h2>
        <p className="text-muted-foreground">A carteira solicitada não foi encontrada.</p>
        <Button asChild>
          <Link to="/carteiras">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Carteiras
          </Link>
        </Button>
      </div>
    );
  }

  const clientesFiltrados = useMemo(() => {
    return carteira.clientes.filter(cliente => {
      const matchesSearch = cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           cliente.cpf.includes(searchTerm) ||
                           cliente.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filtroStatus === "all" || cliente.status === filtroStatus;
      return matchesSearch && matchesStatus;
    });
  }, [carteira.clientes, searchTerm, filtroStatus]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link to="/carteiras">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Carteira - {carteira.supervisor.nome}
            </h1>
            <p className="text-muted-foreground">
              Gerencie clientes e colaboradores desta carteira
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Cliente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Cliente à Carteira</DialogTitle>
                <DialogDescription>
                  Associe um novo cliente a esta carteira
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cliente-nome">Nome do Cliente</Label>
                  <Input id="cliente-nome" placeholder="Nome completo" />
                </div>
                <div>
                  <Label htmlFor="cliente-cpf">CPF</Label>
                  <Input id="cliente-cpf" placeholder="000.000.000-00" />
                </div>
                <div>
                  <Label htmlFor="cliente-email">Email</Label>
                  <Input id="cliente-email" type="email" placeholder="email@exemplo.com" />
                </div>
                <div>
                  <Label>Colaborador Responsável</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o colaborador" />
                    </SelectTrigger>
                    <SelectContent>
                      {carteira.colaboradores.map(colab => (
                        <SelectItem key={colab.id} value={colab.nome}>
                          {colab.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={() => setIsDialogOpen(false)} className="flex-1">
                    Adicionar Cliente
                  </Button>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Estatísticas da Carteira */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{carteira.estatisticas.totalClientes}</div>
            <p className="text-xs text-muted-foreground">Na carteira</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
            <UserPlus className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{carteira.estatisticas.clientesAtivos}</div>
            <p className="text-xs text-muted-foreground">Ativos</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vendas</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {carteira.estatisticas.totalVendas.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">Acumulado</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meta Geral</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{carteira.estatisticas.metaGeral}%</div>
            <p className="text-xs text-muted-foreground">Atingimento</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comissão Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(carteira.estatisticas.comissaoTotal * 0.27)}
            </div>
            <p className="text-xs text-muted-foreground">Período atual</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Gerenciamento */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="clientes">Clientes</TabsTrigger>
            <TabsTrigger value="colaboradores">Colaboradores</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                className="pl-8 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Inativo">Inativo</SelectItem>
                <SelectItem value="Férias">Férias</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="clientes">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Clientes da Carteira ({clientesFiltrados.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Valor Carteira</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Última Interação</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientesFiltrados.map((cliente) => (
                    <TableRow key={cliente.email}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{cliente.nome}</p>
                          <p className="text-sm text-muted-foreground">CPF: {cliente.cpf}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{cliente.email}</p>
                          <p className="text-sm text-muted-foreground">{cliente.telefone}</p>
                        </div>
                      </TableCell>
                      <TableCell>{cliente.colaboradorResponsavel}</TableCell>
                      <TableCell>
                        <div className="font-medium text-success">
                          R$ {cliente.valorCarteira.toLocaleString('pt-BR')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          cliente.status === "Ativo" ? "bg-success text-success-foreground" : 
                          "bg-muted text-muted-foreground"
                        }>
                          {cliente.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(cliente.ultimaInteracao).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/clientes/${cliente.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="colaboradores">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Colaboradores ({carteira.colaboradores.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Colaborador</TableHead>
                    <TableHead>Clientes Ativos</TableHead>
                    <TableHead>Vendas</TableHead>
                    <TableHead>Meta</TableHead>
                    <TableHead>Comissão</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {carteira.colaboradores.map((colaborador) => (
                    <TableRow key={colaborador.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{colaborador.nome}</p>
                          <p className="text-sm text-muted-foreground">CPF: {colaborador.cpf}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <span className="text-lg font-bold">{colaborador.clientesAtivos}</span>
                          <p className="text-xs text-muted-foreground">clientes</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-success">{colaborador.vendas}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium">{colaborador.metas}%</div>
                          <div className={`w-2 h-2 rounded-full ${
                            colaborador.metas >= 80 ? 'bg-success' : 
                            colaborador.metas >= 60 ? 'bg-warning' : 'bg-destructive'
                          }`}></div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-primary">{colaborador.comissao}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          colaborador.status === "Ativo" ? "bg-success text-success-foreground" : 
                          colaborador.status === "Férias" ? "bg-warning text-warning-foreground" :
                          "bg-muted text-muted-foreground"
                        }>
                          {colaborador.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Resumo de Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Taxa de Conversão</span>
                  <span className="font-bold">78.5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Ticket Médio</span>
                  <span className="font-bold">R$ 8.324</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Retenção de Clientes</span>
                  <span className="font-bold">85.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Crescimento Mensal</span>
                  <span className="font-bold text-success">+12.3%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Distribuição por Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-success"></div>
                    <span className="text-sm">Clientes Ativos</span>
                  </div>
                  <span className="font-bold">{carteira.estatisticas.clientesAtivos}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-muted"></div>
                    <span className="text-sm">Clientes Inativos</span>
                  </div>
                  <span className="font-bold">
                    {carteira.estatisticas.totalClientes - carteira.estatisticas.clientesAtivos}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}