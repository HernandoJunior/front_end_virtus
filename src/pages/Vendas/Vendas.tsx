import { useEffect, useState } from "react";
import { formatCurrency } from "@/utils/formatter";
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
  Trash2,
  Loader2,
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
  TableFooter, // Importação do TableFooter
} from "@/components/ui/table";
import { api } from "@/services/api";
import { Link, useNavigate } from "react-router-dom";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { AlertTitle } from "@/components/ui/alert";

export default function Vendas() {
  const [vendas, setVenda] = useState({
    ID_COLABORADOR: "",
    ID_SUPERVISOR: "",
    cpfCliente: "",
    valorLiberado: "",
    comissaoColaborador: "",
    comissaoEmpresa: "",
    taxa: "",
    cidadeVenda: "",
    promotora: "",
    dataPagamento: "",
    linha_venda: "",
    prazo: "",
    banco: "",
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Estados dos dados e da UI
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const navigate = useNavigate();

  // Estados centralizados para filtros e ordenação
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [sortBy, setSortBy] = useState("default");
  const [displayLimit, setDisplayLimit] = useState(20);
  const doc = new jsPDF();

  const [listVendas, setListVendas] = useState([]);
  const [saleTotal, setSaleTotal] = useState({
    valorTotalVendas: 0,
    totalVendasMesAtual: 0,
    variacaoPercentual: 0,
    quantidadeTotal: 0,
    comissaoTotal: 0,
    ticketMedio: 0,
  });

  // Novos estados para os filtros
  const [colaboradorFilter, setColaboradorFilter] = useState("todos");
  const [dataInicialFilter, setDataInicialFilter] = useState("");
  const [dataFinalFilter, setDataFinalFilter] = useState("");
  const [statusVendaFilter, setStatusVendaFilter] = useState("todos");

  // Estado para armazenar os totais calculados com base nos filtros
  const [filteredSaleTotals, setFilteredSaleTotals] = useState({
    valorTotalVendas: 0,
    quantidadeTotal: 0,
    comissaoTotal: 0,
    ticketMedio: 0,
  });

  //Estado para armazenar lista de colaboradores
  const [colaborators, setColaborators] = useState([]);
  //Estado para armazenar lista de supervisores
  const [supervisors, setSupervisors] = useState([]);
  const [exportType, setExportType] = useState(""); // pdf ou excel

  // Exporta PDF
  const downloadPDF = () => {
    // Escolhe a lista a ser exportada: filtrada se existir, senão a lista completa
    const dataToExport = filteredSales.length > 0 ? filteredSales : listVendas;

    const doc = new jsPDF({
      orientation: "landscape", // 🔑 A4 na horizontal
      unit: "mm",
      format: "a4",
    });
    autoTable(doc, {
      head: [
        [
          "ID",
          "Banco",
          "Linha",
          "Agente",
          "Cidade",
          "Valor Liberado",
          "Prazo",
          "Taxa",
          "Comissao Empresa",
          "Comissao Agente",
          "Promotora",
          "Data Pagamento",
          "Cliente",
          "CPF",
        ],
      ],
      body: dataToExport.map((c) => [
        c.ID_VENDA,
        c.banco,
        c.linha,
        c.nomeColaborador,
        c.cidadeVenda,
        c.valorLiberado,
        c.prazo,
        c.taxa,
        c.comissaoEmpresa,
        c.comissaoColaborador,
        c.promotora,
        c.dataPagamento,
        c.cliente.nome,
        c.cliente.cpf,
      ]),
      headStyles: {
        minCellHeight: 15,
        fontSize: 9,
        halign: "center",
        valign: "middle",
      },
    });

    doc.save("vendas.pdf");
  };

  const downloadExcel = () => {
    // Escolhe a lista a ser exportada: filtrada se existir, senão a lista completa
    const dataToExport = filteredSales.length > 0 ? filteredSales : listVendas;
    
    // Define cabeçalho igual ao PDF
    const header = [
      "ID",
      "Banco",
      "Linha",
      "Agente",
      "Cidade",
      "Valor Liberado",
      "Prazo",
      "Taxa",
      "Comissao Empresa",
      "Comissao Agente",
      "Promotora",
      "Data Pagamento",
      "Cliente",
      "CPF",
    ];

    // Converte os dados para formato de array (mantendo ordem das colunas)
    const data = dataToExport.map((c) => [
      c.ID_VENDA,
      c.banco,
      c.linha,
      c.nomeColaborador,
      c.cidadeVenda,
      c.valorLiberado,
      c.prazo,
      c.taxa,
      c.comissaoEmpresa,
      c.comissaoColaborador,
      c.promotora,
      c.dataPagamento,
      c.cliente.nome,
      c.cliente.cpf,
    ]);

    // Cria a planilha com cabeçalho + dados
    const worksheet = XLSX.utils.aoa_to_sheet([header, ...data]);

    // Ajusta largura das colunas
    worksheet["!cols"] = [
      { wch: 10 }, // ID
      { wch: 15 }, // Banco
      { wch: 15 }, // Linha
      { wch: 20 }, // Agente
      { wch: 20 }, // Cidade
      { wch: 18 }, // Valor Liberado
      { wch: 10 }, // Prazo
      { wch: 10 }, // Taxa
      { wch: 20 }, // Comissão Empresa
      { wch: 20 }, // Comissão Agente
      { wch: 18 }, // Promotora
      { wch: 20 }, // Data Pagamento
      { wch: 25 }, // Cliente
      { wch: 18 }, // CPF
    ];

    // Deixa o cabeçalho em negrito
    header.forEach((h, i) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: i }); // linha 0 = cabeçalho
      if (!worksheet[cellAddress].s) worksheet[cellAddress].s = {};
      worksheet[cellAddress].s = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "4472C4" } }, // fundo azul
        alignment: { horizontal: "center", vertical: "center" },
      };
    });

    // Cria o arquivo
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
    setIsLoading(true);
    formData.append("file", selectedFile);

    try {
      const response = await api.post("/vendas/upload", formData, {});
      alert("Arquivo enviado com sucesso!");
      setIsImportOpen(false);
      // Opcional: recarregar a lista de clientes após o upload
      // fetchclient();
    } catch (error) {
      alert("Erro ao importar arquivo!");
      console.error("Detalhes do erro:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

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

  async function fetchVendas(filters = {}) {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/vendas/listarven?${params}`);
      setListVendas(response.data);
    } catch (error) {
      console.log(error);
      alert("Erro ao carregar vendas");
    }
  }

  // Função de busca principal que junta todos os filtros
  const handleSearch = () => {
    const filters = {
      q: searchTerm,
      colaboradorId: colaboradorFilter !== "todos" ? colaboradorFilter : "",
      dataInicial: dataInicialFilter,
      dataFinal: dataFinalFilter,
      status: statusVendaFilter !== "todos" ? statusVendaFilter : "",
    };
    fetchVendas(filters);
  };

  // Buscar colaboradores, supervisores e vendas
  useEffect(() => {
    fetchColaborators();
    fetchSupervisors();
    fetchVendas();
  }, []);

  // UseEffect para chamar a busca toda vez que um filtro muda
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch();
    }, 500); // Debounce de 500ms para evitar requisições a cada tecla digitada
    return () => clearTimeout(timeoutId);
  }, [
    searchTerm,
    colaboradorFilter,
    dataInicialFilter,
    dataFinalFilter,
    statusVendaFilter,
  ]);

  //Definicao de cor do Status da venda
  const getStatusColor = (status) => {
    switch (status) {
      case "Concluido":
        return "bg-success text-success-foreground";
      case "Processando":
        return "bg-warning text-warning-foreground";
      case "Inativa":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  //Salvando informacoes do formulario de cadastro de vendas
  const handleChangeForm = (e) => {
    const { id, value } = e.target;

    let finalValue = value;

    if (id === "valorLiberado") {
      finalValue = value === "" ? "" : parseInt(value);
    } else if (id === "comissaoColaborador") {
      finalValue = value === "" ? "" : parseFloat(value);
    } else if (id === "comissaoEmpresa") {
      finalValue = value === "" ? "" : parseFloat(value);
    } else if (id === "taxa") {
      finalValue = value === "" ? "" : parseFloat(value);
    }

    setVenda((prevState) => ({
      ...prevState, // Copia todos os valores antigos do estado
      [id]: value, // Atualiza apenas o campo que mudou
    }));
  };

  //Cadastro de vendas
  async function cadastrarVenda() {
    if (
      !vendas.ID_COLABORADOR ||
      !vendas.ID_SUPERVISOR ||
      !vendas.cpfCliente ||
      !vendas.valorLiberado ||
      !vendas.comissaoColaborador ||
      !vendas.comissaoEmpresa ||
      !vendas.taxa ||
      !vendas.cidadeVenda ||
      !vendas.promotora ||
      !vendas.dataPagamento ||
      !vendas.linha_venda ||
      !vendas.prazo ||
      !vendas.banco
    ) {
      return alert("Preencha todos os campos");
    }

    try {
      const req = await api.post("/vendas/cadastrarven", vendas);
      alert("Venda cadastrada com sucesso!");
      setIsDialogOpen(false);
      // navigate(-1)
    } catch (error) {
      alert("Erro ao cadastrar venda");
      console.log(error);
      console.log(vendas);
    }
  }

  //Lista de vendas realizadas
  useEffect(() => {
    async function listSales() {
      try {
        const req = await api.get("/vendas/mes");
        setSaleTotal(req.data);
      } catch (error) {
        console.log(error);
        alert("Nao foi possivel carregar as vendas do mes");
      }
    }
    listSales();
  }, []);

  async function deleteSale(sale) {
    if (!sale) {
      alert("Erro: Informações do usuário incompletas. Não é possível deletar.");
      return;
    }

    const isConfirmed = window.confirm(
      `Tem certeza que deseja excluir a venda "${sale.valorLiberado}"? Esta ação não pode ser desfeita.`
    );

    if (!isConfirmed) {
      return;
    }

    const idParaDeletar = sale.ID_VENDA;
    if (isNaN(idParaDeletar)) {
      alert(`Erro: A venda "${sale.valorLiberado}" nao possui um ID inválido.`);
      return;
    }

    try {
      const id_venda = parseInt(sale.ID_VENDA);
      const reponse = await api.delete(`/vendas/deleteVenda/${id_venda}`);
      alert("Venda deletada com sucesso!");
      fetchVendas();
    } catch (error) {
      alert("Erro ao deletar venda!");
      console.log(error);
    }
  }

  // Lógica de filtro no frontend
  const filteredSales = listVendas.filter((venda) => {
    const matchSearch =
      searchTerm === "" ||
      (venda.nomeCliente &&
        venda.nomeCliente.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (venda.cpfCliente && venda.cpfCliente.includes(searchTerm));

    const matchColaborador =
      colaboradorFilter === "todos" ||
      venda.ID_COLABORADOR == colaboradorFilter; // Use == para comparar number e string

    const matchStatus =
      statusVendaFilter === "todos" ||
      (venda.status &&
        venda.status.toLowerCase() === statusVendaFilter.toLowerCase());

    const matchDataInicial =
      dataInicialFilter === "" ||
      new Date(venda.dataPagamento) >= new Date(dataInicialFilter);

    const matchDataFinal =
      dataFinalFilter === "" ||
      new Date(venda.dataPagamento) <= new Date(dataFinalFilter);

    return (
      matchSearch &&
      matchColaborador &&
      matchStatus &&
      matchDataInicial &&
      matchDataFinal
    );
  });

  // useEffect para recalcular os KPIs sempre que filteredSales mudar
  useEffect(() => {
    const valorTotal = filteredSales.reduce(
      (acc, venda) => acc + (venda.valorLiberado || 0),
      0
    );
    const quantidadeTotal = filteredSales.length;
    const comissaoTotal = filteredSales.reduce(
      (acc, venda) =>
        acc + (venda.comissaoColaborador || 0) + (venda.comissaoEmpresa || 0),
      0
    );
    const ticketMedio = quantidadeTotal > 0 ? valorTotal / quantidadeTotal : 0;

    setFilteredSaleTotals({
      valorTotalVendas: valorTotal,
      quantidadeTotal: quantidadeTotal,
      comissaoTotal: comissaoTotal,
      ticketMedio: ticketMedio,
    });
  }, [filteredSales]);

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
          {/* IMPORTACAO CARD */}
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
                <Input type="file" onChange={handleFileChange} />
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleUpload}
                    disabled={isLoading || !selectedFile}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Enviando...
                      </>
                    ) : (
                      "Enviar Arquivo"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsImportOpen(false)}
                    disabled={isLoading}
                  >
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
                  <Select onValueChange={setExportType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o formato" />
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
                  <Label htmlFor="cpfCliente">CPF Cliente</Label>
                  <Input
                    id="cpfCliente"
                    type="number"
                    placeholder="02590899544"
                    onChange={handleChangeForm}
                  />
                </div>
                <div>
                  <Label htmlFor="valorLiberado">Valor da Venda (R$)</Label>
                  <Input
                    id="valorLiberado"
                    type="number"
                    placeholder="45000"
                    onChange={handleChangeForm}
                  />
                </div>
                <div>
                  <Label htmlFor="prazo">Prazo</Label>
                  <Select
                    onValueChange={(value) =>
                      setVenda((prevState) => ({ ...prevState, prazo: value }))
                    }
                  >
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
                  <Label htmlFor="promotora">Promotora</Label>
                  <Input
                    id="promotora"
                    type="text"
                    placeholder="BEVI"
                    onChange={handleChangeForm}
                  />
                </div>
                <div>
                  <Label htmlFor="comissaoEmpresa">
                    Comissao Empresa (R$)
                  </Label>
                  <Input
                    id="comissaoEmpresa"
                    type="number"
                    placeholder="300.57"
                    onChange={handleChangeForm}
                  />
                </div>
                <div>
                  <Label htmlFor="comissaoColaborador">
                    Comissao Colaborador (R$)
                  </Label>
                  <Input
                    id="comissaoColaborador"
                    type="number"
                    placeholder="100.69"
                    onChange={handleChangeForm}
                  />
                </div>
                <div>
                  <Label htmlFor="taxa">Taxa</Label>
                  <Input
                    id="taxa"
                    type="number"
                    placeholder="7.89"
                    onChange={handleChangeForm}
                  />
                </div>
                <div>
                  <Label htmlFor="cidadeVenda">Cidade</Label>
                  <Input
                    id="cidadeVenda"
                    type="text"
                    placeholder="Salvador"
                    onChange={handleChangeForm}
                  />
                </div>
                <div>
                  <Label htmlFor="ID_SUPERVISOR">Supervisor</Label>
                  <Select
                    onValueChange={(value) =>
                      setVenda((prevState) => ({
                        ...prevState,
                        ID_SUPERVISOR: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o supervisor" />
                    </SelectTrigger>
                    <SelectContent>
                      {supervisors.map((supervisor) => (
                        <SelectItem
                          key={supervisor.ID_SUPERVISOR}
                          value={supervisor.ID_SUPERVISOR}
                        >
                          {supervisor.ID_SUPERVISOR} - {supervisor.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="ID_COLABORADOR">Colaborador</Label>
                  <Select
                    onValueChange={(value) =>
                      setVenda((prevState) => ({
                        ...prevState,
                        ID_COLABORADOR: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o colaborador" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      {colaborators.map((colaborator) => (
                        <SelectItem
                          key={colaborator.ID_COLABORADOR}
                          value={colaborator.ID_COLABORADOR}
                        >
                          {colaborator.ID_COLABORADOR} - {colaborator.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="banco">Banco</Label>
                  <Select
                    onValueChange={(value) =>
                      setVenda((prevState) => ({ ...prevState, banco: value }))
                    }
                  >
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
                  <Label htmlFor="linha_venda">Linha</Label>
                  <Select
                    onValueChange={(value) =>
                      setVenda((prevState) => ({
                        ...prevState,
                        linha_venda: value,
                      }))
                    }
                  >
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
                  <Label htmlFor="dataPagamento">Data do Pagamento</Label>
                  <Input
                    id="dataPagamento"
                    type="date"
                    onChange={handleChangeForm}
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={() => cadastrarVenda()} className="flex-1">
                    Registrar Venda
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* KPIs de Vendas Totais */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vendas</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(saleTotal.valorTotalVendas)}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Qtd. Vendas</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {saleTotal.quantidadeTotal}
            </div>
            <p className="text-xs text-muted-foreground">Vendas realizadas</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comissões</CardTitle>
            <CreditCard className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(saleTotal.comissaoTotal)}
            </div>
            <p className="text-xs text-muted-foreground">Pagas/A pagar</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <Building className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(saleTotal.ticketMedio)}
            </div>
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
              <Label htmlFor="dataInicial">Data Inicial</Label>
              <Input
                type="date"
                id="dataInicial"
                value={dataInicialFilter}
                onChange={(e) => setDataInicialFilter(e.target.value)}
              />

              <Label htmlFor="dataFinal">Data final</Label>
              <Input
                type="date"
                id="dataFinal"
                value={dataFinalFilter}
                onChange={(e) => setDataFinalFilter(e.target.value)}
              />
            </div>
            <div>
              <Label>Colaborador</Label>
              <Select onValueChange={setColaboradorFilter} value={colaboradorFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  {colaborators.map((colaborador) => (
                    <SelectItem
                      key={colaborador.ID_COLABORADOR}
                      value={colaborador.ID_COLABORADOR}
                    >
                      {colaborador.ID_COLABORADOR} - {colaborador.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* <div>
              <Label>Status</Label>
              <Select onValueChange={setStatusVendaFilter} value={statusVendaFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="concluida">Concluída</SelectItem>
                  <SelectItem value="processando">Processando</SelectItem>
                  <SelectItem value="inativa">Inativa</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
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
              {filteredSales.map((venda) => (
                <TableRow key={venda.ID_VENDA}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{venda.nomeCliente}</p>
                      <p className="text-sm text-muted-foreground">
                        CPF: {venda.cpfCliente}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        R$ {venda.valorLiberado}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {venda.dataPagamento}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{venda.nomeColaborador}</p>
                      <p className="text-sm text-muted-foreground">
                        Supervisor: {venda.nomeSupervisor}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{venda.banco}</TableCell>
                  <TableCell>{venda.dataPagamento}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(venda.cliente?.status)}>
                      {venda.cliente?.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link to={`/vendas/${venda.ID_VENDA}`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" onClick={() => deleteSale(venda)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell className="font-semibold text-lg" colSpan={1}>
                  Totais
                </TableCell>
                <TableCell className="font-semibold text-lg text-left" colSpan={2}>
                  {formatCurrency(filteredSaleTotals.valorTotalVendas)}
                </TableCell>
                <TableCell className="font-semibold text-lg text-left">
                  {filteredSaleTotals.quantidadeTotal} vendas
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}