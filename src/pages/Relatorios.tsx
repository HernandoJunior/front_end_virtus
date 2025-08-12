import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function Relatorios() {
  const [tipoRelatorio, setTipoRelatorio] = useState("vendas");

  const dadosVendas = [
    { periodo: "Janeiro 2024", vendas: 15, valor: 847200, meta: 850000, atingimento: 99.7 },
    { periodo: "Dezembro 2023", vendas: 12, valor: 723400, meta: 750000, atingimento: 96.5 },
    { periodo: "Novembro 2023", vendas: 18, valor: 892100, meta: 800000, atingimento: 111.5 },
  ];

  const dadosComissoes = [
    { colaborador: "Maria Santos", vendas: 8, valorVendas: 420000, comissao: 21000, supervisor: "Carlos Lima" },
    { colaborador: "João Silva", vendas: 5, valorVendas: 287500, comissao: 14375, supervisor: "Ana Rodriguez" },
    { colaborador: "Pedro Costa", vendas: 2, valorVendas: 139700, comissao: 6985, supervisor: "Carlos Lima" },
  ];

  const dadosBancos = [
    { banco: "Banco do Brasil", vendas: 8, valor: 345200, percentual: 40.7 },
    { banco: "Caixa Econômica", vendas: 5, valor: 287500, percentual: 33.9 },
    { banco: "Bradesco", vendas: 2, valor: 214500, percentual: 25.4 },
  ];

  const exportarRelatorio = () => {
    // Simulação de exportação CSV
    console.log("Exportando relatório em CSV...");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
          <p className="text-muted-foreground">
            Análise detalhada de vendas, comissões e performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportarRelatorio}>
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Filtros Globais */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <Label>Período</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Últimos 30 dias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7dias">Últimos 7 dias</SelectItem>
                  <SelectItem value="30dias">Últimos 30 dias</SelectItem>
                  <SelectItem value="3meses">Últimos 3 meses</SelectItem>
                  <SelectItem value="6meses">Últimos 6 meses</SelectItem>
                  <SelectItem value="ano">Último ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Colaborador</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="maria">Maria Santos</SelectItem>
                  <SelectItem value="joao">João Silva</SelectItem>
                  <SelectItem value="pedro">Pedro Costa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Supervisor</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="carlos">Carlos Lima</SelectItem>
                  <SelectItem value="ana">Ana Rodriguez</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Banco</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="bb">Banco do Brasil</SelectItem>
                  <SelectItem value="caixa">Caixa Econômica</SelectItem>
                  <SelectItem value="bradesco">Bradesco</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs dos Relatórios */}
      <Tabs value={tipoRelatorio} onValueChange={setTipoRelatorio}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="vendas">Vendas</TabsTrigger>
          <TabsTrigger value="comissoes">Comissões</TabsTrigger>
          <TabsTrigger value="bancos">Por Banco</TabsTrigger>
          <TabsTrigger value="funil">Funil</TabsTrigger>
        </TabsList>

        {/* Relatório de Vendas */}
        <TabsContent value="vendas" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
                <DollarSign className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 2.462M</div>
                <p className="text-xs text-muted-foreground">Nos últimos 3 meses</p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Qtd. Vendas</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45</div>
                <p className="text-xs text-muted-foreground">Vendas realizadas</p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Meta Atingida</CardTitle>
                <Target className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">102.6%</div>
                <p className="text-xs text-muted-foreground">Média dos períodos</p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 54.711</div>
                <p className="text-xs text-muted-foreground">Por venda</p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Vendas por Período</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Período</TableHead>
                    <TableHead>Qtd. Vendas</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead>Meta</TableHead>
                    <TableHead>Atingimento</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dadosVendas.map((dado, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{dado.periodo}</TableCell>
                      <TableCell>{dado.vendas}</TableCell>
                      <TableCell>R$ {dado.valor.toLocaleString()}</TableCell>
                      <TableCell>R$ {dado.meta.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className={dado.atingimento >= 100 ? "text-success font-medium" : "text-foreground"}>
                          {dado.atingimento}%
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Relatório de Comissões */}
        <TabsContent value="comissoes" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Comissões por Colaborador</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Colaborador</TableHead>
                    <TableHead>Qtd. Vendas</TableHead>
                    <TableHead>Valor Vendas</TableHead>
                    <TableHead>Comissão</TableHead>
                    <TableHead>Supervisor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dadosComissoes.map((dado, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{dado.colaborador}</TableCell>
                      <TableCell>{dado.vendas}</TableCell>
                      <TableCell>R$ {dado.valorVendas.toLocaleString()}</TableCell>
                      <TableCell className="text-success font-medium">R$ {dado.comissao.toLocaleString()}</TableCell>
                      <TableCell>{dado.supervisor}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Relatório por Banco */}
        <TabsContent value="bancos" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Performance por Banco</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Banco</TableHead>
                    <TableHead>Qtd. Vendas</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead>Participação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dadosBancos.map((dado, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{dado.banco}</TableCell>
                      <TableCell>{dado.vendas}</TableCell>
                      <TableCell>R$ {dado.valor.toLocaleString()}</TableCell>
                      <TableCell>{dado.percentual}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Funil de Conversão */}
        <TabsContent value="funil" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Funil de Conversão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">245</div>
                    <p className="text-sm text-muted-foreground">Propostas Criadas</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-warning">89</div>
                    <p className="text-sm text-muted-foreground">Em Análise</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-success">156</div>
                    <p className="text-sm text-muted-foreground">Convertidas</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Taxa de Conversão Geral</span>
                      <span className="font-bold text-success">63.7%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-3">
                      <div className="bg-success h-3 rounded-full" style={{ width: "63.7%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Propostas em Análise</span>
                      <span className="font-bold">36.3%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-3">
                      <div className="bg-warning h-3 rounded-full" style={{ width: "36.3%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}