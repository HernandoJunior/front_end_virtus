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
  Download,
  Loader2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { formatCurrency } from "@/utils/formatter";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/services/api";
import { Link, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";


const getStatusIcon = (status) => {
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

const getStatusVariant = (status) => {
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
  const [dataInicialFilter, setDataInicialFilter] = useState("");
  const [dataFinalFilter, setDataFinalFilter] = useState("");

  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [colaborators, setColaborators] = useState([]);

  const [listPropostas, setListPropostas] = useState([])

  let [propostasAnalise, setPropostasAnalise] = useState(0)
  let [propostasConcluidas, setPropostasConcluidas] = useState(0)
  let [propostasRecusadas, setpropostasRecusadas] = useState(0)

  const [currentUser, setCurrentUser] = useState({ role: null, id: null });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [exportType, setExportType] = useState("");

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Efeito para buscar dados do usuário logado do localStorage
  useEffect(() => {
    const userDataString = localStorage.getItem('user');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setCurrentUser({ role: userData.role, id: userData.id });
    }
  }, []);
  
  const [formData, setFormData] = useState({
    ID_COLABORADOR: "",
    banco: "",
    cpfCliente: "",
    role: "",
    parcela_utilizada: "",
    prazo: "",
    valor_liberado: "",
    valor_limite: "",
    nomeCliente: "",
    dataProposta: ""
  })
  
  const downloadPDF = () => {
    const dataToExport = filteredPropostas;
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    autoTable(doc, {
      head: [
        [ "ID", "Banco", "Valor Liberado", "Nome do Cliente", "Data Proposta", "Status", "Contrato", "Tipo", "Numero da Proposta"],
      ],
      body: dataToExport.map((c) => [
        c.ID_PROPOSTA, c.banco, formatCurrency(c.valor_liberado), c.clientes, c.dataProposta, c.role, c.tipoProposta, c.contrato, c.numeroProposta, 
      ]),
      headStyles: { minCellHeight: 15, fontSize: 9, halign: "center", valign: "middle" },
    });
    doc.save("propostas.pdf");
  };

  const downloadExcel = () => {
    const dataToExport = filteredPropostas;
    const header = [ "ID", "Banco", "Valor Liberado", "ID_CLIENTE", "Data Proposta", "Data Pagamento", "Contrato", "Tipo", "Numero da Proposta"];
    const data = dataToExport.map((c) => [
         c.ID_PROPOSTA, c.banco, formatCurrency(c.valorLiberado), c.ID_CLIENTE, c.data_proposta, c.data_pagamento, c.contrato, c.numero_proposta, 
    ]);
    const worksheet = XLSX.utils.aoa_to_sheet([header, ...data]);
    worksheet["!cols"] = [
      { wch: 10 }, { wch: 15 }, { wch: 15 }, { wch: 20 }, { wch: 20 }, { wch: 18 }, { wch: 10 }, { wch: 10 }, { wch: 20 }, { wch: 20 }, { wch: 18 }, { wch: 20 }, { wch: 25 }, { wch: 18 },
    ];
    header.forEach((h, i) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: i });
      if (!worksheet[cellAddress].s) worksheet[cellAddress].s = {};
      worksheet[cellAddress].s = {
        font: { bold: true, color: { rgb: "FFFFFF" } }, fill: { fgColor: { rgb: "4472C4" } }, alignment: { horizontal: "center", vertical: "center" },
      };
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Vendas");
    XLSX.writeFile(workbook, "propostas.xlsx");
  };

  const handleExport = () => { if (exportType === "pdf") downloadPDF(); else if (exportType === "excel") downloadExcel(); };

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

  const handleFileChange = (event) => setSelectedFile(event.target.files[0]);

  async function handleUpload() {
    if (!selectedFile) return alert("Por favor, selecione um arquivo para importar.");
    const formData = new FormData();
    setIsLoading(true);
    formData.append("file", selectedFile);
    try {
      await api.post("/proposta/importarPropostas", formData);
      alert("Arquivo enviado com sucesso!");
      setIsImportOpen(false);
      
      // Recarrega os dados para exibir a planilha importada
      const response = await api.get("/proposta/listprop");
      setListPropostas(response.data);
    } catch (error) {
      alert("Erro ao importar arquivo!");
      console.error("Detalhes do erro:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    async function searchPropostas() {
      try {
        const response = await api.get("/proposta/listprop")
        setListPropostas(response.data)
        
      } catch (error) {
        alert("Nao foi possivel buscar as propostas");
      }       
    }

    fetchColaboradores(),
    searchPropostas()
    

  }, []);

  const filteredPropostas = listPropostas.filter(proposta => {
    const matchesSearch = proposta.clientes.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          proposta.cpfCliente.includes(searchTerm) ||
                          proposta.banco.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === "todos" || 
                          proposta.role.replace(" ", "_") === selectedStatus;
    
    // Filtros de data
    const matchDataInicial =
      !dataInicialFilter ||
      new Date(proposta.dataProposta).setHours(0, 0, 0, 0) >=
        new Date(dataInicialFilter).setHours(0, 0, 0, 0);
    
    const matchDataFinal =
      !dataFinalFilter ||
      new Date(proposta.dataProposta).setHours(0, 0, 0, 0) <=
        new Date(dataFinalFilter).setHours(0, 0, 0, 0);
    
    return matchesSearch && matchesStatus && matchDataInicial && matchDataFinal;
  });

  // Lógica de paginação
  const totalPages = Math.ceil(filteredPropostas.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPropostas = filteredPropostas.slice(indexOfFirstItem, indexOfLastItem);

  // Reset para página 1 quando filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus, dataInicialFilter, dataFinalFilter, filteredPropostas.length]);

  // Funções de navegação
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Gerar números de página para exibição
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  async function cadastrarProposta() {
    try {
      const response = await api.post("/proposta/criar", formData)
      alert("Proposta cadastrada com sucesso!")
      navigate("/propostas")
    } catch (error) {
      alert("Nao foi possivel fazer o cadastro da proposta!")
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
    const cpfApenasNumeros = cpf.toString().replace(/\D/g, '');
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
            {/* IMPORTACAO */}
            <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
                <DialogTrigger asChild><Button variant="outline" size="sm"><Upload className="h-4 w-4 mr-2" /> Importar</Button></DialogTrigger>
                <DialogContent>
                    <DialogHeader><DialogTitle>Importação de Propostas</DialogTitle></DialogHeader>
                    <div className="space-y-4">
                        <Input type="file" onChange={handleFileChange} />
                        <div className="flex gap-2 pt-4">
                            <Button onClick={handleUpload} disabled={isLoading || !selectedFile}>{isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...</> : "Enviar Arquivo"}</Button>
                            <Button variant="outline" onClick={() => setIsImportOpen(false)} disabled={isLoading}>Cancelar</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* EXPORTACAO */}
            <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
                <DialogTrigger asChild><Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" /> Exportar</Button></DialogTrigger>
                <DialogContent>
                    <DialogHeader><DialogTitle>Exportação de Propostas</DialogTitle></DialogHeader>
                    <div className="space-y-4">
                        <Label htmlFor="tipo">Formato</Label>
                        <Select onValueChange={setExportType}><SelectTrigger><SelectValue placeholder="Selecione o formato" /></SelectTrigger><SelectContent><SelectItem value="pdf">PDF</SelectItem><SelectItem value="excel">Excel</SelectItem></SelectContent></Select>
                        <div className="flex gap-2 pt-4">
                            <Button className="flex-1" onClick={handleExport}>Exportar</Button>
                            <Button variant="outline" onClick={() => setIsExportOpen(false)}>Cancelar</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            
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
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cpfCliente">CPF Cliente</Label>
                    <Input id="cpfCliente" type="number" placeholder="28298724377" onChange={handleChange}/>
                  </div>
                  
                  <div>
                    <Label htmlFor="nomeCliente">Nome Cliente</Label>
                    <Input id="nomeCliente" type="text" placeholder="Nome do Cliente" onChange={handleChange}/>
                  </div>

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
                <p className="text-2xl font-bold">{filteredPropostas.length}</p>
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
          <div className="space-y-4">
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
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="dataInicial">Data Inicial</Label>
                <Input
                  type="date"
                  id="dataInicial"
                  value={dataInicialFilter}
                  onChange={(e) => setDataInicialFilter(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="dataFinal">Data Final</Label>
                <Input
                  type="date"
                  id="dataFinal"
                  value={dataFinalFilter}
                  onChange={(e) => setDataFinalFilter(e.target.value)}
                />
              </div>
              <div>
                <Label>Itens por página</Label>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => setItemsPerPage(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
        {currentPropostas.map((proposta) => (
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
                    <p className="text-xs text-muted-foreground">Data</p>
                    <p className="text-sm font-medium">{proposta.dataProposta ? proposta.dataProposta : "Não Cadastrado"}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t mt-4">
                <span className="text-sm text-muted-foreground">
                  Criado em {proposta.dataProposta}
                </span>
                <div className="flex gap-2">
                  <Link to={`/proposta/${proposta.ID_PROPOSTA}`}>
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Paginação */}
      {filteredPropostas.length > 0 && (
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredPropostas.length)} de {filteredPropostas.length} propostas
              </div>

              <div className="flex items-center gap-1">
                {/* Botão anterior */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Números de página */}
                {getPageNumbers().map((pageNumber) => (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(pageNumber)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNumber}
                  </Button>
                ))}

                {/* Botão próximo */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
              <Button onClick={() => setIsDialogOpen(true)}>
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