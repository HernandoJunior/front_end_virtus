import { useState } from "react";
import { api } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  BarChart3,
  Download,
  Filter,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Calendar,
  Building,
  PieChart
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
import { Progress } from "@/components/ui/progress";

interface RelatorioCompleto {
  kpis: {
    totalVendas: number;
    qtdVendas: number;
    metaAtingidaPercentual: number;
    ticketMedio: number;
  };
  vendasPorPeriodo: {
    periodo: string;
    qtdVendas: number;
    valorTotal: number;
    valorMeta: number;
    atingimentoPercentual: number;
  }[];
  comissoes: {
    responsavelNome: string;
    qtdVendas: number;
    totalComissionado: number;
  }[];
  vendasPorBanco: {
    banco: string;
    qtdVendas: number;
    valorTotal: number;
    percentual: number;
  }[];
  funil: {
    propostasCriadas: number;
    propostasEmAnalise: number;
    propostasAprovadas: number;
    propostasRecusadas: number;
    taxaDeConversao: number;
  };
}

export default function Relatorios() {
  const [relatorioData, setRelatorioData] = useState<RelatorioCompleto | null>(null);
  
  // Estados para os filtros
  const [periodo, setPeriodo] = useState('ultimos-30-dias');
  // ... outros estados para filtros

  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  useEffect(() => {
    async function fetchRelatorio() {
      const dataFinal = new Date();
      const dataInicial = new Date();
      // Lógica para ajustar dataInicial com base na seleção do 'periodo'
      switch (periodo) {
        case 'este-mes':
            dataInicial.setDate(1);
            break;
        case 'mes-passado':
            dataInicial.setMonth(dataInicial.getMonth() - 1);
            dataInicial.setDate(1);
            dataFinal.setDate(0); // Último dia do mês anterior
            break;
        case 'ultimos-3-meses':
            dataInicial.setMonth(dataInicial.getMonth() - 3);
            break;
        case 'ultimos-30-dias':
        default:
            dataInicial.setDate(dataFinal.getDate() - 30);
            break;
      }
      
      const params = new URLSearchParams({
        dataInicial: dataInicial.toISOString().split('T')[0],
        dataFinal: dataFinal.toISOString().split('T')[0],
        // Adicione outros filtros aqui, se não forem 'todos'
      });

      try {
        const response = await api.get(`/relatorios/vendas?${params.toString()}`);
        setRelatorioData(response.data);
      } catch (error) {
        console.error("Erro ao buscar relatório:", error);
      }
    }
    fetchRelatorio();
  }, [periodo]); // Recarrega quando um filtro mudar

  if (!relatorioData) {
    return <div>Carregando relatório...</div>;
  }

  const { kpis, vendasPorPeriodo, comissoes, vendasPorBanco, funil } = relatorioData;
  const totalFunil = funil.propostasCriadas > 0 ? funil.propostasCriadas : 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
          <p className="text-muted-foreground">Análise detalhada de vendas, comissões e performance</p>
        </div>
        <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Exportar CSV</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Filtros</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={periodo} onValueChange={setPeriodo}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent>
                    <SelectItem value="ultimos-30-dias">Últimos 30 dias</SelectItem>
                    <SelectItem value="este-mes">Este mês</SelectItem>
                    <SelectItem value="mes-passado">Mês passado</SelectItem>
                    <SelectItem value="ultimos-3-meses">Últimos 3 meses</SelectItem>
                </SelectContent>
            </Select>
            <Select><SelectTrigger><SelectValue placeholder="Colaborador: Todos"/></SelectTrigger></Select>
            <Select><SelectTrigger><SelectValue placeholder="Supervisor: Todos"/></SelectTrigger></Select>
            <Select><SelectTrigger><SelectValue placeholder="Banco: Todos"/></SelectTrigger></Select>
        </CardContent>
      </Card>

      <Tabs defaultValue="vendas">
        <TabsList>
          <TabsTrigger value="vendas">Vendas</TabsTrigger>
          <TabsTrigger value="comissoes">Comissões</TabsTrigger>
          <TabsTrigger value="por-banco">Por Banco</TabsTrigger>
          <TabsTrigger value="funil">Funil</TabsTrigger>
        </TabsList>

        <TabsContent value="vendas" className="space-y-6 mt-4">
            <div className="grid gap-4 md:grid-cols-4">
                <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total de Vendas</CardTitle><DollarSign className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{formatCurrency(kpis.totalVendas)}</div></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Qtd. Vendas</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{kpis.qtdVendas}</div></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Meta Atingida</CardTitle><Target className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold text-success">{kpis.metaAtingidaPercentual.toFixed(1)}%</div></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Ticket Médio</CardTitle><TrendingUp className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{formatCurrency(kpis.ticketMedio)}</div></CardContent></Card>
            </div>
            <Card>
                <CardHeader><CardTitle>Vendas por Período</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Período</TableHead><TableHead>Qtd. Vendas</TableHead><TableHead>Valor Total</TableHead><TableHead>Meta</TableHead><TableHead>Atingimento</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {vendasPorPeriodo.map(item => (<TableRow key={item.periodo}><TableCell className="font-medium">{item.periodo}</TableCell><TableCell>{item.qtdVendas}</TableCell><TableCell>{formatCurrency(item.valorTotal)}</TableCell><TableCell>{formatCurrency(item.valorMeta)}</TableCell><TableCell className={`font-bold ${item.atingimentoPercentual >= 100 ? 'text-success' : 'text-warning'}`}>{item.atingimentoPercentual.toFixed(1)}%</TableCell></TableRow>))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="comissoes" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Comissões por Responsável</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Responsável</TableHead><TableHead>Qtd. Vendas</TableHead><TableHead>Total Comissionado</TableHead></TableRow></TableHeader>
                <TableBody>
                  {comissoes.map(item => (<TableRow key={item.responsavelNome}><TableCell className="font-medium">{item.responsavelNome}</TableCell><TableCell>{item.qtdVendas}</TableCell><TableCell className="text-success font-bold">{formatCurrency(item.totalComissionado)}</TableCell></TableRow>))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="por-banco" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Performance por Banco</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Banco</TableHead><TableHead>Qtd. Vendas</TableHead><TableHead>Valor Total</TableHead><TableHead>Participação (%)</TableHead></TableRow></TableHeader>
                <TableBody>
                  {vendasPorBanco.map(item => (<TableRow key={item.banco}><TableCell className="font-medium">{item.banco}</TableCell><TableCell>{item.qtdVendas}</TableCell><TableCell>{formatCurrency(item.valorTotal)}</TableCell><TableCell><div className="flex items-center gap-2"><span>{item.percentual.toFixed(1)}%</span><Progress value={item.percentual} className="h-2 w-24" /></div></TableCell></TableRow>))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="funil" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Funil de Conversão do Período</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div><div className="flex justify-between text-sm mb-1"><span>Propostas Criadas</span><span className="font-bold">{funil.propostasCriadas}</span></div><Progress value={100} /></div>
                <div><div className="flex justify-between text-sm mb-1"><span>Em Análise</span><span className="font-bold">{funil.propostasEmAnalise}</span></div><Progress value={(funil.propostasEmAnalise / totalFunil) * 100} /></div>
                <div><div className="flex justify-between text-sm mb-1"><span>Aprovadas</span><span className="font-bold">{funil.propostasAprovadas}</span></div><Progress value={(funil.propostasAprovadas / totalFunil) * 100} className="[&>*]:bg-success" /></div>
                <div><div className="flex justify-between text-sm mb-1"><span>Recusadas</span><span className="font-bold">{funil.propostasRecusadas}</span></div><Progress value={(funil.propostasRecusadas / totalFunil) * 100} className="[&>*]:bg-destructive" /></div>
                <div className="pt-4 border-t"><div className="flex justify-between font-semibold"><span>Taxa de Conversão</span><span className="text-success">{funil.taxaDeConversao.toFixed(1)}%</span></div></div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}