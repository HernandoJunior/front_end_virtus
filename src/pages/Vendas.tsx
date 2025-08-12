import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign,
  Plus,
  Search,
  Filter,
  Download,
  Calendar,
  Upload,
  Users,
  Building,
  CreditCard,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { api } from "@/services/api";
import { useNavigate } from "react-router-dom";

import { jsPDF } from "jspdf";

export default function Vendas() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const doc = new jsPDF();

  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  //Estado para armazenar lista de clientes
  const [clients, setClients] = useState([]);
  const [clientsPDF, setClientsPDF] = useState([]);

  //Estado para armazenar lista de colaboradores
  const [colaborators, setColaborators] = useState([]);

  //Estado para armazenar lista de supervisores
  const [supervisors, setSupervisors] = useState([]);

  useEffect(() => {
    // Função para buscar os clientes
    async function fetchClients() {
      try {
        const response = await api.get("/clientes/consulta");
        setClients(response.data);
        setClientsPDF(response.data.json);
        console.log(clientsPDF)
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      }
    }

    //Funcao para buscar colaboradores
    async function fetchColaborators() {
      try {
        const response = await api.get("/colaborador/listarcol");
        setColaborators(response.data);
      } catch (error) {
        console.error("Erro ao buscar colaboradores:", error);
      }
    }

    // Função para buscar os supervisores
    async function fetchSupervisors() {
      try {
        const response = await api.get("/supervisor/listarsupervisores");
        setSupervisors(response.data);
      } catch (error) {
        console.error("Erro ao buscar supervisores:", error);
      }
    }

    // Chama todas as funções
    fetchClients();
    fetchColaborators();
    fetchSupervisors();

  }, []);

  const [venda, setVenda] = useState({
    ID_COLABORADOR: 0,
    ID_SUPERVISOR: 0,
    ID_CLIENTE: 0,
    valorLiberado: 0,
    comissaoColaborador: 0,
    comissaoSupervisor: 0,
    comissaoEmpresaBruta: 0,
    comissaoEmpresaLiquido: 0,
    dataVenda: "",
    numeroOperacao: "",
    prazo: "",
    banco: ""
  });

  const vendas = [
    {
      id: 1,
      cliente: "João Silva Santos",
      cpf: "123.456.789-01",
      valor: 45000,
      colaborador: "Maria Santos",
      supervisor: "Carlos Lima",
      banco: "Banco do Brasil",
      Prazo: "120X",
      comissaoColaborador: 2250,
      comissaoSupervisor: 900,
      dataVenda: "2024-01-15",
      status: "Concluída"
    },
    {
      id: 2,
      cliente: "Ana Maria Costa",
      cpf: "987.654.321-09",
      valor: 32000,
      colaborador: "João Silva",
      supervisor: "Ana Rodriguez",
      banco: "Caixa Econômica",
      formaPagamento: "TED",
      comissaoColaborador: 1600,
      comissaoSupervisor: 640,
      dataVenda: "2024-01-14",
      status: "Processando"
    },
    {
      id: 3,
      cliente: "Pedro Oliveira",
      cpf: "456.789.123-45",
      valor: 78000,
      colaborador: "Maria Santos",
      supervisor: "Carlos Lima",
      banco: "Bradesco",
      formaPagamento: "PIX",
      comissaoColaborador: 3900,
      comissaoSupervisor: 1560,
      dataVenda: "2024-01-13",
      status: "Concluída"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Concluída": return "bg-success text-success-foreground";
      case "Processando": return "bg-warning text-warning-foreground";
      case "Cancelada": return "bg-destructive text-destructive-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  const filteredVendas = vendas.filter(venda =>
    venda.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venda.cpf.includes(searchTerm) ||
    venda.colaborador.toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function cadastrarVenda() {
    if(!venda.ID_CLIENTE ||
      !venda.ID_COLABORADOR ||
      !venda.ID_SUPERVISOR ||
      !venda.banco ||
      !venda.comissaoColaborador ||
      !venda.comissaoEmpresaBruta ||
      !venda.dataVenda ||
      !venda.numeroOperacao ||
      !venda.prazo ||
      !venda.valorLiberado) {return alert("Preencha todos os campos")}

    try {
        const req = api.post("/vendas/cadsatrarven", venda)
        alert("Venda cadastrada com sucesso!")

        setIsDialogOpen(false)
        // navigate(-1)
    } catch (error) {
      alert("Erro ao cadastrar venda")
      console.log(error)
    }
  }

  const downloadPDF = () => 
  {
    doc.text(clients, 10, 10)
    doc.save("clientes.pdf")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vendas</h1>
          <p className="text-muted-foreground">
            Registre e gerencie todas as vendas realizadas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" onClick={() => setIsImportOpen}>
                <Upload className="h-4 w-4 mr-2" />
                  Importar
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Importacao para o sistema</DialogTitle>
                <DialogDescription>
                  Importacao de vendas no sistema
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo da planilha" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="quantidade">Quantidade</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a quantidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">50</SelectItem>
                      <SelectItem value="excel">100</SelectItem>
                      <SelectItem value="todos">Todos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1" onClick={downloadPDF}>
                    Exportar
                  </Button>
                  <Button variant="outline" onClick={() => setIsImportOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>


          {/* EXPORTACAO CARD */}
          <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Exportacao</DialogTitle>
                <DialogDescription>
                  Exportacao de vendas do sistema
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o formato" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="quantidade">Quantidade</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a quantidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">50</SelectItem>
                      <SelectItem value="excel">100</SelectItem>
                      <SelectItem value="todos">Todos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1">
                    Exportar
                  </Button>
                  <Button variant="outline" onClick={() => setIsExportOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* CADASTRO DE NOVA VENDA */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Venda
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Registrar Nova Venda</DialogTitle>
                <DialogDescription>
                  Registre uma nova venda no sistema
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cliente">Cliente</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map(cliente => (
                        <SelectItem key={cliente.ID_CLIENTE} value={cliente.ID_CLIENTE}>
                          {cliente.ID_CLIENTE } - {cliente.nome}
                        </SelectItem>  
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="valor">Valor da Venda (R$)</Label>
                  <Input id="valor" type="number" placeholder="45000" />
                </div>
                <div>
                  <Label htmlFor="prazo">Prazo</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o prazo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24x">24X</SelectItem>
                      <SelectItem value="48X">48X</SelectItem>
                      <SelectItem value="84x">84X</SelectItem>
                      <SelectItem value="96x">96X</SelectItem>
                      <SelectItem value="120x">120X</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="numeroOperacao">Numero da Operacao</Label>
                  <Input id="numeroOperacao" type="number" placeholder="34589182" />
                </div>
                <div>
                  <Label htmlFor="comissaoEmpresa">Comissao Empresa Bruto(R$)</Label>
                  <Input id="comissaoEmpresaBruto" type="number" placeholder="300.57" />
                </div>
                <div>
                  <Label htmlFor="comissao">Comissao Colaborador (R$)</Label>
                  <Input id="comissaoColaborador" type="number" placeholder="100.69" />
                </div>
                <div>
                  <Label htmlFor="supervisor">Supervisor</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o supervisor" />
                    </SelectTrigger>
                    <SelectContent>
                      {supervisors.map(supervisor => (
                        <SelectItem key={supervisor.ID_SUPERVISOR} value={supervisor.ID_SUPERVISOR}>
                          {supervisor.ID_SUPERVISOR} - {supervisor.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="colaborador">Colaborador</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o colaborador" />
                    </SelectTrigger>
                    <SelectContent>
                      {colaborators.map( colaborator => (
                        <SelectItem key={colaborator.ID_COLABORADOR} value={colaborator.ID_COLABORADOR}>
                          {colaborator.ID_COLABORADOR} - {colaborator.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="banco">Banco</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o banco" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bb">Banco do Brasil</SelectItem>
                      <SelectItem value="master">Banco Master</SelectItem>
                      <SelectItem value="facta">Facta</SelectItem>
                      <SelectItem value="c6">C6</SelectItem>
                      <SelectItem value="daycoval">Daycoval</SelectItem>
                      <SelectItem value="pan">Banco Pan</SelectItem>
                      <SelectItem value="santander">Santander</SelectItem>
                      <SelectItem value="qualy">Qualy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="linha">Linha</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a linha" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inss">INSS</SelectItem>
                      <SelectItem value="govsp">GOV SP</SelectItem>
                      <SelectItem value="prefsp">PREF SP</SelectItem>
                      <SelectItem value="govba">GOV BA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="data">Data da Venda</Label>
                  <Input id="data" type="date" />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={() => cadastrarVenda()} className="flex-1">
                    Registrar Venda
                  </Button>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* KPIs de Vendas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vendas</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 155.000</div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Qtd. Vendas</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Vendas realizadas</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comissões</CardTitle>
            <CreditCard className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 12.850</div>
            <p className="text-xs text-muted-foreground">A pagar</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <Building className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 51.667</div>
            <p className="text-xs text-muted-foreground">Por venda</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Busca */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Cliente, CPF ou colaborador..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label>Período</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hoje">Hoje</SelectItem>
                  <SelectItem value="semana">Esta semana</SelectItem>
                  <SelectItem value="mes">Este mês</SelectItem>
                  <SelectItem value="trimestre">Este trimestre</SelectItem>
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
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="concluida">Concluída</SelectItem>
                  <SelectItem value="processando">Processando</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Vendas */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Lista de Vendas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Colaborador</TableHead>
                <TableHead>Banco</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendas.map((venda) => (
                <TableRow key={venda.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{venda.cliente}</p>
                      <p className="text-sm text-muted-foreground">{venda.cpf}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">R$ {venda.valor.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{venda.formaPagamento}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{venda.colaborador}</p>
                      <p className="text-sm text-muted-foreground">Sup: {venda.supervisor}</p>
                    </div>
                  </TableCell>
                  <TableCell>{venda.banco}</TableCell>
                  <TableCell>{new Date(venda.dataVenda).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(venda.status)}>
                      {venda.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}