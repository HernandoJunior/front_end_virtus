import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

// IMPORTACAO DE UI
import { 
  Search, 
  Plus, 
  Filter, 
  Download,
  Upload,
  Phone,
  Mail,
  FileText
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
import { api } from "@/services/api";

// BIBLIOTECAS PARA EXPORTACAO E IMPORTACAO (PDF E EXCEL) 
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


// Mock data
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
    ultimaInteracao: "2024-01-15"
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
    ultimaInteracao: "2024-01-14"
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
    ultimaInteracao: "2024-01-10"
  }
];

export default function Clientes() {
  const [exportType, setExportType] = useState(""); // pdf ou excel
  const [quantity, setQuantity] = useState(""); // 50, 100, todos

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("todos");
  const [colaborators, setColaborators] = useState([]);
  const [client, setClient] = useState({
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    margem: "",
    idade: "",
    obito: "",
    ID_COLABORADOR: ""
  });
  const [listclient, setListclient] = useState([]);
  const navigate = useNavigate();

  // Exporta PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["ID", "Nome", "Email"]],
      body: listclient.map(c => [c.ID_CLIENTE, c.nome, c.email]),
    });
    doc.save("clientes.pdf");
  };

  // Exporta Excel
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(listclient);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clientes");
    XLSX.writeFile(workbook, "clientes.xlsx");
  };

  // Função geral
  const handleExport = () => {
    if (exportType === "pdf") {
      downloadPDF();
    } else if (exportType === "excel") {
      downloadExcel();
    }
  };

  useEffect(() => {
    // Função para buscar os clientes
    async function fetchclient() {
        try {
          const response = await api.get("/clientes/consulta");
          setListclient(response.data);
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
  
      fetchColaborators();
      fetchclient();
    }, []);

  async function createClient() {
      try {
        const response = api.post("/clientes/create", client)
        console.log(client)
        alert("Cliente cadastrado com sucesso")
        navigate(-1)
      } catch (error) {
        alert("Erro ao cadastrar cliente")
        console.log(client)
        console.log(error)
      }
  }

  const handleChange = (e) => {
  const { id, value } = e.target;

  let finalValue = value;
  if (id === 'idade') {
    finalValue = value === '' ? '' : parseInt(value, 10);
  } else if (id === 'margem') {
    finalValue = value === '' ? '' : parseFloat(value);
  }

  setClient(prevState => ({
    ...prevState, // Copia todos os valores antigos do estado
    [id]: value   // Atualiza apenas o campo que mudou
  }));
  };
  

  const filteredClientes = mockClientes.filter(cliente => {
    const matchesSearch = cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cliente.cpf.includes(searchTerm) ||
                         cliente.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === "todos" || 
                         cliente.status.toLowerCase() === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão de Clientes</h1>
          <p className="text-muted-foreground">
            Gerencie todos os clientes da Virtus Consultoria
          </p>
        </div>
        <div className="flex items-center gap-2">
          
          {/* CARD DE IMPORTACAO */}
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
                      <SelectItem value="govsp">Gov SP</SelectItem>
                      <SelectItem value="govba">Gov BA</SelectItem>
                      <SelectItem value="prefsp">Prefeitura SP</SelectItem>
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
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                      <SelectItem value="todos">Todos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1" onClick={downloadPDF}>
                    Importar
                  </Button>
                  <Button variant="outline" onClick={() => setIsImportOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          {/* CARD DE EXPORTACAO */}
          <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" onClick={() => setIsExportOpen}>
                <Upload className="h-4 w-4 mr-2" />
                  Exportar
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Exportacao do sistema</DialogTitle>
                <DialogDescription>
                  Extrair vendas do sistema
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select onValueChange={setExportType}>
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
                  <Select onValueChange={setQuantity}>
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
                  <Button className="flex-1" onClick={handleExport}>
                    Exportar
                  </Button>
                  <Button variant="outline" onClick={() => setIsExportOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>   

          {/* CARD DE NOVO CLIENTE */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Registrar Novo Cliente</DialogTitle>
                <DialogDescription>
                  Registre um novo cliente no sistema
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome</Label>
                  <Input id="nome" type="text" placeholder="Joao da silva" onChange={handleChange}/>
                </div>
                <div>
                  <Label htmlFor="cpf">CPF</Label>
                  <Input id="cpf" type="number" placeholder="34589182" onChange={handleChange}/>
                </div>
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input id="telefone" type="number" placeholder="71997415555" onChange={handleChange}/>
                </div>
                <div>
                  <Label htmlFor="margem">Margem</Label>
                  <Input id="margem" type="number" placeholder="45000" onChange={handleChange}/>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="cliente@email.com" onChange={handleChange}/>
                </div>
                <div>
                  <Label htmlFor="idade">Idade</Label>
                  <Input id="idade" type="number" placeholder="40"  onChange={handleChange}/>
                </div>
                <div>
                  <Label htmlFor="obito">Óbito</Label>
                  <Select onValueChange={(value) => setClient(prevState => ({...prevState, obito: value}))}>
                    <SelectTrigger >
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent >
                        <SelectItem value="nao">Nao</SelectItem>
                        <SelectItem value="sim">Sim</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="Colaborador">Colaborador</Label>
                  <Select onValueChange={(value) => setClient(prevState => ({...prevState, ID_COLABORADOR: value}))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o colaborador" />
                    </SelectTrigger>
                    <SelectContent >
                      {colaborators.map(colaborador => (
                        <SelectItem key={colaborador.ID_COLABORADOR} value={colaborador.ID_COLABORADOR}>
                          {colaborador.ID_COLABORADOR} - {colaborador.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={() => createClient()} className="flex-1">
                    Registrar Cliente
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

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, CPF ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={selectedFilter === "todos" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("todos")}
              >
                Todos
              </Button>
              <Button
                variant={selectedFilter === "ativo" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("ativo")}
              >
                Ativos
              </Button>
              <Button
                variant={selectedFilter === "inativo" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("inativo")}
              >
                Inativos
              </Button>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {listclient.length} clientes encontrados
        </span>
      </div>

      {/* client Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {listclient.map((cliente) => (
          <Card key={cliente.ID_CLIENTE} className="shadow-card hover:shadow-lg transition-smooth cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">{cliente.nome}</CardTitle>
                  <p className="text-sm text-muted-foreground">{cliente.cpf}</p>
                </div>
                <Badge variant={cliente.status === "Ativo" ? "default" : "secondary"}>
                  {cliente.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{cliente.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{cliente.telefone}</span>
                </div>
              </div>
              
              <div className="pt-2 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground"></span>
                  <span className="font-medium">{cliente.convenio}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Margem:</span>
                  <span className="font-bold text-success">{cliente.margem}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Responsável:</span>
                  <span className="font-medium">{cliente.colaborador}</span>
                </div>
              </div>


              <div className="pt-3 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link to={`/clientes/${cliente.id}/propostas`}>
                    <FileText className="h-4 w-4 mr-1" />
                    Propostas
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link to={`/clientes/${cliente.id}`}>Ver Detalhes</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {listclient.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="py-12">
            <div className="text-center">
              <Search className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum cliente encontrado</h3>
              <p className="text-muted-foreground mb-4">
                Tente ajustar os filtros ou termos de busca
              </p>
              <Button variant="outline">
                Limpar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}