import { useEffect, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Search, Plus, Filter, Edit, Upload, Loader2 
} from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { api } from "@/services/api";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export default function Clientes() {
  // Estados para modais e dialogs
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
  const [displayLimit, setDisplayLimit] = useState(50);
  
  // Funções de busca de dados (sem alterações)
  useEffect(() => {
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
  
      fetchColaborators();
      fetchclient();
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
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
      // Opcional: recarregar a lista de clientes após o upload
      // fetchclient(); 
    } catch (error) {
      alert("Erro ao importar arquivo!");
      console.error("Detalhes do erro:", error);
    } finally {
      setIsLoading(false)
    }
  }

  const clientsToDisplay = useMemo(() => {
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

    if (sortBy === 'alphabetical') {
      processedClients.sort((a, b) => {
        const nameA = a.nome || ''; 
        const nameB = b.nome || ''; 
        return nameA.localeCompare(nameB);
      });
    }

    if (displayLimit !== 'all') {
      return processedClients.slice(0, Number(displayLimit));
    }

    return processedClients;
  }, [listclient, searchTerm, statusFilter, sortBy, displayLimit]);

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("todos");
    setSortBy("default");
    setDisplayLimit(50);
    setIsFilterOpen(false);
  };


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

            {/* Botão de Novo Cliente */}
            <Button onClick={() => navigate('/clientes/novo')}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Cliente
            </Button>
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
                  Filtros e Ordenação
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Opções de Exibição</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label>Filtrar por Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger><SelectValue/></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="ativo">Somente Ativos</SelectItem>
                        <SelectItem value="inativo">Somente Inativos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Ordenar por</Label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger><SelectValue/></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Padrão</SelectItem>
                        <SelectItem value="alphabetical">Ordem Alfabética (A-Z)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Exibir por página</Label>
                    <Select
                      value={String(displayLimit)}
                      onValueChange={(val) => setDisplayLimit(val === 'all' ? 'all' : Number(val))}
                    >
                      <SelectTrigger><SelectValue/></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="50">50 clientes</SelectItem>
                        <SelectItem value="100">100 clientes</SelectItem>
                        <SelectItem value="all">Todos os clientes</SelectItem>
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
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Exibindo {clientsToDisplay.length} de {listclient.length} clientes.
        </span>
      </div>

      {/* Clients Table */}
      <Card className="shadow-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
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
                  <TableCell className="font-medium">{cliente.nomeColaborador}</TableCell>
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Empty State */}
      {clientsToDisplay.length === 0 && (
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