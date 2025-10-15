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
  Download,
  Upload,
  Users,
  Building,
  CreditCard,
  Edit,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
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
  TableFooter,
} from "@/components/ui/table";
import { api } from "@/services/api";
import { Link } from "react-router-dom";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export default function Vendas() {
  const [vendaForm, setVendaForm] = useState({
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
    produtoVenda: "",
    nomeCliente: "",
  });

  // Estado para o usuário logado
  const [currentUser, setCurrentUser] = useState({ role: null, id: null });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [listVendas, setListVendas] = useState([]);
  const [saleTotal, setSaleTotal] = useState({
    maiorValorMes: 0,
    menorVenda: 0,
    valorComissaoColaboradorClt: 0,
    valorComissaoColaboradorMei: 0,
    valorComissaoEmpresa: 0,
    valorTotalMesAtual: 0,
    variacaoPercentual: 0,
    quantidadeTotal: 0,
    ticketMedio: 0,
  });

  // Filtros da UI
  const [colaboradorFilter, setColaboradorFilter] = useState("todos");
  const [dataInicialFilter, setDataInicialFilter] = useState("");
  const [dataFinalFilter, setDataFinalFilter] = useState("");
  
  // NOVOS FILTROS ADICIONADOS
  const [ordenacaoValor, setOrdenacaoValor] = useState(""); // "crescente", "decrescente", ""
  const [bancoFilter, setBancoFilter] = useState("todos");

  // Estados para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [colaborators, setColaborators] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [exportType, setExportType] = useState("");

  // Efeito para buscar dados do usuário logado do localStorage
  useEffect(() => {
    const userDataString = localStorage.getItem("@virtus:user");
    console.log(userDataString)
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setCurrentUser({ role: userData.role, id: userData.id });
    }
  }, []);

  // Efeito para buscar dados iniciais (vendas, colaboradores, supervisores, KPIs)
  useEffect(() => {
    const fetchUserVendas = async () => {
      try {
        const response = await api.get("/vendas/listarven");
        setListVendas(response.data);
      } catch (error) {
        console.error("Erro ao carregar vendas:", error);
        alert("Não foi possível carregar a lista de vendas.");
      }
    };

    const fetchTotalSalesKPI = async () => {
      if (["ADMIN", "SUPERVISOR"].includes(currentUser.role)) {
        try {
          const req = await api.get("/vendas/mes");
          setSaleTotal(req.data);
        } catch (error) {
          console.error(
            "Nao foi possivel carregar os totais de vendas:",
            error
          );
        }
      }
    };

    const fetchSelectOptions = async () => {
      try {
        const [colabRes, superRes] = await Promise.all([
          api.get("/colaborador/listarcol"),
          api.get("/supervisor/listarsupervisores"),
        ]);
        setColaborators(colabRes.data);
        setSupervisors(superRes.data);
      } catch (error) {
        console.error("Erro ao buscar colaboradores ou supervisores:", error);
      }
    };

    fetchUserVendas();
    fetchTotalSalesKPI();
    fetchSelectOptions();
  }, [currentUser]);

  // Extrair bancos únicos para o filtro (com tratamento para valores nulos/vazios)
  const bancosUnicos = [...new Set(listVendas
    .map(venda => venda.banco)
    .filter(banco => banco && banco.trim() !== "")
  )];

  // Lógica de filtragem e cálculo de totais NO FRONTEND
  const filteredSales = listVendas
    .filter((venda) => {
      const searchTermLower = searchTerm.toLowerCase();

      const matchSearch =
        searchTerm === "" ||
        (venda.nomeCliente &&
          venda.nomeCliente.toLowerCase().includes(searchTermLower)) ||
        (venda.cpfCliente && venda.cpfCliente.includes(searchTerm)) ||
        (venda.nomeColaborador &&
          venda.nomeColaborador.toLowerCase().includes(searchTermLower));

      const matchColaborador =
        colaboradorFilter === "todos" ||
        venda.ID_COLABORADOR == colaboradorFilter;

      // NOVO: Filtro por banco
      const matchBanco =
        bancoFilter === "todos" || venda.banco === bancoFilter;

      // Adiciona a lógica para ignorar o time da data, tratando apenas o dia
      const matchDataInicial =
        !dataInicialFilter ||
        new Date(venda.dataPagamento).setHours(0, 0, 0, 0) >=
          new Date(dataInicialFilter).setHours(0, 0, 0, 0);
      const matchDataFinal =
        !dataFinalFilter ||
        new Date(venda.dataPagamento).setHours(0, 0, 0, 0) <=
          new Date(dataFinalFilter).setHours(0, 0, 0, 0);

      // Se for USER, o filtro de colaborador não se aplica na UI, pois a lista da API já vem filtrada
      if (currentUser.role === "USER") {
        return matchSearch && matchDataInicial && matchDataFinal && matchBanco;
      }

      return (
        matchSearch && matchColaborador && matchDataInicial && matchDataFinal && matchBanco
      );
    })
    // NOVO: Ordenação por valor
    .sort((a, b) => {
      if (ordenacaoValor === "crescente") {
        return (a.valorLiberado || 0) - (b.valorLiberado || 0);
      } else if (ordenacaoValor === "decrescente") {
        return (b.valorLiberado || 0) - (a.valorLiberado || 0);
      }
      return 0; // Sem ordenação
    });

  // Lógica de paginação
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSales = filteredSales.slice(indexOfFirstItem, indexOfLastItem);

  // Reset para página 1 quando filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    colaboradorFilter,
    dataInicialFilter,
    dataFinalFilter,
    bancoFilter,
    ordenacaoValor,
    filteredSales.length,
  ]);

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

    // Ajustar startPage se endPage estiver no limite
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  const filteredSaleTotals = (() => {
    const valorTotal = filteredSales.reduce(
      (acc, v) => acc + (v.valorLiberado || 0),
      0
    );

    const maiorValor = filteredSales.reduce(
      (acc, v) => Math.max(acc, v.valorLiberado || 0),
      0
    );

    const menorValor = filteredSales.reduce(
      (acc, v) => {
        const valor = v.valorLiberado;
        return valor > 0 ? Math.min(acc, valor) : acc;
    }, Infinity);

    const quantidadeTotal = filteredSales.length;

    const comissaoEmpresa = filteredSales.reduce(
      (acc, v) => acc + (v.comissaoEmpresa || 0),
      0
    );

    let comissaoColaborador = filteredSales.reduce(
      (acc, v) => acc + (v.comissaoColaborador || 0),
      0
    );

    const comissaoColaboradorClt = comissaoColaborador * (27 / 100);

    const comissaoColaboradorMei = comissaoColaborador * (35 / 100);

    const ticketMedio = quantidadeTotal > 0 ? valorTotal / quantidadeTotal : 0;

    return {
      maiorValorMes: maiorValor,
      menorVenda: menorValor,
      valorTotalMesAtual: valorTotal,
      valorComissaoColaboradorClt: comissaoColaboradorClt,
      valorComissaoColaboradorMei: comissaoColaboradorMei,
      valorComissaoEmpresa: comissaoEmpresa,
      quantidadeTotal: quantidadeTotal,
      ticketMedio: ticketMedio,
    };
  })();

  const displayTotals = filteredSaleTotals;

  const downloadPDF = () => {
    const dataToExport = filteredSales;
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });
    autoTable(doc, {
      head: [
        [
          "ID",
          "Banco",
          "Linha",
          "Produto Venda",
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
        c.linha_venda,
        c.produtoVenda,
        c.nomeColaborador,
        c.cidadeVenda,
        formatCurrency(c.valorLiberado),
        c.prazo,
        `${c.taxa}%`,
        formatCurrency(c.comissaoEmpresa),
        formatCurrency(c.comissaoColaborador),
        c.promotora,
        c.dataPagamento,
        c.nomeCliente,
        c.cpfCliente,
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
    const dataToExport = filteredSales;
    const header = [
      "ID",
      "Banco",
      "Produto Venda",
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
    const data = dataToExport.map((c) => [
      c.ID_VENDA,
      c.banco,
      c.produtoVenda,
      c.linha_venda,
      c.nomeColaborador,
      c.cidadeVenda,
      c.valorLiberado,
      c.prazo,
      c.taxa,
      c.comissaoEmpresa,
      c.comissaoColaborador,
      c.promotora,
      c.dataPagamento,
      c.nomeCliente,
      c.cpfCliente,
    ]);
    const worksheet = XLSX.utils.aoa_to_sheet([header, ...data]);
    worksheet["!cols"] = [
      { wch: 10 },
      { wch: 15 },
      { wch: 15 },
      { wch: 20 },
      { wch: 20 },
      { wch: 18 },
      { wch: 10 },
      { wch: 10 },
      { wch: 20 },
      { wch: 20 },
      { wch: 18 },
      { wch: 20 },
      { wch: 25 },
      { wch: 18 },
    ];
    header.forEach((h, i) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: i });
      if (!worksheet[cellAddress].s) worksheet[cellAddress].s = {};
      worksheet[cellAddress].s = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "4472C4" } },
        alignment: { horizontal: "center", vertical: "center" },
      };
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Vendas");
    XLSX.writeFile(workbook, "vendas.xlsx");
  };

  const handleExport = () => {
    if (exportType === "pdf") downloadPDF();
    else if (exportType === "excel") downloadExcel();
  };

  async function handleUpload() {
    if (!selectedFile)
      return alert("Por favor, selecione um arquivo para importar.");
    const formData = new FormData();
    setIsLoading(true);
    formData.append("file", selectedFile);
    try {
      await api.post("/vendas/upload", formData);
      alert("Arquivo enviado com sucesso!");
      setIsImportOpen(false);
      // Recarrega os dados para exibir a planilha importada
      const response = await api.get("/vendas/listarven");
      setListVendas(response.data);
    } catch (error) {
      alert("Erro ao importar arquivo!");
      console.error("Detalhes do erro:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleFileChange = (event) => setSelectedFile(event.target.files[0]);

  const handleChangeForm = (e) => {
    const { id, value } = e.target;
    setVendaForm((prevState) => ({ ...prevState, [id]: value }));
  };

  async function cadastrarVenda() {
    const requiredFields = [
      "ID_COLABORADOR",
      "ID_SUPERVISOR",
      "cpfCliente",
      "valorLiberado",
      "comissaoEmpresa",
      "taxa",
      "cidadeVenda",
      "promotora",
      "dataPagamento",
      "linha_venda",
      "prazo",
      "banco",
    ];
    try {
      await api.post("/vendas/cadastrarven", vendaForm);
      alert("Venda cadastrada com sucesso!");
      setIsDialogOpen(false);
      // Recarrega a lista
      const response = await api.get("/vendas/listarven");
      setListVendas(response.data);
    } catch (error) {
      alert(
        "Erro ao cadastrar venda. Verifique os dados"
      );
      console.log(error);
    }
  }

  async function deleteSale(sale) {
    if (!sale || isNaN(sale.ID_VENDA))
      return alert("Erro: Informações da venda inválidas.");
    if (
      !window.confirm(
        `Tem certeza que deseja excluir a venda de valor "${formatCurrency(
          sale.valorLiberado
        )}"?`
      )
    )
      return;
    try {
      await api.delete(`/vendas/deleteVenda/${sale.ID_VENDA}`);
      alert("Venda deletada com sucesso!");
      setListVendas((prevVendas) =>
        prevVendas.filter((v) => v.ID_VENDA !== sale.ID_VENDA)
      );
    } catch (error) {
      alert("Erro ao deletar venda!");
      console.log(error);
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case true:
        return "bg-success text-success-foreground";
      case false:
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  console.log(currentUser)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vendas</h1>
          <p className="text-muted-foreground">
            Registre e gerencie as vendas realizadas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" /> Importar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Importação de Vendas</DialogTitle>
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

          <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" /> Exportar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Exportação de Vendas</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Label htmlFor="tipo">Formato</Label>
                <Select onValueChange={setExportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1" onClick={handleExport}>
                    Exportar
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsExportOpen(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Nova Venda
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Registrar Nova Venda</DialogTitle>
                <DialogDescription>
                  Preencha os dados da nova venda no sistema.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cpfCliente">CPF Cliente</Label>
                  <Input
                    id="cpfCliente"
                    type="text"
                    placeholder="000.000.000-00"
                    onChange={handleChangeForm}
                  />
                </div>

                <div>
                  <Label htmlFor="nomeCliente">Nome Cliente</Label>
                  <Input
                    id="nomeCliente"
                    type="text"
                    placeholder="Nome do Cliente"
                    onChange={handleChangeForm}
                  />
                </div>

                <div>
                  <Label htmlFor="valorLiberado">Valor da Venda (R$)</Label>
                  <Input
                    id="valorLiberado"
                    type="number"
                    placeholder="45000.00"
                    onChange={handleChangeForm}
                  />
                </div>

                <div>
                  <Label htmlFor="prazo">Prazo</Label>
                  <Input
                    id="prazo"
                    type="text"
                    placeholder="120x"
                    onChange={handleChangeForm}
                  />
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
                  <Label htmlFor="comissaoEmpresa">Comissão Empresa (R$)</Label>
                  <Input
                    id="comissaoEmpresa"
                    type="number"
                    placeholder="300.57"
                    onChange={handleChangeForm}
                  />
                </div>

                <div>
                  <Label htmlFor="comissaoColaborador">
                    Comissão Colaborador (R$)
                  </Label>
                  <Input
                    id="comissaoColaborador"
                    type="number"
                    placeholder="100.69"
                    onChange={handleChangeForm}
                  />
                </div>

                <div>
                  <Label htmlFor="taxa">Taxa (%)</Label>
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
                    onValueChange={(v) =>
                      setVendaForm((p) => ({ ...p, ID_SUPERVISOR: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o supervisor" />
                    </SelectTrigger>
                    <SelectContent>
                      {supervisors.map((s) => (
                        <SelectItem
                          key={s.ID_SUPERVISOR}
                          value={String(s.ID_SUPERVISOR)}
                        >
                          {s.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="ID_COLABORADOR">Colaborador</Label>
                  <Select
                    onValueChange={(v) =>
                      setVendaForm((p) => ({ ...p, ID_COLABORADOR: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o colaborador" />
                    </SelectTrigger>
                    <SelectContent>
                      {colaborators.map((c) => (
                        <SelectItem
                          key={c.ID_COLABORADOR}
                          value={String(c.ID_COLABORADOR)}
                        >
                          {c.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="banco">Banco</Label>
                  <Input
                    id="banco"
                    type="text"
                    placeholder="Santander"
                    onChange={handleChangeForm}
                  />
                </div>

                <div>
                  <Label htmlFor="linha_venda">Linha</Label>
                  <Select
                    onValueChange={(v) =>
                      setVendaForm((p) => ({ ...p, linha_venda: v }))
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
                  <Label htmlFor="produtoVenda">Produto Venda</Label>
                  <Select
                    onValueChange={(v) =>
                      setVendaForm((p) => ({ ...p, produtoVenda: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o produto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Novo Consignado">
                        Novo Consignado
                      </SelectItem>
                      <SelectItem value="Renovacao">Renovacao</SelectItem>
                      <SelectItem value="RMC">Cartao RMC</SelectItem>
                      <SelectItem value="RCC">Cartao RCC</SelectItem>
                      <SelectItem value="Portabilidade Consignado">
                        Portabilidade Consignado
                      </SelectItem>
                      <SelectItem value="Credito Pessoal">
                        Credito Pessoal
                      </SelectItem>
                      <SelectItem value="Port+Refin Consignado">
                        Port+Refin Consignado
                      </SelectItem>
                      <SelectItem value="Decimo Terceiro">
                        Decimo Terceiro
                      </SelectItem>
                      <SelectItem value="CLT">CLT</SelectItem>
                      <SelectItem value="FGTS">FGTS</SelectItem>
                      <SelectItem value="Consorcio">Consorcio</SelectItem>
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
                  <Button onClick={cadastrarVenda} className="flex-1">
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

      {/* CARDS */}
      <div className="grid gap-4 md:grid-cols-4">
        {/* CARD TOTAL DE VENDAS */}
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Vendas</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(displayTotals.valorTotalMesAtual)}
            </div>
          </CardContent>
        </Card>

        {/* CARD QUANTIDADE DE VENDAS */}
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Qtd. Vendas</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {displayTotals.quantidadeTotal}
            </div>
            <p className="text-xs text-muted-foreground">Vendas realizadas</p>
          </CardContent>
        </Card>

        {/* CARD MAIOR VENDA */}
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Maior Venda</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(displayTotals.maiorValorMes)}
            </div>
            <p className="text-xs text-muted-foreground">Maior venda registrada</p>
          </CardContent>
        </Card>

        {/* CARD MENOR VENDA */}
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Menor Venda</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(displayTotals.menorVenda)}
            </div>
            <p className="text-xs text-muted-foreground">
              Menor venda registrada
            </p>
          </CardContent>
        </Card>

        {/* COMISSAO EMPRESA */}
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Comissao Empresa
            </CardTitle>
            <CreditCard className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                displayTotals.valorComissaoEmpresa -
                  (displayTotals.valorComissaoColaboradorClt +
                    displayTotals.valorComissaoColaboradorMei)
              )}
            </div>
            <p className="text-xs text-muted-foreground">Total em comissões</p>
          </CardContent>
        </Card>

        {/* COMISSAO COLABORADOR MEI */}
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Comissao Colaboador MEI
            </CardTitle>
            <CreditCard className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(displayTotals.valorComissaoColaboradorMei)}
            </div>
            <p className="text-xs text-muted-foreground">Total em comissões</p>
          </CardContent>
        </Card>

        {/* COMISSAO COLABORADOR CLT */}
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Comissao Colaboador CLT
            </CardTitle>
            <CreditCard className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(displayTotals.valorComissaoColaboradorClt)}
            </div>
            <p className="text-xs text-muted-foreground">Total em comissões</p>
          </CardContent>
        </Card>

        {/* CARD TICKET MEDIO */}
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <Building className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(displayTotals.ticketMedio)}
            </div>
            <p className="text-xs text-muted-foreground">Por venda</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <Label htmlFor="search">
                Buscar por Cliente, CPF ou Colaborador
              </Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Digite para buscar..."
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
            </div>
            <div>
              <Label htmlFor="dataFinal">Data final</Label>
              <Input
                type="date"
                id="dataFinal"
                value={dataFinalFilter}
                onChange={(e) => setDataFinalFilter(e.target.value)}
              />
            </div>

            {/* NOVO: Filtro por Banco */}
            <div>
              <Label>Filtrar por Banco</Label>
              <Select
                onValueChange={setBancoFilter}
                value={bancoFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os bancos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Bancos</SelectItem>
                  {bancosUnicos.map((banco) => (
                    <SelectItem key={banco} value={banco}>
                      {banco}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {["ADMIN", "SUPERVISOR"].includes(currentUser.role) && (
              <div>
                <Label>Filtrar por Colaborador</Label>
                <Select
                  onValueChange={setColaboradorFilter}
                  value={colaboradorFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">
                      Todos os Colaboradores
                    </SelectItem>
                    {colaborators.map((colaborador) => (
                      <SelectItem
                        key={colaborador.ID_COLABORADOR}
                        value={String(colaborador.ID_COLABORADOR)}
                      >
                        {colaborador.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* NOVO: Ordenação por Valor */}
            <div>
              <Label>Ordenar por Valor</Label>
              <Select
                onValueChange={setOrdenacaoValor}
                value={ordenacaoValor}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Ordenação padrão" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="padrao">Padrão</SelectItem>
                  <SelectItem value="crescente">Crescente ↑</SelectItem>
                  <SelectItem value="decrescente">Decrescente ↓</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Lista de Vendas</CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label
                htmlFor="itemsPerPage"
                className="text-sm text-muted-foreground"
              >
                Itens por página:
              </Label>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => setItemsPerPage(Number(value))}
              >
                <SelectTrigger className="w-20">
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
            <div className="text-sm text-muted-foreground">
              Mostrando {indexOfFirstItem + 1}-
              {Math.min(indexOfLastItem, filteredSales.length)} de{" "}
              {filteredSales.length} vendas
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      // Alternar entre ordenações ao clicar no cabeçalho
                      if (ordenacaoValor === "decrescente") {
                        setOrdenacaoValor("crescente");
                      } else if (ordenacaoValor === "crescente") {
                        setOrdenacaoValor("padrao");
                      } else {
                        setOrdenacaoValor("decrescente");
                      }
                    }}
                    className="flex items-center gap-1 p-0 hover:bg-transparent"
                  >
                    Valor
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Colaborador</TableHead>
                <TableHead>Banco</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status Cliente</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentSales.map((venda) => (
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
                        {formatCurrency(venda.valorLiberado)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {venda.dataPagamento}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{venda.colaborador ? venda.colaborador.nome : "Venda do Supervisor"}</p>
                      <p className="text-sm text-muted-foreground">
                        Supervisor: {venda.nomeSupervisor}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{venda.banco}</TableCell>
                  <TableCell>{venda.dataPagamento}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(venda.statusCliente)}>
                      {venda.cliente?.status ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link to={`/vendas/${venda.ID_VENDA}`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      {["ADMIN", "SUPERVISOR"].includes(currentUser.role) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteSale(venda)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={7}>
                  {/* Controles de paginação */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Página {currentPage} de {totalPages}
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
                          variant={
                            currentPage === pageNumber ? "default" : "outline"
                          }
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
                </TableCell>
              </TableRow>

              {/* Linha de totais */}
              <TableRow>
                <TableCell className="font-semibold text-lg" colSpan={2}>
                  Totais (Filtro Atual)
                </TableCell>
                <TableCell
                  className="font-semibold text-lg text-left"
                  colSpan={2}
                >
                  {formatCurrency(filteredSaleTotals.valorTotalMesAtual)}
                </TableCell>
                <TableCell
                  className="font-semibold text-lg text-left"
                  colSpan={3}
                >
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