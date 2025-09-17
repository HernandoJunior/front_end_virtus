import React, { useEffect, useState } from "react";
import { MemoryRouter, Routes, Route, useParams, useNavigate } from "react-router-dom";
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
    User,
    Calendar,
    DollarSign,
    Banknote,
    Clock
} from "lucide-react";
import { api } from "@/services/api";

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

    const [formData, setFormData] = useState({
      ID_COLABORADOR: "",
      banco: "",
      cpfCliente: "",
      role: "",
      parcela_utilizada: "",
      prazo: "",
      valor_liberado: "",
      valor_limite: "",
      dataProposta: ""
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

        fetchProposta();
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
            alert("Dados da proposta atualizados com sucesso! (Mock)");
        } catch (error) {
            console.error("Erro ao salvar alterações:", error);
            alert("Não foi possível salvar as alterações. Tente novamente.");
        }
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
                            {renderField("Valor Liberado", "valor_liberado", proposta.valor_liberado, formatCurrency)}
                            {renderField("Parcela Utilizada", "parcela_utilizada", proposta.parcela_utilizada, formatCurrency)}
                            {renderField("Valor Limite", "valor_limite", proposta.valor_limite, formatCurrency)}
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
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

