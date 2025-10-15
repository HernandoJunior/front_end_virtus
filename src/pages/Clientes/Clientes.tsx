import { useEffect, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Search, Plus, Filter, Edit, Upload, Loader2, 
  Trash2, ChevronLeft, ChevronRight, UserCog, X
} from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { api } from "@/services/api";

// BIBLIOTECAS PARA EXPORTACAO E IMPORTACAO (PDF E EXCEL)
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Clientes() {
  // Estados para modais e dialogs
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isReassignOpen, setIsReassignOpen] = useState(false);
  
  const [client, setClient] = useState({
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    margem: "",
    idade: "",
    obito: "",
    ID_COLABORADOR: "",
    status: null
  });
  const [exportType, setExportType] = useState(""); // pdf ou excel

  // Estados dos dados e da UI
  const [listclient, setListclient] = useState([]);
  const [colaborators, setColaborators] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  // Estados centralizados para filtros e ordenação
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [sortBy, setSortBy] = useState("default");
  
  // NOVOS FILTROS
  const [colaboradorFilter, setColaboradorFilter] = useState("todos");
  const [idadeMinFilter, setIdadeMinFilter] = useState("");
  const [idadeMaxFilter, setIdadeMaxFilter] = useState("");
  const [margemMinFilter, setMargemMinFilter] = useState("");
  const [margemMaxFilter, setMargemMaxFilter] = useState("");
  
  // Estados para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // ESTADOS PARA SELEÇÃO EM MASSA
  const [selectedClients, setSelectedClients] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [newColaboradorId, setNewColaboradorId] = useState("");

  //FUNCOES DE IMPORTACAO E EXPORTACAO
  const handleChange = (e) => {
    const { id, value } = e.target;

    let finalValue = value;

    if (id === 'idade') {
      finalValue = value === '' ? '' : parseInt(value, 10);
    } else if (id === 'margem') {
      finalValue = value === '' ? '' : parseFloat(value);
    }

    setClient(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  // Exporta PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["ID", "Nome", "Email", "Idade", "Telefone", "Status"]],
      body: listclient.map(c => [c.ID_CLIENTE, c.nome, c.email, c.idade, c.telefone, c.status ? "Ativo" : "Inativo"]),
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

  async function handleUpload() {
    if (!selectedFile) {
      alert("Por favor, selecione um arquivo para importar.");
      return;
    }
    const formData = new FormData();
    setIsLoading(true)
    formData.append('file', selectedFile);

    try {
      const response = await api.post("/clientes/upload", formData, {});
      alert("Arquivo enviado com sucesso!");
      setIsImportOpen(false);
      fetchclient(); 
    } catch (error) {
      alert("Erro ao importar arquivo!");
      console.error("Detalhes do erro:", error);
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  async function createClient() {
    try {
      const response = api.post("/clientes/create", client)
      console.log(client)
      alert("Cliente cadastrado com sucesso")
      navigate("/clientes")
    } catch (error) {
      alert("Erro ao cadastrar cliente")
      console.log(client)
      console.log(error)
    }
  }

  async function fetchclient() {
    try {
      const response = await api.get("/clientes/consulta");
      setListclient(response.data || []); 
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      setListclient([]);
    }
  }

  async function fetchColaborators() {
    try {
      const response = await api.get("/colaborador/listarcol");
      setColaborators(response.data || []);
    } catch (error) {
      console.error("Erro ao buscar colaboradores:", error);
    }
  }

  // Funções de busca de dados
  useEffect(() => {
    fetchColaborators();
    fetchclient();
  }, []);

  // FUNÇÃO PARA SELEÇÃO DE CLIENTES
  const handleSelectClient = (clientId) => {
    setSelectedClients(prev => {
      if (prev.includes(clientId)) {
        return prev.filter(id => id !== clientId);
      } else {
        return [...prev, clientId];
      }
    });
  };

  // FUNÇÃO PARA SELECIONAR TODOS
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedClients([]);
      setSelectAll(false);
    } else {
      const allIds = clientsToDisplay.map(c => c.ID_CLIENTE);
      setSelectedClients(allIds);
      setSelectAll(true);
    }
  };

  // FUNÇÃO PARA REATRIBUIR CLIENTES
  const handleReassignClients = async () => {
    if (selectedClients.length === 0) {
      alert("Selecione pelo menos um cliente");
      return;
    }
    
    if (!newColaboradorId) {
      alert("Selecione um colaborador");
      return;
    }

    setIsLoading(true);
    try {
      // Requisição para o backend
      await api.put("/clientes/reatribuir", {
        clienteIds: selectedClients,
        novoColaboradorId: newColaboradorId
      });
      
      alert(`${selectedClients.length} cliente(s) reatribuído(s) com sucesso!`);
      setSelectedClients([]);
      setSelectAll(false);
      setNewColaboradorId("");
      setIsReassignOpen(false);
      fetchclient(); // Atualiza a lista
    } catch (error) {
      alert("Erro ao reatribuir clientes!");
      console.error("Detalhes do erro:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Lógica de filtragem e ordenação COM NOVOS FILTROS
  const filteredClients = useMemo(() => {
    let processedClients = [...listclient];

    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      processedClients = processedClients.filter(client =>
        (client.nome && client.nome.toLowerCase().includes(searchTermLower)) ||
        (client.cpf && client.cpf.toLowerCase().includes(searchTermLower)) ||
        (client.email && client.email.toLowerCase().includes(searchTermLower))
      );
    }

    if (statusFilter !== "todos") {
      processedClients = processedClients.filter(client =>
        (statusFilter === "ativo" && client.status) ||
        (statusFilter === "inativo" && !client.status)
      );
    }

    // FILTRO POR COLABORADOR
    if (colaboradorFilter !== "todos") {
      if (colaboradorFilter === "sem_colaborador") {
        processedClients = processedClients.filter(client =>
          !client.colaborador || client.colaborador.ID_COLABORADOR === null || !client.colaborador.nome
        );
      } else {
        console.log("ELSE DO FILTRO COLABORADOR: ", colaboradorFilter)
        console.log(processedClients)
        processedClients = processedClients.filter(client =>
          client.colaborador.id_COLABORADOR === colaboradorFilter
        );
      }
    }

    // FILTRO POR IDADE
    if (idadeMinFilter) {
      processedClients = processedClients.filter(client =>
        client.idade >= parseInt(idadeMinFilter)
      );
    }
    if (idadeMaxFilter) {
      processedClients = processedClients.filter(client =>
        client.idade <= parseInt(idadeMaxFilter)
      );
    }

    // FILTRO POR MARGEM
    if (margemMinFilter) {
      processedClients = processedClients.filter(client =>
        parseFloat(client.margem) >= parseFloat(margemMinFilter)
      );
    }
    if (margemMaxFilter) {
      processedClients = processedClients.filter(client =>
        parseFloat(client.margem) <= parseFloat(margemMaxFilter)
      );
    }

    if (sortBy === 'alphabetical') {
      processedClients.sort((a, b) => {
        const nameA = a.nome || ''; 
        const nameB = b.nome || ''; 
        return nameA.localeCompare(nameB);
      });
    }

    return processedClients;
  }, [listclient, searchTerm, statusFilter, sortBy, colaboradorFilter, 
      idadeMinFilter, idadeMaxFilter, margemMinFilter, margemMaxFilter]);

  // Lógica de paginação
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const clientsToDisplay = filteredClients.slice(indexOfFirstItem, indexOfLastItem);

  // Reset para página 1 quando filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortBy, colaboradorFilter, 
      idadeMinFilter, idadeMaxFilter, margemMinFilter, margemMaxFilter]);

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

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("todos");
    setSortBy("default");
    setColaboradorFilter("todos");
    setIdadeMinFilter("");
    setIdadeMaxFilter("");
    setMargemMinFilter("");
    setMargemMaxFilter("");
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  // Contador de filtros ativos
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (statusFilter !== "todos") count++;
    if (colaboradorFilter !== "todos") count++;
    if (idadeMinFilter) count++;
    if (idadeMaxFilter) count++;
    if (margemMinFilter) count++;
    if (margemMaxFilter) count++;
    if (sortBy !== "default") count++;
    return count;
  }, [statusFilter, colaboradorFilter, idadeMinFilter, idadeMaxFilter, 
      margemMinFilter, margemMaxFilter, sortBy]);

  const deleteClient = async (client) => {
    if(!client){
      alert("Cliente nao identificado")
      return;
    }

    try {
      const response = await api.delete(`/clientes/deleteClient/${client.ID_CLIENTE}`)
      alert("Cliente deletado com sucesso!")
      fetchclient();
    } catch (error) {
      alert("Nao pode ser deletado cliente com vendas registradas!")
      console.log(error)
    }
  }

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

        {/* Botão de Importar */}
        <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" /> Importar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Importação para o sistema</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input type="file" onChange={handleFileChange}/>
                <div className="flex gap-2 pt-4">
                <Button onClick={handleUpload} disabled={isLoading || !selectedFile}>
                    {isLoading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...</>
                    ) : ( 'Enviar Arquivo' )}
                  </Button>
                  <Button variant="outline" onClick={() => setIsImportOpen(false)} disabled={isLoading}>
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
                <Input id="idade" type="number" placeholder="40" onChange={handleChange}/>
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
            
            {/* Botão de Filtros */}
            <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Filtros e Ordenação</DialogTitle>
                  <DialogDescription>
                    Configure os filtros para refinar sua busca
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="col-span-2">
                    <Label>Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger><SelectValue/></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="ativo">Somente Ativos</SelectItem>
                        <SelectItem value="inativo">Somente Inativos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-2">
                    <Label>Colaborador Responsável</Label>
                    <Select value={colaboradorFilter} onValueChange={setColaboradorFilter}>
                      <SelectTrigger><SelectValue placeholder="Todos os colaboradores"/></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="sem_colaborador">Sem Colaborador</SelectItem>
                        {colaborators.map(colaborador => (
                          <SelectItem key={colaborador.ID_COLABORADOR} value={colaborador.ID_COLABORADOR}>
                            {colaborador.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Idade Mínima</Label>
                    <Input 
                      type="number" 
                      placeholder="Ex: 18"
                      value={idadeMinFilter}
                      onChange={(e) => setIdadeMinFilter(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Idade Máxima</Label>
                    <Input 
                      type="number" 
                      placeholder="Ex: 65"
                      value={idadeMaxFilter}
                      onChange={(e) => setIdadeMaxFilter(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Margem Mínima (R$)</Label>
                    <Input 
                      type="number" 
                      placeholder="Ex: 10000"
                      value={margemMinFilter}
                      onChange={(e) => setMargemMinFilter(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Margem Máxima (R$)</Label>
                    <Input 
                      type="number" 
                      placeholder="Ex: 50000"
                      value={margemMaxFilter}
                      onChange={(e) => setMargemMaxFilter(e.target.value)}
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>Ordenar por</Label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger><SelectValue/></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Padrão</SelectItem>
                        <SelectItem value="alphabetical">Ordem Alfabética (A-Z)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={resetFilters}>Limpar Filtros</Button>
                    <Button onClick={() => setIsFilterOpen(false)}>Aplicar</Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* BOTÃO DE REATRIBUIÇÃO EM MASSA */}
            {selectedClients.length > 0 && (
              <Button variant="default" size="sm" onClick={() => setIsReassignOpen(true)}>
                <UserCog className="h-4 w-4 mr-2" />
                Reatribuir ({selectedClients.length})
              </Button>
            )}
          </div>

          {/* Tags de filtros ativos */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {statusFilter !== "todos" && (
                <Badge variant="secondary" className="gap-1">
                  Status: {statusFilter}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setStatusFilter("todos")} />
                </Badge>
              )}
              {colaboradorFilter !== "todos" && (
                <Badge variant="secondary" className="gap-1">
                  Colaborador: {colaborators.find(c => c.ID_COLABORADOR === colaboradorFilter)?.nome}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setColaboradorFilter("todos")} />
                </Badge>
              )}
              {idadeMinFilter && (
                <Badge variant="secondary" className="gap-1">
                  Idade min: {idadeMinFilter}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setIdadeMinFilter("")} />
                </Badge>
              )}
              {idadeMaxFilter && (
                <Badge variant="secondary" className="gap-1">
                  Idade max: {idadeMaxFilter}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setIdadeMaxFilter("")} />
                </Badge>
              )}
              {margemMinFilter && (
                <Badge variant="secondary" className="gap-1">
                  Margem min: R$ {margemMinFilter}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setMargemMinFilter("")} />
                </Badge>
              )}
              {margemMaxFilter && (
                <Badge variant="secondary" className="gap-1">
                  Margem max: R$ {margemMaxFilter}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setMargemMaxFilter("")} />
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* DIALOG DE REATRIBUIÇÃO */}
      <Dialog open={isReassignOpen} onOpenChange={setIsReassignOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reatribuir Clientes</DialogTitle>
            <DialogDescription>
              Selecione o novo colaborador responsável para {selectedClients.length} cliente(s) selecionado(s)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Novo Colaborador</Label>
              <Select value={newColaboradorId} onValueChange={setNewColaboradorId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o colaborador" />
                </SelectTrigger>
                <SelectContent>
                  {colaborators.map(colaborador => (
                    <SelectItem key={colaborador.ID_COLABORADOR} value={colaborador.ID_COLABORADOR.toString()}>
                      {colaborador.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsReassignOpen(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button onClick={handleReassignClients} disabled={isLoading || !newColaboradorId}>
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando...</>
              ) : (
                'Confirmar Reatribuição'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Exibindo {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredClients.length)} de {filteredClients.length} clientes
          {selectedClients.length > 0 && ` • ${selectedClients.length} selecionado(s)`}
        </span>
      </div>

      {/* Clients Table */}
      <Card className="shadow-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={selectAll}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Margem</TableHead>
                <TableHead>Idade</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientsToDisplay.map((cliente) => (
                <TableRow key={cliente.ID_CLIENTE}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedClients.includes(cliente.ID_CLIENTE)}
                      onCheckedChange={() => handleSelectClient(cliente.ID_CLIENTE)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{cliente.colaborador ? cliente.colaborador.nome : "Colaborador nao vinculado"}</TableCell>
                  <TableCell>{cliente.nome}</TableCell>
                  <TableCell>{cliente.cpf}</TableCell>
                  <TableCell className="font-bold text-success">{cliente.margem}</TableCell>
                  <TableCell>{cliente.idade ? `${cliente.idade} anos` : ""}</TableCell>
                  <TableCell>{cliente.telefone}</TableCell>
                  <TableCell>{cliente.email}</TableCell>
                  <TableCell className={`font-medium ${cliente.status ? 'text-green-500' : 'text-red-500'}`}>{cliente.status ? "Ativo" : "Inativo"}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                    <Link to={`/clientes/${cliente.ID_CLIENTE}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteClient(cliente)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Controles de Paginação */}
          {filteredClients.length > 0 && (
            <div className="flex items-center justify-between p-4 border-t">
              <div className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}
              </div>
              
              <div className="flex items-center gap-2">
                {/* Seletor de itens por página */}
                <div className="flex items-center gap-2 mr-4">
                  <Label htmlFor="itemsPerPage" className="text-sm text-muted-foreground">
                    Itens por página:
                  </Label>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => {
                      setItemsPerPage(Number(value));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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
          )}
        </CardContent>
      </Card>

      {/* Empty State */}
      {filteredClients.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="py-12">
            <div className="text-center">
              <Search className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum cliente encontrado</h3>
              <p className="text-muted-foreground mb-4">
                Tente ajustar os filtros ou termos de busca.
              </p>
              <Button variant="outline" onClick={resetFilters}>
                Limpar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}