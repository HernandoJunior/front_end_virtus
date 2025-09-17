import { KPICard } from "@/components/DashboardKPI";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  Users, 
  FileText, 
  Target,
  TrendingUp,
  Calendar,
  Building,
  Award,
  Search
} from "lucide-react";

import { api } from "@/services/api";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useNavigate } from "react-router-dom";
import { Bar, CartesianGrid, ResponsiveContainer, XAxis, YAxis, BarChart, Tooltip } from "recharts";

export default function Dashboard() {
  let user = window.localStorage.getItem("@virtus:user")
  const userJson = user ? JSON.parse(user) : null;

  const navigate = useNavigate()

  const [ranking, setRanking] = useState([])
  const [rankingBanco, setVendasPorBanco] = useState([])
  const [vendasPeriodoGrafico, setVendasPeriodo] = useState([])

  const [kpiData, setKpiData] = useState({
    clientesAtivos: 0,
    propostasCriadas: 0,
    propostasEmAnalise: 0,
    propostasAprovadas: 0,
    taxaDeConversao: 0,
    valorVendidoMeta: 0,
    progressoMeta: 0
  });

  const [valorFinal, setValorFinal] = useState({
    valorFinal : 0
  });

  // Estados para as datas de filtro
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");

  async function fetchKpiData(dataInicial, dataFinal) {
    try {
      const response = await api.get(`/dashboard/kpis?dataInicial=${dataInicial}&dataFinal=${dataFinal}`);
      setKpiData(response.data);
    } catch (error) {
      console.error("Erro ao buscar KPIs do dashboard:", error);
    }
}

  async function fetchVendasPorBanco(dataInicial, dataFinal) {
  try {
    const response = await api.get(`/vendas/vendaPorBanco/${dataInicial}/${dataFinal}`);
    setVendasPorBanco(response.data);
  } catch (error) {
    console.error("Erro ao buscar vendas por banco:", error);
  }
  }

  async function fetchRankingSales(dataInicial, dataFinal) {
    try {
      const response = await api.get(`/vendas/topVendedores/${dataInicial}/${dataFinal}`)
      console.log(response.data)
      setRanking(response.data)
    } catch (error) {
      alert("Nao foi possivel carregar o ranking")
    }
  }

  async function fetchSalesByPeriod(start, end) {
    if (!start || !end) {
      alert("Por favor, selecione as datas inicial e final.");
      return;
    }
    try {
      // Novo endpoint que retorna o DTO completo
      const response = await api.get(`/vendas/mesPersonalizado/${start}/${end}`);
      setValorFinal(response.data);
    } catch (error) {
      console.error("Erro ao carregar vendas:", error);
      alert("Não foi possível carregar os dados de vendas para o período.");
    }
  }

  async function listSales(start, end){
    try {
      const response = await api.get(`/vendas/mesPersonalizado/${start}/${end}`);
      setValorFinal(response.data.valorFinal)
    } catch (error) {
      (error)
      alert("Nao foi possivel carregar as vendas")
    }
  }

  async function fetchVendasPeriodo(dataInicial, dataFinal) {
    try {
        // Use o novo endpoint e passe as datas como query params
        const response = await api.get(`/vendas/graficoPeriodo/${dataInicial}/${dataFinal}`);
        setVendasPeriodo(response.data);
    } catch (error) {
        console.error("Erro ao buscar dados do gráfico de período:", error);
    }
}

  // Função para formatar o número como moeda brasileira (BRL)
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatChartTitle = () => {
    if (!dataInicial || !dataFinal) return "Vendas por Período";
    
    // Converte as datas para um formato mais legível (dd/mm/yyyy)
    const start = new Date(dataInicial + 'T00:00:00').toLocaleDateString('pt-BR');
    const end = new Date(dataFinal + 'T00:00:00').toLocaleDateString('pt-BR');
    
    return `Vendas de ${start} a ${end}`;
  };

  // Define as datas do mês atual como padrão e faz a busca inicial
  useEffect(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
      .toISOString()
      .split("T")[0];
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];

    setDataInicial(firstDay);
    setDataFinal(lastDay);
    listSales(firstDay, lastDay)
    fetchSalesByPeriod(firstDay, lastDay);
    
  fetchKpiData(firstDay, lastDay);

    fetchRankingSales(firstDay, lastDay),
    fetchVendasPorBanco(firstDay, lastDay)
    fetchVendasPeriodo(firstDay, lastDay)
  }, []);

  // Lidar com a busca ao clicar no botão
  const handleSearch = () => {
    fetchSalesByPeriod(dataInicial, dataFinal),
    fetchRankingSales(dataInicial, dataFinal),
    fetchVendasPorBanco(dataInicial, dataFinal),
    fetchVendasPeriodo(dataInicial, dataFinal),
    fetchKpiData(dataInicial, dataFinal);

  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo, {userJson.nome}
          </p>
        </div>
      <div className="flex items-center gap-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="dataInicial">De:</Label>
            <Input
              type="date"
              id="dataInicial"
              value={dataInicial}
              onChange={(e) => setDataInicial(e.target.value)}
              className="w-40"
              />
            <Label htmlFor="dataFinal">Até:</Label>
              <Input
              type="date"
              id="dataFinal"
              value={dataFinal}
              onChange={(e) => setDataFinal(e.target.value)}
              className="w-40"
            />
          </div>
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Vendas do Mês"
          value= {formatCurrency(valorFinal.valorFinal)}
          icon={DollarSign}
          trend={{ value: 12.5, label: "vs mês anterior" }}
        />
        <KPICard
          title="Clientes Ativos"
          value={kpiData.clientesAtivos}
          icon={Users}
          trend={{ value: 8.3, label: "novos este mês" }}
        />
        <KPICard
          title="Propostas Abertas"
          value={kpiData.propostasEmAnalise}
          icon={FileText}
          trend={{ value: -5.2, label: "vs semana anterior" }}
        />
        <KPICard
          title="Meta do Mês"
          value="78%"
          icon={Target}
          subtitle="R$ 650k de R$ 850k"
          trend={{ value: 15.8, label: "progresso" }}
        />
      </div>

      {/* Charts and Tables Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              {formatChartTitle()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* O container responsivo garante que o gráfico se ajuste ao tamanho do card */}
            <ResponsiveContainer width="100%" height={256}>
              <BarChart data={vendasPeriodoGrafico} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="mes" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} tickFormatter={(value) => `R$${(value / 1000).toFixed(0)}k`} />
                <Tooltip 
                  cursor={{ fill: 'rgba(136, 132, 216, 0.1)' }}
                  contentStyle={{ 
                    background: 'white', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '0.5rem', 
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                  }}
                  formatter={(value) => [formatCurrency(value), 'Total Vendas']}
                />
                <Bar dataKey="totalVendas" name="Total de Vendas" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Funil de Conversão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Propostas Criadas</span>
                <span className="text-sm font-bold">{kpiData.propostasCriadas}</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-gradient-primary h-2 rounded-full" style={{ width: "100%" }}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Em Análise</span>
                <span className="text-sm font-bold">{kpiData.propostasEmAnalise}</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-gradient-primary h-2 rounded-full" style={{ width: "36%" }}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Aprovadas</span>
                <span className="text-sm font-bold">{kpiData.propostasAprovadas}</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-success h-2 rounded-full" style={{ width: "64%" }}></div>
              </div>

              <div className="pt-2 border-t">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span>Taxa de Conversão</span>
                  <span className="text-success">{kpiData.taxaDeConversao}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/clientes")}>
              <Users className="h-4 w-4 mr-2" />
              Novo Cliente
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/propostas")}>
              <FileText className="h-4 w-4 mr-2" />
              Nova Proposta
            </Button>
            <Button variant="outline" className="w-full justify-start"onClick={() => navigate("/vendas")}>
              <DollarSign className="h-4 w-4 mr-2" />
              Registrar Venda
            </Button>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Top Vendedores
            </CardTitle>
          </CardHeader>
          <CardContent>
          <div className="space-y-3">
            {ranking.map((vendedorObj, index) => {
              // 4. Extraia o nome e o valor de cada objeto
              const name = Object.keys(vendedorObj)[0];
              const salesValue = Object.values(vendedorObj)[0];
              const rank = index + 1;

              return (
                      <div key={name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                            rank === 2 ? 'bg-gray-100 text-gray-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {rank}
                          </div>
                          <span className="text-sm font-medium">{name}</span>
                        </div>
                        <span className="text-sm font-bold text-success">
                          {formatCurrency(salesValue)}
                        </span>
                      </div>
                    );
            })}
          </div>
          </CardContent>
        </Card>

        {/* Banks Performance */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              Vendas por Banco
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {rankingBanco.map((bancoData) => (
                <div key={bancoData.banco} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{bancoData.banco}</span>
                    <span className="font-bold">{formatCurrency(bancoData.totalVendas)}</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-1.5">
                    <div
                      className="bg-gradient-primary h-1.5 rounded-full transition-smooth"
                      style={{ width: `${bancoData.percentual}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
  }