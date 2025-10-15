import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
    FileText, 
    Edit, 
    Save, 
    X, 
    ArrowLeft, 
    CheckCircle,
    Loader2
} from "lucide-react";
import { api } from "@/services/api";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Funções auxiliares de formatação
const formatCurrency = (value) => {
  if (value === null || value === undefined) return 'N/A';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const formatCPF = (cpf) => {
  if (!cpf) return '';
  const cpfOnlyNumbers = cpf.toString().replace(/\D/g, '');
  if (cpfOnlyNumbers.length !== 11) return cpf;
  return cpfOnlyNumbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};


export default function PropostaDetalhes() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [proposta, setProposta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isConvertingToSale, setIsConvertingToSale] = useState(false);
    const [isConvertDialogOpen, setIsConvertDialogOpen] = useState(false);
    const [supervisors, setSupervisors] = useState([]);

    const [formData, setFormData] = useState({
      ID_COLABORADOR: "",
      banco: "",
      cpfCliente: "",
      role: "",
      parcela_utilizada: "",
      prazo: "",
      valor_liberado: "",
      valor_limite: "",
      dataProposta: "",
      observacoes: ""
    })

    const [vendaFormData, setVendaFormData] = useState({
      ID_SUPERVISOR: "",
      comissaoColaborador: "",
      comissaoEmpresa: "",
      taxa: "",
      cidadeVenda: "",
      promotora: "",
      dataPagamento: new Date().toISOString().split('T')[0],
      linha_venda: "",
      produtoVenda: ""
    })

    useEffect(() => {
        async function fetchProposta() {
            const proposalId = id; 
            
            setLoading(true);
            try {
                const response = await api.get(`/proposta/buscarProposta/${proposalId}`);
                setProposta(response.data);
                setFormData(response.data);
            } catch (error) {
                console.error("Proposta não encontrada:", error);
                setProposta(null);
            } finally {
                setLoading(false);
            }
        }

        async function fetchSupervisors() {
            try {
                const response = await api.get("/supervisor/listarsupervisores");
                setSupervisors(response.data || []);
            } catch (error) {
                console.error("Erro ao buscar supervisores:", error);
            }
        }

        fetchProposta();
        fetchSupervisors();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSaveChanges = async () => {
        const proposalId = id || "1";
        try {
            await api.put(`/proposta/atualizar/${proposalId}`, formData);
            setProposta(formData);
            setIsEditing(false);
            alert("Dados da proposta atualizados com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar alterações:", error);
            alert("Não foi possível salvar as alterações. Tente novamente.");
        }
    };

    const handleConvertToSale = async () => {
        setIsConvertingToSale(true);
        try {
            // Prepara os dados da venda baseado na proposta + dados do formulário
            const vendaData = {
                ID_COLABORADOR: proposta.ID_COLABORADOR,
                ID_SUPERVISOR: vendaFormData.ID_SUPERVISOR,
                cpfCliente: proposta.cpfCliente,
                nomeCliente: proposta.clientes,
                valorLiberado: proposta.valor_liberado,
                banco: proposta.banco,
                prazo: proposta.prazo,
                dataPagamento: vendaFormData.dataPagamento,
                comissaoColaborador: vendaFormData.comissaoColaborador,
                comissaoEmpresa: vendaFormData.comissaoEmpresa,
                taxa: vendaFormData.taxa,
                cidadeVenda: vendaFormData.cidadeVenda,
                promotora: vendaFormData.promotora,
                linha_venda: vendaFormData.linha_venda,
                produtoVenda: vendaFormData.produtoVenda
            };

            await api.post("/vendas/cadastrarven", vendaData);
            alert("Proposta cadastrada como venda com sucesso!");
            setIsConvertDialogOpen(false);
            navigate('/vendas');
        } catch (error) {
            console.error("Erro ao converter proposta em venda:", error);
            alert("Não foi possível cadastrar a venda. Verifique os dados.");
        } finally {
            setIsConvertingToSale(false);
        }
    };

    const handleVendaInputChange = (e) => {
        const { name, value } = e.target;
        setVendaFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleVendaSelectChange = (name, value) => {
        setVendaFormData(prevData => ({ ...prevData, [name]: value }));
    };

    if (loading) {
        return <div className="p-4 text-center">A carregar detalhes da proposta...</div>;
    }

    if (!proposta) {
        return (
            <div className="p-4 space-y-4 text-center">
                <h1 className="text-3xl font-bold text-foreground">Proposta não encontrada</h1>
                <p className="text-muted-foreground">A proposta com o ID "{id || '1'}" não foi localizada no sistema.</p>
                <Button variant="outline" onClick={() => navigate('/propostas')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar para a lista de propostas
                </Button>
            </div>
        );
    }
    
    const renderField = (label, name, value, formatter?, type?) => (
        <div className="flex flex-col gap-1">
            <Label className="text-sm text-muted-foreground">{label}</Label>
            {isEditing ? (
                <Input
                    name={name}
                    type={type}
                    value={formData[name] || ''}
                    onChange={handleInputChange}
                    className="font-medium"
                />
            ) : (
                <span className="font-medium text-foreground">{formatter ? formatter(value) : (value || 'Não informado')}</span>
            )}
        </div>
    );

    return (
        <div className="p-4 space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Detalhes da Proposta</h1>
                    <p className="text-muted-foreground">
                        {isEditing ? `A editar proposta de ${proposta.clientes}` : `Informações da proposta de ${proposta.clientes}`}
                    </p>
                </div>
                <div className="flex gap-2">
                    {proposta.role === 'CONCLUIDA' && !isEditing && (
                        <Button 
                            onClick={() => setIsConvertDialogOpen(true)}
                            className="bg-success hover:bg-success/90"
                        >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Cadastrar como Venda
                        </Button>
                    )}
                    {isEditing ? (
                        <>
                            <Button onClick={handleSaveChanges}><Save className="h-4 w-4 mr-2" /> Salvar</Button>
                            <Button variant="outline" onClick={() => { setIsEditing(false); setFormData(proposta); }}>
                                <X className="h-4 w-4 mr-2" /> Cancelar
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button onClick={() => setIsEditing(true)}><Edit className="h-4 w-4 mr-2" /> Editar</Button>
                            <Button variant="outline" onClick={() => navigate('/propostas')}><ArrowLeft className="h-4 w-4 mr-2" /> Voltar</Button>
                        </>
                    )}
                </div>
            </header>

            <Card className="shadow-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" /> Informações da Proposta
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground border-b pb-2">Cliente e Operação</h3>
                        <div className="space-y-4">
                           {renderField("Cliente", "clientes", proposta.clientes)}
                           {renderField("CPF", "cpfCliente", proposta.cpfCliente, formatCPF)}
                           {isEditing ? (
                                <div className="flex flex-col gap-1">
                                    <Label className="text-sm text-muted-foreground">Banco</Label>
                                    <Select value={formData.banco} onValueChange={(value) => handleSelectChange('banco', value)}>
                                        <SelectTrigger><SelectValue placeholder="Selecione o banco" /></SelectTrigger>
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
                           ) : renderField("Banco", "banco", proposta.banco ? proposta.banco.toUpperCase() : 'N/A')}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground border-b pb-2">Valores e Prazos</h3>
                        <div className="space-y-4">
                            {renderField("Valor Liberado", "valor_liberado", proposta.valor_liberado, formatCurrency, "number")}
                            {renderField("Parcela Utilizada", "parcela_utilizada", proposta.parcela_utilizada, formatCurrency, "number")}
                            {renderField("Valor Limite", "valor_limite", proposta.valor_limite, formatCurrency, "number")}
                            {isEditing ? (
                                <div className="flex flex-col gap-1">
                                    <Label className="text-sm text-muted-foreground">Prazo</Label>
                                    <Select value={formData.prazo} onValueChange={(value) => handleSelectChange('prazo', value)}>
                                        <SelectTrigger><SelectValue placeholder="Selecione o prazo" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="24x">24X</SelectItem>
                                            <SelectItem value="48x">48X</SelectItem>
                                            <SelectItem value="84x">84X</SelectItem>
                                            <SelectItem value="96x">96X</SelectItem>
                                            <SelectItem value="120x">120X</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            ) : renderField("Prazo", "prazo", proposta.prazo)}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground border-b pb-2">Status e Responsáveis</h3>
                        <div className="space-y-4">
                             {isEditing ? (
                                <div className="flex flex-col gap-1">
                                    <Label className="text-sm text-muted-foreground">Status</Label>
                                    <Select value={formData.role} onValueChange={(value) => handleSelectChange('role', value)}>
                                        <SelectTrigger><SelectValue placeholder="Status da Proposta" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="RECUSADA">Recusada</SelectItem>
                                            <SelectItem value="ANALISE">Em Análise</SelectItem>
                                            <SelectItem value="CONCLUIDA">Concluída</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            ) : renderField("Status", "role", proposta.role)}
                            <div>
                                <Label className="text-sm text-muted-foreground">Colaborador</Label>
                                <p className="font-medium text-foreground">{proposta.colaborador1}</p>
                            </div>
                            <div>
                                <Label className="text-sm text-muted-foreground">Supervisor</Label>
                                <p className="font-medium text-foreground">{proposta.supervisor1}</p>
                            </div>
                            {renderField("Data da Proposta", "dataProposta", proposta.dataProposta, "", "date")}
                            {renderField("Observações", "observacoes", proposta.observacoes, "", "text")}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Dialog para Converter em Venda */}
            <Dialog open={isConvertDialogOpen} onOpenChange={setIsConvertDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Cadastrar Proposta como Venda</DialogTitle>
                        <DialogDescription>
                            Preencha as informações adicionais para concluir o cadastro da venda
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* Informações da Proposta (somente leitura) */}
                        <div className="bg-muted p-4 rounded-lg space-y-2">
                            <h4 className="font-semibold text-sm">Dados da Proposta:</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div><span className="text-muted-foreground">Cliente:</span> <span className="font-medium">{proposta.clientes}</span></div>
                                <div><span className="text-muted-foreground">CPF:</span> <span className="font-medium">{formatCPF(proposta.cpfCliente)}</span></div>
                                <div><span className="text-muted-foreground">Banco:</span> <span className="font-medium">{proposta.banco}</span></div>
                                <div><span className="text-muted-foreground">Valor:</span> <span className="font-medium">{formatCurrency(proposta.valor_liberado)}</span></div>
                                <div><span className="text-muted-foreground">Prazo:</span> <span className="font-medium">{proposta.prazo}</span></div>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            {/* Supervisor */}
                            <div>
                                <Label htmlFor="ID_SUPERVISOR">Supervisor *</Label>
                                <Select 
                                    value={vendaFormData.ID_SUPERVISOR} 
                                    onValueChange={(value) => handleVendaSelectChange('ID_SUPERVISOR', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o supervisor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {supervisors.map((s) => (
                                            <SelectItem key={s.ID_SUPERVISOR} value={String(s.ID_SUPERVISOR)}>
                                                {s.nome}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Comissão Colaborador */}
                            <div>
                                <Label htmlFor="comissaoColaborador">Comissão Colaborador (R$) *</Label>
                                <Input
                                    id="comissaoColaborador"
                                    name="comissaoColaborador"
                                    type="number"
                                    step="0.01"
                                    placeholder="100.00"
                                    value={vendaFormData.comissaoColaborador}
                                    onChange={handleVendaInputChange}
                                />
                            </div>

                            {/* Comissão Empresa */}
                            <div>
                                <Label htmlFor="comissaoEmpresa">Comissão Empresa (R$) *</Label>
                                <Input
                                    id="comissaoEmpresa"
                                    name="comissaoEmpresa"
                                    type="number"
                                    step="0.01"
                                    placeholder="300.00"
                                    value={vendaFormData.comissaoEmpresa}
                                    onChange={handleVendaInputChange}
                                />
                            </div>

                            {/* Taxa */}
                            <div>
                                <Label htmlFor="taxa">Taxa (%) *</Label>
                                <Input
                                    id="taxa"
                                    name="taxa"
                                    type="number"
                                    step="0.01"
                                    placeholder="7.89"
                                    value={vendaFormData.taxa}
                                    onChange={handleVendaInputChange}
                                />
                            </div>

                            {/* Cidade */}
                            <div>
                                <Label htmlFor="cidadeVenda">Cidade *</Label>
                                <Input
                                    id="cidadeVenda"
                                    name="cidadeVenda"
                                    type="text"
                                    placeholder="Salvador"
                                    value={vendaFormData.cidadeVenda}
                                    onChange={handleVendaInputChange}
                                />
                            </div>

                            {/* Promotora */}
                            <div>
                                <Label htmlFor="promotora">Promotora *</Label>
                                <Input
                                    id="promotora"
                                    name="promotora"
                                    type="text"
                                    placeholder="BEVI"
                                    value={vendaFormData.promotora}
                                    onChange={handleVendaInputChange}
                                />
                            </div>

                            {/* Data Pagamento */}
                            <div>
                                <Label htmlFor="dataPagamento">Data Pagamento *</Label>
                                <Input
                                    id="dataPagamento"
                                    name="dataPagamento"
                                    type="date"
                                    value={vendaFormData.dataPagamento}
                                    onChange={handleVendaInputChange}
                                />
                            </div>

                            {/* Linha Venda */}
                            <div>
                                <Label htmlFor="linha_venda">Linha *</Label>
                                <Select 
                                    value={vendaFormData.linha_venda} 
                                    onValueChange={(value) => handleVendaSelectChange('linha_venda', value)}
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

                            {/* Produto Venda */}
                            <div className="md:col-span-2">
                                <Label htmlFor="produtoVenda">Produto Venda *</Label>
                                <Select 
                                    value={vendaFormData.produtoVenda} 
                                    onValueChange={(value) => handleVendaSelectChange('produtoVenda', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o produto" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Novo Consignado">Novo Consignado</SelectItem>
                                        <SelectItem value="Renovacao">Renovação</SelectItem>
                                        <SelectItem value="RMC">Cartão RMC</SelectItem>
                                        <SelectItem value="RCC">Cartão RCC</SelectItem>
                                        <SelectItem value="Portabilidade Consignado">Portabilidade Consignado</SelectItem>
                                        <SelectItem value="Credito Pessoal">Crédito Pessoal</SelectItem>
                                        <SelectItem value="Port+Refin Consignado">Port+Refin Consignado</SelectItem>
                                        <SelectItem value="Decimo Terceiro">Décimo Terceiro</SelectItem>
                                        <SelectItem value="CLT">CLT</SelectItem>
                                        <SelectItem value="FGTS">FGTS</SelectItem>
                                        <SelectItem value="Consorcio">Consórcio</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex gap-2 pt-4">
                            <Button 
                                onClick={handleConvertToSale} 
                                disabled={isConvertingToSale}
                                className="flex-1"
                            >
                                {isConvertingToSale ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Cadastrando...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Confirmar Cadastro
                                    </>
                                )}
                            </Button>
                            <Button 
                                variant="outline" 
                                onClick={() => setIsConvertDialogOpen(false)}
                                disabled={isConvertingToSale}
                            >
                                Cancelar
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}