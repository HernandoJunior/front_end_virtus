import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Search,
  Users,
  TrendingUp,
  DollarSign,
  UserPlus,
  Calendar,
} from "lucide-react";
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
import { api } from "@/services/api";

export default function SupervisorCarteira() {
  const { id } = useParams();
  const [carteira, setCarteira] = useState(null);
  const [allClients, setAllClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("colaboradores");

  // Date filter states
  const [dataInicio, setDataInicio] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split("T")[0];
  });
  const [dataFim, setDataFim] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];
  });

  const fetchData = async (inicio, fim) => {
    const startDate = inicio !== undefined ? inicio : dataInicio;
    const endDate = fim !== undefined ? fim : dataFim;
        
    setIsLoading(true);
    try {
      const [carteiraRes, clientesRes] = await Promise.all([
        api.get(`/carteiras/${id}`, {
          params: {
            dataInicio: startDate,
            dataFim: endDate,
          },
        }),
        api.get("/clientes/consulta"),
      ]);
      setCarteira(carteiraRes.data);
      setAllClients(clientesRes.data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(dataInicio, dataFim);
  }, [id]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const clientesDaCarteira = useMemo(() => {
    if (!carteira || !allClients.length) return [];
    const idsDosColaboradores = carteira.colaboradores.map((colab) => colab.id);
    return allClients.filter(
      (cliente) =>
        cliente.colaborador &&
        idsDosColaboradores.includes(cliente.colaborador.ID_COLABORADOR)
    );
  }, [carteira, allClients]);

  const colaboradoresComStats = useMemo(() => {
    if (!carteira) return [];
    return carteira.colaboradores.map((colab) => {
      const clientesDoColaborador = allClients.filter(
        (c) => c.colaborador && c.colaborador.ID_COLABORADOR === colab.id
      );
      const clientesAtivos = colab.clientesAtivos;
      return { ...colab, clientesAtivos };
    });
  }, [carteira, allClients]);

  const clientesFiltrados = useMemo(() => {
    return clientesDaCarteira.filter((cliente) => {
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

  const handleAplicarFiltro = () => {
    fetchData(dataInicio, dataFim);
  };

  const handleResetarFiltro = () => {
    const now = new Date();
    const inicio = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
    const fim = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];
    
    setDataInicio(inicio);
    setDataFim(fim);
    fetchData(inicio, fim);
  };

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
  const { totalVendasEquipe, totalComissaoEquipe } = carteira;
  const totalClientes = clientesDaCarteira.length;
  const clientesAtivos = colaboradoresComStats.reduce((acumulador, count) => {
    return acumulador + count.clientesAtivos;
  }, 0);
  const clientesInativos = colaboradoresComStats.reduce((acumulador, count) => {
    return acumulador + count.clientesInativos;
  }, 0);

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
      </div>

      {/* Date Filter Section */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Filtro de Período
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-2 block">
                Data Início
              </label>
              <Input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-2 block">
                Data Fim
              </label>
              <Input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="w-full"
              />
            </div>
            <Button onClick={handleAplicarFiltro}>
              Aplicar Filtro
            </Button>
            <Button variant="outline" onClick={handleResetarFiltro}>
              Resetar para Mês Atual
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-4">
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
            <p className="text-xs text-muted-foreground">No período</p>
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
            <p className="text-xs text-muted-foreground">No período</p>
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
                    <TableHead>Comissão</TableHead>
                    <TableHead>Regime</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {colaboradoresComStats.map((col) => (
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
                        <div className="font-medium text-primary">
                          {formatCurrency(col.totalComissao)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {col.regimeContratacao === "MEI" ? "35%" : "27%"} da
                          comissão da empresa
                        </p>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium">
                          {col.regimeContratacao}
                        </span>
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
                  <span className="font-bold">
                    {formatCurrency(totalVendasEquipe)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total de Comissões</span>
                  <span className="font-bold">
                    {formatCurrency(totalComissaoEquipe)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total de Colaboradores</span>
                  <span className="font-bold">
                    {colaboradoresComStats.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Ticket Médio por Colaborador</span>
                  <span className="font-bold">
                    {formatCurrency(
                      colaboradoresComStats.length > 0
                        ? totalVendasEquipe / colaboradoresComStats.length
                        : 0
                    )}
                  </span>
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
                  <span className="font-bold">{clientesInativos}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm font-semibold">
                    Total de Clientes
                  </span>
                  <span className="font-bold">{totalClientes}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}