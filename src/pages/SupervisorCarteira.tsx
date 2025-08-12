import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserCheck, Search, DollarSign, Target, ArrowLeft } from "lucide-react";

const mockSupervisores = [
  {
    id: 1,
    nome: "Ana Rodriguez",
    cpf: "123.456.789-01",
    email: "ana.rodriguez@virtus.com",
    telefone: "(11) 99999-5678",
    colaboradores: [
      { id: 1, nome: "Maria Santos", cpf: "987.654.321-00", vendas: "R$ 125.400", metas: 85, comissao: "R$ 6.270" },
      { id: 2, nome: "João Silva", cpf: "456.789.123-11", vendas: "R$ 98.750", metas: 78, comissao: "R$ 4.937" },
      { id: 3, nome: "Pedro Costa", cpf: "789.123.456-22", vendas: "R$ 67.200", metas: 52, comissao: "R$ 3.360" },
    ],
    totalVendas: "R$ 291.350",
    metaGeral: 72,
    comissaoTotal: "R$ 14.567",
  },
  {
    id: 2,
    nome: "Carlos Lima",
    cpf: "321.654.987-33",
    email: "carlos.lima@virtus.com",
    telefone: "(11) 99999-1234",
    colaboradores: [
      { id: 4, nome: "Lucas Oliveira", cpf: "654.321.987-44", vendas: "R$ 156.800", metas: 95, comissao: "R$ 7.840" },
      { id: 5, nome: "Fernanda Silva", cpf: "147.258.369-55", vendas: "R$ 134.600", metas: 88, comissao: "R$ 6.730" },
    ],
    totalVendas: "R$ 291.400",
    metaGeral: 91,
    comissaoTotal: "R$ 14.570",
  },
];

export default function SupervisorCarteira() {
  const { supervisorId } = useParams();
  const id = Number(supervisorId);
  const supervisor = mockSupervisores.find((s) => s.id === id);

  const [search, setSearch] = useState("");

  useEffect(() => {
    const nome = supervisor?.nome || "Supervisor";
    document.title = `Carteira de ${nome} | Virtus CRM`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', `Gerenciamento da carteira do supervisor ${nome} no CRM Virtus.`);
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', window.location.href);
  }, [supervisor]);

  if (!supervisor) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Supervisor não encontrado</h1>
        <Button variant="outline" asChild>
          <Link to="/carteiras">Voltar</Link>
        </Button>
      </div>
    );
  }

  const colaboradoresFiltrados = useMemo(() => {
    return supervisor.colaboradores.filter(
      (c) => c.nome.toLowerCase().includes(search.toLowerCase()) || c.cpf.includes(search)
    );
  }, [search, supervisor.colaboradores]);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Carteira do Supervisor</h1>
          <p className="text-muted-foreground">{supervisor.nome} • CPF {supervisor.cpf}</p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/carteiras">
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
          </Link>
        </Button>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Colaboradores</CardTitle>
            <UserCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{supervisor.colaboradores.length}</div>
            <p className="text-xs text-muted-foreground">Ativos nesta carteira</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas Totais</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{supervisor.totalVendas}</div>
            <p className="text-xs text-muted-foreground">Nesta carteira</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meta Geral</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{supervisor.metaGeral}%</div>
            <p className="text-xs text-muted-foreground">Atingimento consolidado</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Colaboradores</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="search">Buscar</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input id="search" placeholder="Nome ou CPF" className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colaborador</TableHead>
                <TableHead>Vendas</TableHead>
                <TableHead>Meta</TableHead>
                <TableHead>Comissão</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {colaboradoresFiltrados.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{c.nome}</p>
                      <p className="text-sm text-muted-foreground">CPF: {c.cpf}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-success">{c.vendas}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{c.metas}%</span>
                      <div className={`w-2 h-2 rounded-full ${c.metas >= 80 ? 'bg-success' : c.metas >= 60 ? 'bg-warning' : 'bg-destructive'}`}></div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-primary">{c.comissao}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}