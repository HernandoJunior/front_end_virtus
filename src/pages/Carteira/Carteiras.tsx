import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Plus, Search, Edit, UserCheck, DollarSign, Target } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link, MemoryRouter } from "react-router-dom"; // Importa o MemoryRouter
import { api } from "@/services/api"; // Descomente em seu projeto real


interface Colaborador {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  totalVendas: number;
  totalComissao: number;
  metaAtingimento: number;
}

interface Carteira {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  totalVendasEquipe: number;
  totalComissaoEquipe: number;
  metaGeralAtingimento: number;
  colaboradores: Colaborador[];
}

export default function Carteiras() {
  const [carteiras, setCarteiras] = useState<Carteira[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroSupervisor, setFiltroSupervisor] = useState("todos");

  useEffect(() => {
    async function fetchCarteiras() {
      try {
        const response = await api.get("/carteiras");
        setCarteiras(response.data);
      } catch (error) {
        alert("Nao foi possivel buscar as carteiras");
      }
    }
    fetchCarteiras();
  }, []);

  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const filteredCarteiras = carteiras.filter(carteira => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = carteira.nome.toLowerCase().includes(searchTermLower) ||
      carteira.cpf.includes(searchTerm) ||
      carteira.colaboradores.some(colab =>
        colab.nome.toLowerCase().includes(searchTermLower) ||
        colab.cpf.includes(searchTerm)
      );
    const matchesFilter = filtroSupervisor === "todos" || carteira.id === Number(filtroSupervisor);
    return matchesSearch && matchesFilter;
  });

  const totalColaboradores = carteiras.reduce((sum, sup) => sum + sup.colaboradores.length, 0);
  const totalVendasGeral = carteiras.reduce((sum, sup) => sum + sup.totalVendasEquipe, 0);

  return (
    // Envolve o componente com MemoryRouter para fornecer o contexto de roteamento
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Carteiras de Supervisores</h1>
            <p className="text-muted-foreground">Gerencie carteiras de clientes e equipes de supervisores</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="shadow-card"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Supervisores</CardTitle><UserCheck className="h-4 w-4 text-primary" /></CardHeader><CardContent><div className="text-2xl font-bold">{carteiras.length}</div><p className="text-xs text-muted-foreground">Ativos no sistema</p></CardContent></Card>
          <Card className="shadow-card"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Colaboradores</CardTitle><Users className="h-4 w-4 text-primary" /></CardHeader><CardContent><div className="text-2xl font-bold">{totalColaboradores}</div><p className="text-xs text-muted-foreground">Distribuídos em carteiras</p></CardContent></Card>
          <Card className="shadow-card"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Vendas Totais (Mês)</CardTitle><DollarSign className="h-4 w-4 text-primary" /></CardHeader><CardContent><div className="text-2xl font-bold">{formatCurrency(totalVendasGeral)}</div><p className="text-xs text-muted-foreground">Todas as carteiras</p></CardContent></Card>
          <Card className="shadow-card"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Meta Média (Mês)</CardTitle><Target className="h-4 w-4 text-primary" /></CardHeader><CardContent><div className="text-2xl font-bold">{carteiras.length > 0 ? (carteiras.reduce((sum, sup) => sum + sup.metaGeralAtingimento, 0) / carteiras.length).toFixed(1) : 0}%</div><p className="text-xs text-muted-foreground">Atingimento geral</p></CardContent></Card>
        </div>
        
        <div className="space-y-6">
          {filteredCarteiras.map((carteira) => (
            <Card key={carteira.id} className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2"><UserCheck className="h-5 w-5 text-primary" />{carteira.nome}</CardTitle>
                    <div className="flex gap-4 text-sm text-muted-foreground mt-2"><span>CPF: {carteira.cpf}</span><span>{carteira.email}</span></div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-success">{formatCurrency(carteira.totalVendasEquipe)}</div>
                    <div className="text-sm text-muted-foreground">Meta: {carteira.metaGeralAtingimento.toFixed(1)}%</div>
                    {/* <div className="text-sm text-primary">Comissão: {formatCurrency(carteira.totalComissaoEquipe)}</div> */}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">Colaboradores da Carteira ({carteira.colaboradores.length})</h4>
                  <Link to={`/carteiras/${carteira.id}`}><Button variant="outline" size="sm"><Edit className="h-4 w-4 mr-2" />Gerenciar Carteira</Button></Link>
                </div>
                <Table>
                  <TableHeader><TableRow><TableHead>Colaborador</TableHead><TableHead>Email</TableHead><TableHead>Meta</TableHead><TableHead>Telefone</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {carteira.colaboradores.map((colaborador) => (
                      <TableRow key={colaborador.id}><TableCell><div><p className="font-medium">{colaborador.nome}</p><p className="text-sm text-muted-foreground">CPF: {colaborador.cpf}</p></div></TableCell><TableCell>{colaborador.email}</TableCell><TableCell><div className="flex items-center gap-2"><span className="text-sm font-medium">{colaborador.metaAtingimento.toFixed(1)}%</span><div className={`w-2 h-2 rounded-full ${colaborador.metaAtingimento >= 80 ? 'bg-success' : colaborador.metaAtingimento >= 60 ? 'bg-warning' : 'bg-destructive'}`}></div></div></TableCell><TableCell>{colaborador.telefone || "N/A"}</TableCell></TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
  );
}

