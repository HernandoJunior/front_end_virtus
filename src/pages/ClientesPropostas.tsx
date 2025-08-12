import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, FileText, ArrowLeft } from "lucide-react";

const mockClientes = [
  { id: 1, nome: "João Silva Santos" },
  { id: 2, nome: "Ana Paula Costa" },
  { id: 3, nome: "Roberto Oliveira" },
];

const mockPropostas = [
  { id: "P-001", clienteId: 1, titulo: "Empréstimo Consignado", status: "Em análise", valor: 15430, data: "2024-01-10" },
  { id: "P-002", clienteId: 1, titulo: "Cartão Consignado", status: "Aprovada", valor: 5000, data: "2024-01-12" },
  { id: "P-003", clienteId: 2, titulo: "Refinanciamento", status: "Recusada", valor: 12000, data: "2024-01-08" },
  { id: "P-004", clienteId: 2, titulo: "Portabilidade", status: "Em análise", valor: 9800, data: "2024-01-15" },
  { id: "P-005", clienteId: 3, titulo: "Empréstimo Consignado", status: "Aprovada", valor: 8900, data: "2024-01-11" },
];

export default function ClientePropostas() {
  const { id } = useParams();
  const clienteId = Number(id);
  const cliente = mockClientes.find((c) => c.id === clienteId);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("todos");

  const propostasDoCliente = useMemo(() => {
    return mockPropostas.filter((p) => p.clienteId === clienteId);
  }, [clienteId]);

  const filtradas = useMemo(() => {
    return propostasDoCliente.filter((p) => {
      const matchesStatus = status === "todos" || p.status === status;
      const matchesSearch = p.titulo.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [propostasDoCliente, search, status]);

  const total = filtradas.reduce((sum, p) => sum + p.valor, 0);

  useEffect(() => {
    const nome = cliente?.nome || "Cliente";
    document.title = `Propostas de ${nome} | Virtus CRM`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', `Lista de propostas associadas ao cliente ${nome} no CRM Virtus.`);
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', window.location.href);
  }, [cliente]);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Propostas do Cliente</h1>
          <p className="text-muted-foreground">{cliente ? cliente.nome : "Cliente"}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to={`/clientes/${clienteId}`}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Ver Cliente
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/clientes">Voltar</Link>
          </Button>
        </div>
      </header>

      <Card className="shadow-card">
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Buscar por código ou título" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="flex flex-wrap gap-2">
              {(["todos", "Em análise", "Aprovada", "Recusada"]) as const}.map
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{filtradas.length} propostas encontradas</span>
            <span className="font-medium">Total: R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Propostas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtradas.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.id}</TableCell>
                  <TableCell>{p.titulo}</TableCell>
                  <TableCell>
                    <Badge variant={p.status === 'Aprovada' ? 'default' : p.status === 'Recusada' ? 'secondary' : 'outline'}>
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-success">R$ {p.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell>{p.data}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}