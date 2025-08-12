import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Users,
  Plus,
  Search,
  Edit,
  UserCheck,
  TrendingUp,
  DollarSign,
  Target,
  Eye
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

export default function Carteiras() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroSupervisor, setFiltroSupervisor] = useState("");

  const supervisores = [
    {
      id: 1,
      nome: "Ana Rodriguez",
      cpf: "123.456.789-01",
      rg: "12.345.678-9",
      email: "ana.rodriguez@virtus.com",
      telefone: "(11) 99999-5678",
      colaboradores: [
        {
          id: 1,
          nome: "Maria Santos",
          cpf: "987.654.321-00",
          vendas: "R$ 125.400",
          metas: 85,
          comissao: "R$ 6.270"
        },
        {
          id: 2,
          nome: "João Silva",
          cpf: "456.789.123-11",
          vendas: "R$ 98.750",
          metas: 78,
          comissao: "R$ 4.937"
        },
        {
          id: 3,
          nome: "Pedro Costa",
          cpf: "789.123.456-22",
          vendas: "R$ 67.200",
          metas: 52,
          comissao: "R$ 3.360"
        }
      ],
      totalVendas: "R$ 291.350",
      metaGeral: 72,
      comissaoTotal: "R$ 14.567"
    },
    {
      id: 2,
      nome: "Carlos Lima",
      cpf: "321.654.987-33",
      rg: "98.765.432-1",
      email: "carlos.lima@virtus.com",
      telefone: "(11) 99999-1234",
      colaboradores: [
        {
          id: 4,
          nome: "Lucas Oliveira",
          cpf: "654.321.987-44",
          vendas: "R$ 156.800",
          metas: 95,
          comissao: "R$ 7.840"
        },
        {
          id: 5,
          nome: "Fernanda Silva",
          cpf: "147.258.369-55",
          vendas: "R$ 134.600",
          metas: 88,
          comissao: "R$ 6.730"
        }
      ],
      totalVendas: "R$ 291.400",
      metaGeral: 91,
      comissaoTotal: "R$ 14.570"
    },
    {
      id: 3,
      nome: "Roberto Mendes",
      cpf: "159.357.486-66",
      rg: "15.935.748-6",
      email: "roberto.mendes@virtus.com",
      telefone: "(11) 99999-9876",
      colaboradores: [
        {
          id: 6,
          nome: "Amanda Costa",
          cpf: "753.951.852-77",
          vendas: "R$ 89.300",
          metas: 65,
          comissao: "R$ 4.465"
        },
        {
          id: 7,
          nome: "Ricardo Santos",
          cpf: "852.741.963-88",
          vendas: "R$ 112.500",
          metas: 74,
          comissao: "R$ 5.625"
        },
        {
          id: 8,
          nome: "Juliana Lima",
          cpf: "963.852.741-99",
          vendas: "R$ 95.200",
          metas: 69,
          comissao: "R$ 4.760"
        }
      ],
      totalVendas: "R$ 297.000",
      metaGeral: 69,
      comissaoTotal: "R$ 14.850"
    }
  ];

  const filteredSupervisores = supervisores.filter(supervisor => {
    const matchesSearch = supervisor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supervisor.cpf.includes(searchTerm) ||
                         supervisor.colaboradores.some(colab => 
                           colab.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           colab.cpf.includes(searchTerm)
                         );
    const matchesFiltro = !filtroSupervisor || filtroSupervisor === "todos" || supervisor.id.toString() === filtroSupervisor;
    return matchesSearch && matchesFiltro;
  });

  const totalColaboradores = supervisores.reduce((sum, sup) => sum + sup.colaboradores.length, 0);
  const totalVendasGeral = supervisores.reduce((sum, sup) => {
    const valor = parseFloat(sup.totalVendas.replace(/[R$\s.]/g, '').replace(',', '.'));
    return sum + valor;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Carteiras de Supervisores</h1>
          <p className="text-muted-foreground">
            Gerencie carteiras de clientes e equipes de supervisores
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Atribuir Colaborador
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Atribuir Colaborador à Carteira</DialogTitle>
              <DialogDescription>
                Associe um colaborador a um supervisor específico
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="supervisor">Supervisor</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o supervisor" />
                  </SelectTrigger>
                  <SelectContent>
                    {supervisores.map(supervisor => (
                      <SelectItem key={supervisor.id} value={supervisor.id.toString()}>
                        {supervisor.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="colaborador">Colaborador</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o colaborador" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Maria Santos</SelectItem>
                    <SelectItem value="2">João Silva</SelectItem>
                    <SelectItem value="3">Pedro Costa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={() => setIsDialogOpen(false)} className="flex-1">
                  Atribuir
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Supervisores</CardTitle>
            <UserCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{supervisores.length}</div>
            <p className="text-xs text-muted-foreground">Ativos no sistema</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Colaboradores</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalColaboradores}</div>
            <p className="text-xs text-muted-foreground">Distribuídos em carteiras</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas Totais</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalVendasGeral.toLocaleString('pt-BR', {minimumFractionDigits: 0})}</div>
            <p className="text-xs text-muted-foreground">Todas as carteiras</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meta Média</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(supervisores.reduce((sum, sup) => sum + sup.metaGeral, 0) / supervisores.length)}%</div>
            <p className="text-xs text-muted-foreground">Atingimento geral</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nome, CPF do supervisor ou colaborador..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label>Supervisor</Label>
              <Select value={filtroSupervisor} onValueChange={setFiltroSupervisor}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os supervisores" />
                </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                  {supervisores.map(supervisor => (
                    <SelectItem key={supervisor.id} value={supervisor.id.toString()}>
                      {supervisor.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Carteiras de Supervisores */}
      <div className="space-y-6">
        {filteredSupervisores.map((supervisor) => (
          <Card key={supervisor.id} className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-primary" />
                    {supervisor.nome}
                  </CardTitle>
                  <div className="flex gap-4 text-sm text-muted-foreground mt-2">
                    <span>CPF: {supervisor.cpf}</span>
                    <span>RG: {supervisor.rg}</span>
                    <span>{supervisor.email}</span>
                    <span>{supervisor.telefone}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-success">{supervisor.totalVendas}</div>
                  <div className="text-sm text-muted-foreground">Meta: {supervisor.metaGeral}%</div>
                  <div className="text-sm text-primary">Comissão: {supervisor.comissaoTotal}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Colaboradores da Carteira ({supervisor.colaboradores.length})</h4>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Gerenciar Carteira
                  </Button>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Colaborador</TableHead>
                      <TableHead>Vendas</TableHead>
                      <TableHead>Meta</TableHead>
                      <TableHead>Comissão</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {supervisor.colaboradores.map((colaborador) => (
                      <TableRow key={colaborador.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{colaborador.nome}</p>
                            <p className="text-sm text-muted-foreground">
                              CPF: {colaborador.cpf}
                            </p>
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
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}