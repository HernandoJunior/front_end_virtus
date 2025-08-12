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
  Award
} from "lucide-react";

import { api } from "@/services/api";
import { useEffect } from "react";

export default function Dashboard() {

  useEffect(() => { 
  async function listSales(){
    try {
      const req = await api.get("/vendas/mes")
      console.log(req.data)
    } catch (error) {
      console.log(error)
      alert("Nao foi possivel carregar as vendas")
    }
  }
    listSales(), []}
);


  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao painel de controle da Virtus Consultoria
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Últimos 30 dias
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Vendas do Mês"
          value="R$ 847.200"
          icon={DollarSign}
          trend={{ value: 12.5, label: "vs mês anterior" }}
        />
        <KPICard
          title="Clientes Ativos"
          value="1.247"
          icon={Users}
          trend={{ value: 8.3, label: "novos este mês" }}
        />
        <KPICard
          title="Propostas Abertas"
          value="89"
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
        {/* Sales Chart */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Vendas por Período
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-2 text-primary/30" />
                <p>Gráfico de vendas será implementado</p>
                <p className="text-sm">com dados do backend</p>
              </div>
            </div>
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
                <span className="text-sm font-bold">245</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-gradient-primary h-2 rounded-full" style={{ width: "100%" }}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Em Análise</span>
                <span className="text-sm font-bold">89</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-gradient-primary h-2 rounded-full" style={{ width: "36%" }}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Aprovadas</span>
                <span className="text-sm font-bold">156</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-success h-2 rounded-full" style={{ width: "64%" }}></div>
              </div>

              <div className="pt-2 border-t">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span>Taxa de Conversão</span>
                  <span className="text-success">63.7%</span>
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
            <Button variant="outline" className="w-full justify-start">
              <Users className="h-4 w-4 mr-2" />
              Novo Cliente
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Nova Proposta
            </Button>
            <Button variant="outline" className="w-full justify-start">
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
              {[
                { name: "João Silva", sales: "R$ 125.400", rank: 1 },
                { name: "Maria Santos", sales: "R$ 98.750", rank: 2 },
                { name: "Carlos Lima", sales: "R$ 87.300", rank: 3 }
              ].map((seller) => (
                <div key={seller.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      seller.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                      seller.rank === 2 ? 'bg-gray-100 text-gray-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {seller.rank}
                    </div>
                    <span className="text-sm font-medium">{seller.name}</span>
                  </div>
                  <span className="text-sm font-bold text-success">{seller.sales}</span>
                </div>
              ))}
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
              {[
                { bank: "Banco do Brasil", sales: "R$ 245.800", percentage: 35 },
                { bank: "Caixa Econômica", sales: "R$ 198.600", percentage: 28 },
                { bank: "Bradesco", sales: "R$ 156.400", percentage: 22 },
                { bank: "Outros", sales: "R$ 105.200", percentage: 15 }
              ].map((bank) => (
                <div key={bank.bank} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{bank.bank}</span>
                    <span className="font-bold">{bank.sales}</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-1.5">
                    <div 
                      className="bg-gradient-primary h-1.5 rounded-full transition-smooth" 
                      style={{ width: `${bank.percentage}%` }}
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