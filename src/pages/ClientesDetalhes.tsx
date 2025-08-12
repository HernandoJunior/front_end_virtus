import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, IdCard, FileText, CalendarCheck, User } from "lucide-react";

const mockClientes = [
  {
    id: 1,
    nome: "João Silva Santos",
    cpf: "123.456.789-01",
    email: "joao.silva@email.com",
    telefone: "(11) 99999-9999",
    convenio: "INSS",
    margem: "R$ 15.430,00",
    colaborador: "Maria Santos",
    status: "Ativo",
    ultimaInteracao: "2024-01-15",
  },
  {
    id: 2,
    nome: "Ana Paula Costa",
    cpf: "987.654.321-09",
    email: "ana.costa@email.com",
    telefone: "(11) 88888-8888",
    convenio: "SIAPE",
    margem: "R$ 22.150,00",
    colaborador: "Carlos Lima",
    status: "Ativo",
    ultimaInteracao: "2024-01-14",
  },
  {
    id: 3,
    nome: "Roberto Oliveira",
    cpf: "456.789.123-45",
    email: "roberto.oliveira@email.com",
    telefone: "(11) 77777-7777",
    convenio: "INSS",
    margem: "R$ 8.900,00",
    colaborador: "João Silva",
    status: "Inativo",
    ultimaInteracao: "2024-01-10",
  },
];

export default function ClienteDetalhes() {
  const { id } = useParams();
  const clienteId = Number(id);
  const cliente = mockClientes.find((c) => c.id === clienteId);

  useEffect(() => {
    document.title = cliente
      ? `Cliente: ${cliente.nome} | Virtus CRM`
      : `Cliente | Virtus CRM`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute(
      'content',
      `Detalhes do cliente ${cliente?.nome ?? ''} no CRM Virtus. Contatos, status e informações principais.`
    );
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', window.location.href);
  }, [cliente]);

  if (!cliente) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Cliente não encontrado</h1>
        <Button variant="outline" asChild>
          <Link to="/clientes">Voltar</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Detalhes do Cliente</h1>
          <p className="text-muted-foreground">Informações e histórico do cliente</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to={`/clientes/${cliente.id}/propostas`}>
              <FileText className="h-4 w-4 mr-2" /> Propostas
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/clientes">Voltar</Link>
          </Button>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" /> {cliente.nome}
              </span>
              <Badge variant={cliente.status === 'Ativo' ? 'default' : 'secondary'}>
                {cliente.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <IdCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{cliente.cpf}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{cliente.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{cliente.telefone}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Convênio</span>
                  <span className="font-medium">{cliente.convenio}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Margem</span>
                  <span className="font-bold text-success">{cliente.margem}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Responsável</span>
                  <span className="font-medium">{cliente.colaborador}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Resumo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Última interação</span>
              <span className="font-medium">{cliente.ultimaInteracao}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className="font-medium">{cliente.status}</span>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Dados Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">CPF</span>
              <span className="font-medium">{cliente.cpf}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">{cliente.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Telefone</span>
              <span className="font-medium">{cliente.telefone}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Endereço</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>Endereço não informado.</p>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <CalendarCheck className="h-4 w-4 mt-0.5 text-primary" />
                <div className="text-sm">
                  <p className="font-medium">Contato realizado</p>
                  <p className="text-muted-foreground">Atualização de cadastro e verificação de margem</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}