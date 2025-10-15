import { useEffect, useState, useMemo } from "react";
import { useParams, Link, MemoryRouter } from "react-router-dom";
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
  Users,
  TrendingUp,
  DollarSign,
  Target,
  Eye,
  Download,
  UserPlus,
  Trash2,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/services/api"; // Descomente em seu projeto real

export default function SupervisorCarteira() {
  const { id } = useParams();
  const [carteira, setCarteira] = useState<any>(null);
  const [allClients, setAllClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("clientes");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const idToFetch = id;
    async function fetchData() {
      setIsLoading(true);
      try {
        const [carteiraRes, clientesRes] = await Promise.all([
          api.get(`/carteiras/${idToFetch}`),
          api.get("/clientes/consulta"),
        ]);
        setCarteira(carteiraRes.data);
        setAllClients(clientesRes.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const clientesDaCarteira = useMemo(() => {
    if (!carteira || !allClients.length) return [];
    const idsDosColaboradores = carteira.colaboradores.map(
      (colab: any) => colab.id
    );
    return allClients.filter(
      (cliente: any) =>
        cliente.colaborador &&
        idsDosColaboradores.includes(cliente.colaborador.ID_COLABORADOR)
    );
  }, [carteira, allClients]);

  const colaboradoresComStats = useMemo(() => {
    if (!carteira) return [];
    console.log(carteira)
    return carteira.colaboradores.map((colab: any) => {
      const clientesDoColaborador = allClients.filter(
        (c) => c.colaborador && c.colaborador.ID_COLABORADOR === colab.id
      );
      const clientesAtivos = colab.clientesAtivos
      return { ...colab, clientesAtivos };
    });
  }, [carteira, allClients]);

  const clientesFiltrados = useMemo(() => {
    return clientesDaCarteira.filter((cliente: any) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        cliente.nome.toLowerCase().includes(searchLower) ||
        cliente.cpf.includes(searchTerm) ||
        (cliente.email && cliente.email.toLowerCase().includes(searchLower));
      const matchesStatus =
        filtroStatus === "all" || cliente.status === filtroStatus;
      return matchesSearch && matchesStatus;
    });
  }, [clientesDaCarteira, searchTerm, filtroStatus]);

  if (isLoading || !carteira) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Carregando...</h2>
        <p className="text-muted-foreground">
          Buscando dados da carteira do supervisor.
        </p>
        <Button asChild>
          <Link to="/carteiras">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Link>
        </Button>
      </div>
    );
  }

  const { nome } = carteira;
  const { totalVendasEquipe, metaGeralAtingimento, totalComissaoEquipe } =
    carteira;
  const totalClientes = clientesDaCarteira.length;
  const clientesAtivos = colaboradoresComStats.reduce((acumulador, count) => {
    return acumulador + count.clientesAtivos
}, 0)
  const clientesInativos = colaboradoresComStats.reduce((acumulador, count) => {
    return acumulador + count.clientesInativos
}, 0)

console.log()

  return (
    <div className="space-y-6">
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
              Carteira - {nome}
            </h1>
            <p className="text-muted-foreground">
              Gerencie clientes e colaboradores desta carteira
            </p>
          </div>
        </div>
        {/* <div className="flex gap-2">
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
            </DialogContent>
          </Dialog>
        </div> */}
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Clientes
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClientes}</div>
            <p className="text-xs text-muted-foreground">Na carteira</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Clientes Ativos
            </CardTitle>
            <UserPlus className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientesAtivos}</div>
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
              {formatCurrency(totalVendasEquipe)}
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
            <div className="text-2xl font-bold">
              {metaGeralAtingimento.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Atingimento</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Comissão Total
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalComissaoEquipe)}
            </div>
            <p className="text-xs text-muted-foreground">Período atual</p>
          </CardContent>
        </Card>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <TabsList>
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
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Inativo">Inativo</SelectItem>
                <SelectItem value="Férias">Férias</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="colaboradores">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>
                Colaboradores ({colaboradoresComStats.length})
              </CardTitle>
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {colaboradoresComStats.map((col: any) => (
                    <TableRow key={col.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{col.nome}</p>
                          <p className="text-sm text-muted-foreground">
                            CPF: {col.cpf}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <span className="text-lg font-bold">
                          
                            {col.clientesAtivos}
                          </span>
                          <p className="text-xs text-muted-foreground">
                            clientes
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-success">
                          {formatCurrency(col.totalVendas)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium">
                            {col.metaAtingimento.toFixed(1)}%
                          </div>
                          <div
                            className={`w-2 h-2 rounded-full ${
                              col.metaAtingimento >= 80
                                ? "bg-success"
                                : col.metaAtingimento >= 60
                                ? "bg-warning"
                                : "bg-destructive"
                            }`}
                          ></div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-primary">
                          {col.regimeContratacao ? 
                          formatCurrency(col.totalComissao * 0.35) 
                          : formatCurrency(col.totalComissao * 0.27)}
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
                  <span className="text-sm">Total de Vendas</span>
                  <span className="font-bold">{formatCurrency(totalVendasEquipe)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total de Comissões</span>
                  <span className="font-bold">{formatCurrency(totalComissaoEquipe)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Atingimento da Meta</span>
                  <span className="font-bold">{metaGeralAtingimento.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total de Colaboradores</span>
                  <span className="font-bold">{colaboradoresComStats.length}</span>
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
                  <span className="font-bold">{clientesAtivos}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-muted"></div>
                    <span className="text-sm">Clientes Inativos</span>
                  </div>
                  <span className="font-bold">
                    {clientesInativos}
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
