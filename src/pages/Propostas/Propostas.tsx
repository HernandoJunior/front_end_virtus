import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Calendar,
  DollarSign,
  User,
  Upload,
  Download
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/services/api";
import { Link, useNavigate } from "react-router-dom";

// Mock data
const mockPropostas = [
  {
    id: 1,
    cliente: "João Silva Santos",
    cpf: "123.456.789-01",
    valor: "R$ 85.000,00",
    prazo: "84 meses",
    banco: "Banco do Brasil",
    colaborador: "Maria Santos",
    supervisor: "Carlos Lima",
    status: "Em Análise",
    dataCriacao: "2024-01-15",
    dataVencimento: "2024-01-25"
  },
  {
    id: 2,
    cliente: "Ana Paula Costa",
    cpf: "987.654.321-09",
    valor: "R$ 120.000,00",
    prazo: "96 meses",
    banco: "Caixa Econômica",
    colaborador: "João Silva",
    supervisor: "Roberto Santos",
    status: "Aprovada",
    dataCriacao: "2024-01-14",
    dataVencimento: "2024-01-24"
  },
  {
    id: 3,
    cliente: "Roberto Oliveira",
    cpf: "456.789.123-45",
    valor: "R$ 45.000,00",
    prazo: "60 meses",
    banco: "Bradesco",
    colaborador: "Ana Costa",
    supervisor: "Carlos Lima",
    status: "Recusada",
    dataCriacao: "2024-01-13",
    dataVencimento: "2024-01-23"
  },
  {
    id: 4,
    cliente: "Mariana Souza",
    cpf: "789.123.456-78",
    valor: "R$ 95.000,00",
    prazo: "72 meses",
    banco: "Itaú",
    colaborador: "Pedro Lima",
    supervisor: "Roberto Santos",
    status: "Em Análise",
    dataCriacao: "2024-01-16",
    dataVencimento: "2024-01-26"
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "ANALISE":
      return <Clock className="h-4 w-4" />;
    case "CONCLUIDA":
      return <CheckCircle className="h-4 w-4" />;
    case "RECUSADA":
      return <XCircle className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case "ANALISE":
      return "secondary";
    case "CONCLUIDA":
      return "default";
    case "RECUSADA":
      return "destructive";
    default:
      return "secondary";
  }
};

export default function Propostas() {
  const navigate = useNavigate()

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("todos");

  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [colaborators, setColaborators] = useState([]);

  const [listPropostas, setListPropostas] = useState([])

  let [propostasAnalise, setPropostasAnalise] = useState(0)
  let [propostasConcluidas, setPropostasConcluidas] = useState(0)
  let [propostasRecusadas, setpropostasRecusadas] = useState(0)

  const [formData, setFormData] = useState({
    ID_COLABORADOR: "",
    banco: "",
    cpfCliente: "",
    role: "",
    parcela_utilizada: "",
    prazo: "",
    valor_liberado: "",
    valor_limite: "",
    dataProposta: new Date()
  })

  const handleChange = (e) => {
      const {id, value} = e.target;
      let finalValue = value;

      if(id === "ID_COLABORADOR"){
        finalValue = value === '' ? '' : parseInt(value, 10)
      }

      setFormData(prevState => ({
        ...prevState,
        [id]: value
      }))
  }

  useEffect(() => {
    async function searchPropostas() {
      try {
        const response = await api.get("/proposta/listprop")
        setListPropostas(response.data)
        console.log(response.data)
      } catch (error) {
        alert("Nao foi possivel buscar as propostas");
      }      
    }

    fetchColaboradores(),
    searchPropostas()
    console.log(listPropostas)

  }, []);

  const filteredPropostas = listPropostas.filter(proposta => {
    const matchesSearch = proposta.clientes.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proposta.cpfCliente.includes(searchTerm) ||
                         proposta.banco.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === "todos" || 
                         proposta.role.replace(" ", "_") === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  async function cadastrarProposta() {
    try {
      console.log(formData)
      const response = await api.post("/proposta/criar", formData)
      alert("Proposta cadastrada com sucesso!")
      navigate("/propostas")
    } catch (error) {
      alert("Nao foi possivel fazer o cadastro da proposta!")
      console.log(error)
    }
  }

  async function fetchColaboradores() {
      try {
        const response = await api.get("/colaborador/listarcol");
        setColaborators(response.data || []);
      } catch (error) {
        console.error("Erro ao buscar colaboradores:", error);
      }
  }

  listPropostas.map((proposta) => { 
    if(proposta.role.includes('ANALISE')){
      propostasAnalise += 1
    } else if (proposta.role.includes('RECUSADA')){ propostasRecusadas += 1}
    else {
      propostasConcluidas += 1
    }
  })

  const formatarCPF = (cpf) => {
  if (!cpf) return '';
  // Remove qualquer caractere que não seja dígito
  const cpfApenasNumeros = cpf.toString().replace(/\D/g, '');
  // Aplica a máscara
  return cpfApenasNumeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};
  


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Propostas</h1>
          <p className="text-muted-foreground">
            Gerencie o ciclo completo de propostas
          </p>
        </div>
          
          <div className="flex items-center gap-2">

            {/* CADASTRO DE NOVA PROPOSTA */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Proposta
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Registrar Nova Proposta</DialogTitle>
                  <DialogDescription>
                    Registre uma nova proposta no sistema
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <Label htmlFor="cpfCliente">CPF Cliente</Label>
                  <Input id="cpfCliente" type="number" placeholder="28298724377" onChange={handleChange}/>

                  <div>
                    <Label htmlFor="parcela_utilizada">Parcela Utilizada (R$)</Label>
                    <Input id="parcela_utilizada" type="number" placeholder="200.10" onChange={handleChange}/>
                  </div>

                  <div>
                    <Label htmlFor="valor_liberado">Valor Liberado (R$)</Label>
                    <Input id="valor_liberado" type="number" placeholder="300.89" onChange={handleChange}/>
                  </div>

                  <div>
                    <Label htmlFor="prazo">Prazo</Label>
                    <Select onValueChange={(value) => setFormData( prevState => ({...prevState, prazo : value}))}>
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
                    <Label htmlFor="valor_limite">Valor Limite</Label>
                    <Input id="valor_limite" type="number" placeholder="2000.43" onChange={handleChange}/>
                  </div>

                  <div>
                    <Label htmlFor="dataProposta">Data da Proposta</Label>
                    <Input id="dataProposta" type="date" placeholder="" onChange={handleChange}/>
                  </div>

                  <div>
                    <Label htmlFor="role">Status</Label>
                    <Select onValueChange={(value) => setFormData( prevState => ({...prevState, role : value}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Status da Proposta" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RECUSADA">Recusada</SelectItem>
                        <SelectItem value="ANALISE">Em Análise</SelectItem>
                        <SelectItem value="CONCLUIDA">Concluída</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="ID_COLABORADOR">Colaborador</Label>
                    <Select onValueChange={(value) => setFormData(prevState => ({...prevState, ID_COLABORADOR: value}))}>
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
                    <Select onValueChange={(value) => setFormData(prevState => ({...prevState, banco : value}))}>
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

                  <div className="flex gap-2 pt-4">
                    <Button onClick={() => cadastrarProposta()} className="flex-1">
                      Registrar Proposta
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

      {/* Status Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{listPropostas.length}</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Em Análise</p>
                <p className="text-2xl font-bold text-warning">{propostasAnalise}</p>
              </div>
              <Clock className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Aprovadas</p>
                <p className="text-2xl font-bold text-success">{propostasConcluidas}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Recusadas</p>
                <p className="text-2xl font-bold text-destructive">{propostasRecusadas}</p>
              </div>
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por cliente, CPF ou banco..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={selectedStatus === "todos" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus("todos")}
              >
                Todos
              </Button>
              <Button
                variant={selectedStatus === "ANALISE" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus("ANALISE")}
              >
                Em Análise
              </Button>
              <Button
                variant={selectedStatus === "CONCLUIDA" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus("CONCLUIDA")}
              >
                Aprovadas
              </Button>
              <Button
                variant={selectedStatus === "RECUSADA" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus("RECUSADA")}
              >
                Recusadas
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Propostas List */}
      <div className="space-y-4">
        {filteredPropostas.map((proposta) => (
          <Card key={proposta.ID_PROPOSTA} className="shadow-card hover:shadow-lg transition-smooth">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{proposta.clientes}</h3>
                    <Badge variant={getStatusVariant(proposta.role)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(proposta.role)}
                        {proposta.role}
                      </div>
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{formatarCPF(proposta.cpfCliente)}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposta.valor_liberado)}
                  </p>
                  <p className="text-sm text-muted-foreground">{proposta.prazo}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Banco</p>
                    <p className="text-sm font-medium">{proposta.banco.toUpperCase()}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Colaborador</p>
                    <p className="text-sm font-medium">{proposta.colaborador1}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Supervisor</p>
                    <p className="text-sm font-medium">{proposta.supervisor1}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Vencimento</p>
                    <p className="text-sm font-medium">{proposta.dataProposta ? proposta.dataProposta : "Nao Cadastrado"}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <span>
                  Criado em {proposta.dataProposta}
                </span>
                <div className="flex gap-2">
                  <Link to={`/proposta/${proposta.ID_PROPOSTA}`}>
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>
                  </Link>
                  {proposta.status === "Aprovada" && (
                    <Button size="sm">
                      Converter em Venda
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredPropostas.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="py-12">
            <div className="text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma proposta encontrada</h3>
              <p className="text-muted-foreground mb-4">
                Tente ajustar os filtros ou criar uma nova proposta
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Proposta
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
  </div>
  );
}
