import { useEffect, useState } from "react";
import { useParams, useNavigate, MemoryRouter, Routes, Route } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Edit, Save, X, ArrowLeft, DollarSign } from "lucide-react";
import { api } from "@/services/api";
import { KPICard } from "@/components/DashboardKPI";



export default function UsuarioDetalhes() {
    const { role, id } = useParams();
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    const [listColaboratorsAtSupervisors, setListColaboratorsAtSupervisors] = useState([]);

    useEffect(() => {
        async function fetchUsuario() {
            if (!role || !id) return;
            
            setLoading(true);
            let userData = null;
            
            let endpoints = ""
            switch (role) {
                case "ADMIN":
                    endpoints = `/administrador/buscar/${id}`
                    break
                case "SUPERVISOR":
                    endpoints =  `/supervisor/buscarSupervisor/${id}`
                    break
                case "USER":
                    endpoints = `/colaborador/buscarColaborador/${id}`
                    break
                default:
                    console.error("Perfil desconhecido:", role);
                    setLoading(false);
                    setUsuario(null);
                    return;    
            }
            
                try {
                    const response = await api.get(endpoints);
                    if (role === "SUPERVISOR"){
                        setListColaboratorsAtSupervisors(response.data.colaboradores);
                    }
                    if (response.data) {
                        userData = response.data;
                        setUsuario(userData);
                        setFormData(userData);
                    }
                } catch (error) {
                    console.error("Usuário não encontrado em nenhuma das tabelas.");
                    setUsuario(null);
                } finally {
                    setLoading(false);
                }
        }

        fetchUsuario();
    }, [id, role]);

    useEffect(() => {
        if (usuario) {
            document.title = `Usuário: ${usuario.nome} | Virtus`;
        } else {
            document.title = `Detalhes do Usuário | Virtus`;
        }
    }, [usuario]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSaveChanges = async () => {
        if (!usuario?.role) {
            alert("Não foi possível identificar o perfil do usuário para salvar.");
            return;
        }

        let updateEndpoint = '';
        switch (usuario.role.toUpperCase()) {
            case 'ADMIN':
                updateEndpoint = `/administrador/atualizar/${id}`;
                break;
            case 'SUPERVISOR':
                updateEndpoint = `/supervisor/atualizarSupervisor/${id}`;
                break;
            case 'USER':
                updateEndpoint = `/colaborador/atualizarColaborador/${id}`;
                break;
            default:
                alert("Perfil de usuário desconhecido.");
                return;
        }

        try {
            await api.put(updateEndpoint, formData);
            setUsuario(formData);
            setIsEditing(false);
            alert("Dados do usuário atualizados com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar alterações:", error);
            alert("Não foi possível salvar as alterações. Tente novamente.");
        }
    };

    console.log(usuario)

    if (loading) {
        return <div className="p-4 text-center">Carregando...</div>;
    }

    if (!usuario) {
        return (
            <div className="p-4 space-y-4 text-center">
                <h1 className="text-3xl font-bold text-foreground">Usuário não encontrado</h1>
                <p className="text-muted-foreground">O usuário com o ID "{id}" não foi localizado no sistema.</p>
                <Button variant="outline" onClick={() => navigate('/usuarios')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar para a lista
                </Button>
            </div>
        );
    }

    const renderField = (label, name, value, type = "text") => (
        <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">{label}</span>
            {isEditing ? (
                <Input
                    name={name}
                    value={formData[name] || ''}
                    onChange={handleInputChange}
                    type={type}
                    className="font-medium"
                />
            ) : (
                <span className="font-medium">{value || 'Não informado'}</span>
            )}
        </div>
    );

    return (
        <div className="p-4 space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Detalhes do Usuário</h1>
                    <p className="text-muted-foreground">
                        {isEditing ? "Modo de edição ativado" : "Informações completas do usuário"}
                    </p>
                </div>
                <div className="flex gap-2">
                    {isEditing ? (
                        <>
                            <Button onClick={handleSaveChanges}><Save className="h-4 w-4 mr-2" /> Salvar</Button>
                            <Button variant="outline" onClick={() => setIsEditing(false)}><X className="h-4 w-4 mr-2" /> Cancelar</Button>
                        </>
                    ) : (
                        <>
                            <Button onClick={() => setIsEditing(true)}><Edit className="h-4 w-4 mr-2" /> Editar</Button>
                            <Button variant="outline" onClick={() => navigate('/usuarios')}><ArrowLeft className="h-4 w-4 mr-2" /> Voltar</Button>
                        </>
                    )}
                </div>
            </header>

            <Card className="shadow-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" /> Informações do Usuário
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground border-b pb-2">Identificação</h3>
                        <div className="space-y-3">
                            <div className="flex flex-col">
                                <span className="text-sm text-muted-foreground">ID do Usuário</span>
                                <span className="font-medium">{id}</span>
                            </div>
                            {renderField("Nome Completo", "nome", usuario.nome)}
                            {renderField("E-mail", "email", usuario.email, "email")}
                            <div className="flex flex-col">
                                <span className="text-sm text-muted-foreground">Perfil</span>
                                <span className="font-medium">{usuario.role}</span>                        
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground border-b pb-2">Documentos</h3>
                        <div className="space-y-3">
                            {renderField("CPF", "cpf", usuario.cpf)}
                            {renderField("RG", "rg", usuario.rg)}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground border-b pb-2">Contato</h3>
                        <div className="space-y-3">
                            {renderField("Telefone", "telefone", usuario.telefone, "tel")}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
