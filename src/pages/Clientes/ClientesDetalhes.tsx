// import { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Mail, Phone, IdCard, Edit, FileText, CalendarCheck, User } from "lucide-react";
// import { api } from "@/services/api";


// export default function ClienteDetalhes() {
//   const { id } = useParams();
//   const clienteId = Number(id);
//   const [listClients, setListClients] = useState([]);
//   const cliente = listClients.find((c) => c.ID_CLIENTE === clienteId);

//   useEffect(() => {
//     async function fetchclient() {
//       try {
//         const response = await api.get("/clientes/consulta");
//         setListClients(response.data);
//         console.log(listClients)
//       } catch (error) {
//         console.error("Erro ao buscar clientes:", error);
//       }
//     }

//     fetchclient()
//   }, []);


//   useEffect(() => {
//     document.title = cliente
//       ? `Cliente: ${cliente.nome} | Virtus CRM`
//       : `Cliente | Virtus CRM`;
//     let meta = document.querySelector('meta[name="description"]');
//     if (!meta) {
//       meta = document.createElement('meta');
//       meta.setAttribute('name', 'description');
//       document.head.appendChild(meta);
//     }
//     meta.setAttribute(
//       'content',
//       `Detalhes do cliente ${cliente?.nome ?? ''} no CRM Virtus. Contatos, status e informações principais.`
//     );
//     let link = document.querySelector('link[rel="canonical"]');
//     if (!link) {
//       link = document.createElement('link');
//       link.setAttribute('rel', 'canonical');
//       document.head.appendChild(link);
//     }
//     link.setAttribute('href', window.location.href);
//   }, [cliente]);

//   if (!cliente) {
//     return (
//       <div className="space-y-4">
//         <h1 className="text-3xl font-bold text-foreground">Cliente não encontrado</h1>
//         <Button variant="outline" asChild>
//           <Link to="/clientes">Voltar</Link>
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <header className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-foreground">Detalhes do Cliente</h1>
//           <p className="text-muted-foreground">Informações completas do cliente</p>
//         </div>
//         <div className="flex gap-2">
//           <Button variant="default">
//             <Edit className="h-4 w-4 mr-2" /> Editar
//           </Button>
//           <Button variant="outline" asChild>
//             <Link to={`/clientes/${clienteId}/propostas`}>
//               <FileText className="h-4 w-4 mr-2" /> Propostas
//             </Link>
//           </Button>
//           <Button variant="outline" asChild>
//             <Link to="/clientes">Voltar</Link>
//           </Button>
//         </div>
//       </header>

//       <Card className="shadow-card">
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <User className="h-5 w-5 text-primary" />
//             Informações do Cliente
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold text-foreground border-b pb-2">Identificação</h3>
//               <div className="space-y-3">
//                 <div className="flex flex-col">
//                   <span className="text-sm text-muted-foreground">ID Cliente</span>
//                   <span className="font-medium">{clienteId}</span>
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-sm text-muted-foreground">Nome</span>
//                   <span className="font-medium">{cliente.nome}</span>
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-sm text-muted-foreground">CPF</span>
//                   <span className="font-medium">{cliente.cpf}</span>
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-sm text-muted-foreground">E-mail</span>
//                   <span className="font-medium">{cliente.email}</span>
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-sm text-muted-foreground">Matrícula</span>
//                   <span className="font-medium">{cliente.matricula}</span>
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold text-foreground border-b pb-2">Serviço e Margem</h3>
//               <div className="space-y-3">
//                 <div className="flex flex-col">
//                   <span className="text-sm text-muted-foreground">Serviço</span>
//                   <span className="font-medium">{cliente.servico}</span>
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-sm text-muted-foreground">Margem Disponível</span>
//                   <span className="font-bold text-success">{cliente.margem_disponivel}</span>
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-sm text-muted-foreground">Margem Total</span>
//                   <span className="font-medium">{cliente.margem_total}</span>
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-sm text-muted-foreground">Margem</span>
//                   <span className="font-medium">{cliente.margem.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-sm text-muted-foreground">Valor Liberado</span>
//                   <span className="font-medium">{cliente.valor_liberado}</span>
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold text-foreground border-b pb-2">Dados Pessoais</h3>
//               <div className="space-y-3">
//                 <div className="flex flex-col">
//                   <span className="text-sm text-muted-foreground">Data de Nascimento</span>
//                   <span className="font-medium">{cliente.data_nascimento}</span>
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-sm text-muted-foreground">Idade</span>
//                   <span className="font-medium">{cliente.idade} anos</span>
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-sm text-muted-foreground">Telefone Principal</span>
//                   <span className="font-medium">{cliente.telefone}</span>
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-sm text-muted-foreground">Telefone 2</span>
//                   <span className="font-medium">{cliente.telefone_2}</span>
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-sm text-muted-foreground">Telefone 3</span>
//                   <span className="font-medium">{cliente.telefone_3}</span>
//                 </div>
//               </div>
//             </div>

//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Precisa importar o componente de Input
import { User, Edit, FileText, Save, X } from "lucide-react"; // Adicionar ícones para Salvar e Cancelar
import { api } from "@/services/api";
import { log } from "console";

export default function ClienteDetalhes() {
    const { id } = useParams();
    const clienteId = Number(id);

    const [cliente, setCliente] = useState(null);
    // Controla se estamos no "modo de edição" (true) ou "modo de visualização" (false).
    const [isEditing, setIsEditing] = useState(false);
    // Guarda os dados do formulário enquanto o usuário digita.
    const [formData, setFormData] = useState({});

    // Este useEffect agora busca apenas o cliente específico pelo ID.
    useEffect(() => {
        async function fetchCliente() {
            if (!clienteId) return;
            try {
                const response = await api.get(`/clientes/consulta/${clienteId}`);
                setCliente(response.data);
                setFormData(response.data); // Preenche o formulário com os dados iniciais
                console.log(response.data)
            } catch (error) {
                console.error("Erro ao buscar dados do cliente:", error);
                setCliente(null); // Define como nulo se não encontrar, para mostrar a mensagem de erro
            }
        }
        fetchCliente();
    }, [clienteId]); // Roda sempre que o ID na URL mudar

    // Lógica para o título da página e meta tags (sem alterações)
    useEffect(() => {
        document.title = cliente ? `Cliente: ${cliente.nome} | Virtus CRM` : `Cliente | Virtus CRM`;
        // ...resto do seu código de meta tags...
    }, [cliente]);


    const handleEditClick = () => {
        setIsEditing(true); // Ativa o modo de edição
    };

    const handleCancelClick = () => {
        setIsEditing(false); // Desativa o modo de edição
        setFormData(cliente); // Restaura qualquer mudança não salva
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSaveChanges = async () => {
        try {
            await api.put(`/clientes/atualizar/${clienteId}`, formData);
            setCliente(formData); // Atualiza a tela com os novos dados
            setIsEditing(false); // Volta para o modo de visualização
            alert("Dados do cliente atualizados com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar alterações:", error);
            console.log(formData)
            alert("Não foi possível salvar as alterações. Tente novamente.");
        }
    };


    if (cliente === undefined) {
        return <div>Carregando...</div>;
    }

    if (!cliente) {
        return (
            <div className="space-y-4">
                <h1 className="text-3xl font-bold text-foreground">Cliente não encontrado</h1>
                <p className="text-muted-foreground">O cliente com o ID solicitado não foi localizado no sistema.</p>
                <Button variant="outline" asChild>
                    <Link to="/clientes">Voltar para a lista de clientes</Link>
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
                <span className="font-medium">{value}</span>
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Detalhes do Cliente</h1>
                    <p className="text-muted-foreground">
                        {isEditing ? "Modo de edição ativado" : "Informações completas do cliente"}
                    </p>
                </div>
                <div className="flex gap-2">
                    {isEditing ? (
                        <>
                            <Button onClick={handleSaveChanges}>
                                <Save className="h-4 w-4 mr-2" /> Salvar
                            </Button>
                            <Button variant="outline" onClick={handleCancelClick}>
                                <X className="h-4 w-4 mr-2" /> Cancelar
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button onClick={handleEditClick}>
                                <Edit className="h-4 w-4 mr-2" /> Editar
                            </Button>
                            <Button variant="outline" asChild>
                                <Link to="/clientes">Voltar</Link>
                            </Button>
                        </>
                    )}
                </div>
            </header>

            <Card className="shadow-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" /> Informações do Cliente
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">

                    {/* ## CAMPOS RENDERIZADOS CONDICIONALMENTE ## */}
                    <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-foreground border-b pb-2">Identificação</h3>
                            <div className="space-y-3">
                              <div className="flex flex-col">
                                <span className="text-sm text-muted-foreground">Cliente ID</span>
                                <span className="font-medium">{clienteId}</span>
                            </div>
                                {renderField("Nome", "nome", cliente.nome)}
                              <div className="flex flex-col">
                                <span className="text-sm text-muted-foreground">Colaborador</span>
                                <span className="font-medium">{cliente.ID_COLABORADOR ? cliente.nomeColaborador : "Colaborador nao vinculado"}</span>
                              </div>
                            <div className="flex flex-col">
                                <span className="text-sm text-muted-foreground">Status do Cliente</span>
                                <span className={`font-medium ${cliente.status ? 'text-green-500' : 'text-red-500'}`}>
                                    {cliente.status ? "Ativo" : "Inativo"}</span>
                              </div>
                                {renderField("CPF", "cpf", cliente.cpf)}
                                {renderField("E-mail", "email", cliente.email)}
                                {renderField("Matrícula", "matricula", cliente.matricula)}
                              </div>
                          </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-foreground border-b pb-2">Serviço e Margem</h3>
                            <div className="space-y-3">
                                {renderField("Serviço", "servico", cliente.servico)}
                                {renderField("Margem Disponível", "margem_disponivel", cliente.margem_disponivel)}
                                {renderField("Margem Total", "margem_total", cliente.margem_total)}
                                {renderField("Margem", "margem", cliente.margem)}
                                {renderField("Valor Liberado", "valor_liberado", cliente.valorliberado)}
                                {renderField("Agencia", "agencia", cliente.agencia)}
                                {renderField("Conta", "conta", cliente.conta)}
                                {renderField("Banco", "banco", cliente.banco)}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-foreground border-b pb-2">Dados Pessoais</h3>
                            <div className="space-y-3">
                                {renderField("Data de Nascimento", "data_nascimento", cliente.data_nascimento, "date")}
                                {renderField("Idade", "idade", `${cliente.idade ? `${cliente.idade} anos` : ""}`)}
                                {renderField("Telefone Principal", "telefone", cliente.telefone, "tel")}
                                {renderField("Telefone 2", "telefone_2", cliente.telefone_2, "tel2")}
                                {renderField("Telefone 3", "telefone_3", cliente.telefone_3, "tel3")}
                                {renderField("Orgao de vinculo do cliente", "status_servidor", cliente.status_servico, "status_servidor")}        
                                {renderField("Cargo", "status_servico", cliente.status_servidor, "status_servico")}                        
                                {renderField("Instituicao Financeira", "status_dist", cliente.status_dist, "status_dist")}
                                {renderField("Perfil do cliente", "status_cliente", cliente.status_cliente, "status_cliente")}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-foreground border-b pb-2">Informaçoes adicionais</h3>
                            <div className="space-y-3">
                                {renderField("Endereço", "endereco", cliente.endereço, "text")}
                            </div>
                        </div>

                    </div>
                </CardContent>
            </Card>
        </div>
    );
}