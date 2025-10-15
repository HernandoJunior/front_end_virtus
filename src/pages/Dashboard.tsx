import { KPICard } from "@/components/DashboardKPI";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  Users, 
  FileText, 
  Target,
  TrendingUp,
  Award,
  Search,
  Building,
  Loader2
} from "lucide-react";
import { api } from "@/services/api";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Bar, CartesianGrid, ResponsiveContainer, XAxis, YAxis, BarChart, Tooltip } from "recharts";

// Interface para o objeto de usuário
interface CurrentUser {
  nome: string;
  role: 'ADMIN' | 'SUPERVISOR' | 'USER';
}

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const navigate = useNavigate();

  // Estado para KPIs de VENDAS (rota /vendas/mes)
  const [salesKpi, setSalesKpi] = useState({
    valorTotalVendas: 0,
    variacaoPercentual: 0,
    quantidadeTotal: 0,
    comissaoTotal: 0,
    ticketMedio: 0,
  });

  // Estado para KPIs GERAIS (clientes, propostas - rota /dashboard/kpis)
  const [generalKpi, setGeneralKpi] = useState({
    clientesAtivos: 0,
    propostasCriadas: 0,
    propostasEmAnalise: 0,
    propostasAprovadas: 0,
    taxaDeConversao: 0,
  });

  const [ranking, setRanking] = useState<any[]>([]);
  const [rankingBanco, setVendasPorBanco] = useState<any[]>([]);
  const [vendasPeriodoGrafico, setVendasPeriodo] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
  };

  const fetchAllData = async (start: string, end: string, user: CurrentUser | null) => {
    if (!start || !end || !user) return;
    setIsLoading(true);
    
    try {
      const dataPromises = [
        api.get(`/vendas/mes?dataInicial=${start}&dataFinal=${end}`),       // KPIs de Vendas
        api.get(`/dashboard/kpis?dataInicial=${start}&dataFinal=${end}`), // KPIs de Clientes/Propostas
        api.get(`/vendas/graficoPeriodo/${start}/${end}`),
        api.get(`/vendas/vendaPorBanco/${start}/${end}`),
        api.get(`/vendas/topVendedores/${start}/${end}`), // ALTERAÇÃO: A busca do ranking agora é feita para todos os perfis
      ];
      
      const results = await Promise.all(dataPromises);
      
      setSalesKpi(results[0].data);
      setGeneralKpi(results[1].data);
      setVendasPeriodo(results[2].data);
      setVendasPorBanco(results[3].data);
      setRanking(results[4].data); // ALTERAÇÃO: O ranking sempre recebe o resultado

    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
      alert("Não foi possível carregar os dados do dashboard.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const userString = window.localStorage.getItem("@virtus:user");
    const user = userString ? JSON.parse(userString) : null;
    setCurrentUser(user);

    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split("T")[0];
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split("T")[0];
    
    setDataInicial(firstDay);
    setDataFinal(lastDay);

    if (user) {
      fetchAllData(firstDay, lastDay, user);
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleSearch = () => {
    fetchAllData(dataInicial, dataFinal, currentUser);
  };
  
  const formatChartTitle = () => {
    if (!dataInicial || !dataFinal) return "Vendas por Período";
    const start = new Date(dataInicial + 'T00:00:00').toLocaleDateString('pt-BR');
    const end = new Date(dataFinal + 'T00:00:00').toLocaleDateString('pt-BR');
    return `Vendas de ${start} a ${end}`;
  };

  const isUserRole = currentUser?.role === 'USER';
  const titleText = isUserRole ? "Minhas" : "Total";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Bem-vindo, {currentUser?.nome || 'Usuário'}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="dataInicial">De:</Label>
            <Input type="date" id="dataInicial" value={dataInicial} onChange={(e) => setDataInicial(e.target.value)} className="w-40" />
            <Label htmlFor="dataFinal">Até:</Label>
            <Input type="date" id="dataFinal" value={dataFinal} onChange={(e) => setDataFinal(e.target.value)} className="w-40" />
          </div>
          <Button onClick={handleSearch} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
            Buscar
          </Button>
        </div>
      </div>

      {/* LINHA 1: KPIs PRINCIPAIS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title={`${titleText} Vendas`}
          value={formatCurrency(salesKpi.valorTotalVendas)}
          icon={DollarSign}
          trend={typeof salesKpi.variacaoPercentual === 'number' ? { value: parseFloat(salesKpi.variacaoPercentual.toFixed(1)), label: "vs período anterior" } : undefined}
        />
        <KPICard
          title="Clientes Ativos"
          value={generalKpi.clientesAtivos}
          icon={Users}
          subtitle="No período selecionado"
        />
        <KPICard
          title="Propostas Abertas"
          value={generalKpi.propostasEmAnalise}
          icon={FileText}
          subtitle="Aguardando análise"
        />
        <KPICard
          title="Meta do Mês"
          value={"N/A"} // Você pode conectar este valor ao seu estado de metas
          icon={Target}
          subtitle="Progresso da meta"
        />
      </div>

      {/* LINHA 2: GRÁFICO E FUNIL */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" />{formatChartTitle()}</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={256}>
              <BarChart data={vendasPeriodoGrafico} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="mes" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} tickFormatter={(value: number) => `R$${(value / 1000).toFixed(0)}k`} />
                <Tooltip 
                  cursor={{ fill: 'rgba(136, 132, 216, 0.1)' }}
                  contentStyle={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}
                  formatter={(value: number) => [formatCurrency(value), 'Total Vendas']}
                />
                <Bar dataKey="totalVendas" name="Total de Vendas" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader><CardTitle className="flex items-center gap-2"><Award className="h-5 w-5 text-primary" />Funil de Conversão</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between"><span className="text-sm font-medium">Propostas Criadas</span><span className="text-sm font-bold">{generalKpi.propostasCriadas}</span></div>
              <div className="w-full bg-secondary rounded-full h-2"><div className="bg-gradient-primary h-2 rounded-full" style={{ width: "100%" }}></div></div>
              <div className="flex items-center justify-between"><span className="text-sm font-medium">Em Análise</span><span className="text-sm font-bold">{generalKpi.propostasEmAnalise}</span></div>
              <div className="w-full bg-secondary rounded-full h-2"><div className="bg-gradient-primary h-2 rounded-full" style={{ width: `${(generalKpi.propostasEmAnalise / generalKpi.propostasCriadas) * 100 || 0}%` }}></div></div>
              <div className="flex items-center justify-between"><span className="text-sm font-medium">Aprovadas</span><span className="text-sm font-bold">{generalKpi.propostasAprovadas}</span></div>
              <div className="w-full bg-secondary rounded-full h-2"><div className="bg-success h-2 rounded-full" style={{ width: `${(generalKpi.propostasAprovadas / generalKpi.propostasCriadas) * 100 || 0}%` }}></div></div>
              <div className="pt-2 border-t"><div className="flex items-center justify-between text-sm font-semibold"><span>Taxa de Conversão</span><span className="text-success">{generalKpi.taxaDeConversao.toFixed(2)}%</span></div></div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* LINHA 3: AÇÕES E RANKINGS */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="shadow-card">
          <CardHeader><CardTitle>Ações Rápidas</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/clientes/novo")}><Users className="h-4 w-4 mr-2" />Novo Cliente</Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/propostas/nova")}><FileText className="h-4 w-4 mr-2" />Nova Proposta</Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/vendas/nova")}><DollarSign className="h-4 w-4 mr-2" />Registrar Venda</Button>
          </CardContent>
        </Card>

        {/* ALTERAÇÃO: A condição que envolvia este card foi removida */}
        <Card className="shadow-card">
          <CardHeader><CardTitle className="flex items-center gap-2"><Award className="h-5 w-5 text-primary" />{isUserRole ? "Meu Desempenho" : "Top Vendedores"}</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ranking.map((vendedorObj, index) => {
                const name = Object.keys(vendedorObj)[0];
                const salesValue = Object.values(vendedorObj)[0] as number;
                const rank = index + 1;
                return (
                  <div key={name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${rank === 1 ? 'bg-yellow-100 text-yellow-800' : rank === 2 ? 'bg-gray-100 text-gray-800' : 'bg-orange-100 text-orange-800'}`}>{rank}</div>
                      <span className="text-sm font-medium">{name}</span>
                    </div>
                    <span className="text-sm font-bold text-success">{formatCurrency(salesValue)}</span>
                  </div>
                );
              })}
              {ranking.length === 0 && !isLoading && (
                  <p className="text-sm text-muted-foreground text-center">Nenhuma venda registrada no período.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader><CardTitle className="flex items-center gap-2"><Building className="h-5 w-5 text-primary" />Vendas por Banco</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {rankingBanco.map((bancoData: any) => (
                <div key={bancoData.banco} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{bancoData.banco}</span>
                    <span className="font-bold">{formatCurrency(bancoData.totalVendas)}</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-1.5">
                    <div className="bg-gradient-primary h-1.5 rounded-full transition-smooth" style={{ width: `${bancoData.percentual.toFixed(2)}%` }}></div>
                  </div>
                </div>
              ))}
               {rankingBanco.length === 0 && !isLoading && (
                  <p className="text-sm text-muted-foreground text-center">Nenhuma venda registrada no período.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}