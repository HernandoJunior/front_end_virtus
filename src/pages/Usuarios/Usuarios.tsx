import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Users, Plus, Search, Edit, Trash2, Mail, Phone } from "lucide-react";
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
} from "@/components/ui/table";

import { api } from "@/services/api";
import { Link, useParams } from "react-router-dom";

export default function Usuarios() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleTerm, setRoleTerm] = useState("todos");
  const [statusTerm, setStatusTerm] = useState("");

  const [listAdministrador, setListAdministrador] = useState([]);
  const [listColaboradores, setListColaboradores] = useState([]);
  const [listSupervisores, setlistSupervisores] = useState([]);
  const listAllUsers = [
    ...listAdministrador,
    ...listColaboradores,
    ...listSupervisores,
  ];

  const handleChange = (e) => {
    const { id, value } = e.target;
    let finalValue = value;

    if (id === "ID_SUPERVISOR") {
      finalValue = value === "" ? "" : parseInt(value, 10);
    } else if (id === "ID_COLABORADOR") {
      finalValue = value === "" ? "" : parseFloat(value);
    }
    setUsuarios((prevState) => ({
      ...prevState, // Copia todos os valores antigos do estado
      [id]: value, // Atualiza apenas o campo que mudou
    }));
  };

  const [criarAdministrador, setAdmin] = useState({
    nome: "",
    email: "",
    senha: "",
    cpf: "",
    role: "",
    telefone: "",
    rg: ""
  });

  const [criarSupervisor, setSupervisor] = useState({
    nome: "",
    email: "",
    senha: "",
    cpf: "",
    role: "",
    rg: "",
    telefone: "",
  });

  const [criarColaborador, setColaborador] = useState({
    nome: "",
    email: "",
    senha: "",
    cpf: "",
    role: "",
    telefone: "",
    ID_SUPERVISOR: "",
    regimeContratacao: "",
    rg: ""
  });

  const [usuarios, setUsuarios] = useState({
    nome: "",
    email: "",
    senha: "",
    cpf: "",
    role: "",
    telefone: "",
    ID_SUPERVISOR: "",
    rg: "",
    regimeContratacao: "",
  });

  async function fetchAdministradores() {
    try {
      const response = await api.get("/administrador/listar");
      setListAdministrador(response.data);
    } catch (error) {
      error;
      alert("Nao foi possivel buscar por Administradores");
    }
  }
  async function fetchSupervisores() {
    try {
      const response = await api.get("/supervisor/listarsupervisores");
      setlistSupervisores(response.data);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    }
  }
  async function fetchColaboradores() {
    try {
      const response = await api.get("/colaborador/listarcol");
      setListColaboradores(response.data || []);
    } catch (error) {
      console.error("Erro ao buscar colaboradores:", error);
    }
  }

  useEffect(() => {
    fetchAdministradores(), fetchColaboradores(), fetchSupervisores();
  }, []);

  const filteredUsers = listAllUsers.filter((usuario) => {
    const matchNome =
      searchTerm === "" ||
      (usuario.nome &&
        usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchPerfil =
      roleTerm === "todos" ||
      (usuario.role &&
        usuario.role.toLowerCase().includes(roleTerm.toLowerCase()));

    return matchNome && matchPerfil;
  });

  function userRoute(usuario) {
    return (
      usuario.ID_ADMINISTRADOR ||
      usuario.ID_SUPERVISOR ||
      usuario.ID_COLABORADOR
    );
  }

  const createUser = () => {
    if (usuarios.role === "ADMIN") {
      async function createAdmin() {
        criarAdministrador.cpf = usuarios.cpf;
        criarAdministrador.email = usuarios.email;
        criarAdministrador.nome = usuarios.nome;
        criarAdministrador.role = usuarios.role;
        criarAdministrador.senha = usuarios.senha;
        criarAdministrador.telefone = usuarios.telefone;
        criarAdministrador.rg = usuarios.rg
        try {
          const response = await api.post(
            "/administrador/create",
            criarAdministrador
          );
          alert("Administrador cadastrado com sucesso!");
          setIsDialogOpen(false);
        } catch (error) {
          alert("Erro ao criar Administrador");
        }
      }

      createAdmin();
    }
    if (usuarios.role === "USER") {
      criarColaborador.nome = usuarios.nome;
      criarColaborador.email = usuarios.email;
      criarColaborador.senha = usuarios.senha;
      criarColaborador.cpf = usuarios.cpf;
      criarColaborador.telefone = usuarios.telefone;
      criarColaborador.rg = usuarios.rg
      criarColaborador.ID_SUPERVISOR = usuarios.ID_SUPERVISOR;
      criarColaborador.regimeContratacao = usuarios.regimeContratacao;

      async function createUser() {
        try {
          const response = await api.post(
            "/colaborador/register",
            criarColaborador
          );
          alert("Colaborador cadastrado com sucesso!");
          setIsDialogOpen(false);
        } catch (error) {
          alert("Erro ao criar Colaborador");
        }
      }

      createUser();
    }
    if (usuarios.role === "SUPERVISOR") {
      criarSupervisor.cpf = usuarios.cpf;
      criarSupervisor.nome = usuarios.nome;
      criarSupervisor.email = usuarios.email;
      criarSupervisor.role = usuarios.role;
      criarSupervisor.telefone = usuarios.telefone;
      criarSupervisor.senha = usuarios.senha;
      criarSupervisor.rg = usuarios.rg;

      async function createSupervisor() {
        try {
          const response = await api.post(
            "/supervisor/addsupervisor",
            criarSupervisor
          );
          alert("SUPERVISOR cadastrado com sucesso!");
          setIsDialogOpen(false);
        } catch (error) {
          alert("Erro ao criar Supervisor");
        }
      }

      createSupervisor();
    }
  };

  const getPerfilColor = (perfil: string) => {
    if (perfil == "ADMIN") {
      perfil = "Administrador";
    } else if (perfil == "SUPERVISOR") {
      perfil = "Supervisor";
    } else perfil = "Colaborador";

    switch (perfil) {
      case "Administrador":
        return "bg-primary text-primary-foreground";
      case "Supervisor":
        return "bg-warning text-warning-foreground";
      case "Colaborador":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const deleteUser = async (usuario, onUserDeleted) => {
    if (!usuario) {
      alert(
        "Erro: Informações do usuário incompletas. Não é possível deletar."
      );
      return;
    }

    const isConfirmed = window.confirm(
      `Tem certeza que deseja excluir o usuário "${usuario.nome}"? Esta ação não pode ser desfeita.`
    );

    if (!isConfirmed) {
      return;
    }

    let endPoint = "";
    let idParaDeletar;

    switch (usuario.role) {
      case "ADMIN":
        idParaDeletar = parseInt(usuario.ID_ADMINISTRADOR, 10);
        endPoint = `/administrador/delete/${idParaDeletar}`;
        break;
      case "SUPERVISOR":
        idParaDeletar = parseInt(usuario.ID_SUPERVISOR, 10);
        endPoint = `/supervisor/deletarSupervisor/${idParaDeletar}`;
        break;
      case "USER":
        idParaDeletar = parseInt(usuario.ID_COLABORADOR, 10);
        endPoint = `/colaborador/deletarColaborador/${idParaDeletar}`;
        break;
      default:
        alert(
          `Perfil de usuário "${usuario.role}" desconhecido. Não foi possível deletar.`
        );
        return;
    }

    if (isNaN(idParaDeletar)) {
      alert(`Erro: O usuário "${usuario.nome}" possui um ID inválido.`);
      return;
    }

    try {
      `Tentando deletar em: ${endPoint}`;
      await api.delete(endPoint);
      alert("Usuário deletado com sucesso!");

      if (onUserDeleted) {
        onUserDeleted();
      }
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Ocorreu um erro, colaborador com venda.";
      alert(`Não foi possível deletar o usuário. Erro: ${errorMessage}`);
    }
  };

  const fetchAllUsers = () => {
    fetchAdministradores(), fetchSupervisores(), fetchColaboradores();
  };

  usuarios;
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Usuários</h1>
          <p className="text-muted-foreground">
            Gerencie contas de usuário e permissões de acesso
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Novo Usuário</DialogTitle>
              <DialogDescription>
                Adicione um novo usuário ao sistema
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                  id="nome"
                  placeholder="João Silva Santos"
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="joao@virtus.com"
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  type="number"
                  placeholder="(11) 99999-0000"
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  placeholder="025.999.888.111"
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="perfil">Perfil de Acesso</Label>
                <Select
                  onValueChange={(value) =>
                    setUsuarios((prevState) => ({ ...prevState, role: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Administrador</SelectItem>
                    <SelectItem value="SUPERVISOR">Supervisor</SelectItem>
                    <SelectItem value="USER">Colaborador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {usuarios.role === "USER" && (
                <>
                  <div>
                    <Label htmlFor="supervisor">Supervisores</Label>
                    <Select
                      onValueChange={(value) =>
                        setUsuarios((prevState) => ({
                          ...prevState,
                          ID_SUPERVISOR: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o Supervisor" />
                      </SelectTrigger>
                      <SelectContent>
                        {listSupervisores.map((supervisor) => (
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
                    <Label htmlFor="regimeContratacao">
                      Regime de Contratacao
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        setUsuarios((prevState) => ({
                          ...prevState,
                          regimeContratacao: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o perfil" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MEI">MEI</SelectItem>
                        <SelectItem value="CLT">CLT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="senha">Senha Inicial</Label>
                <Input
                  id="senha"
                  type="password"
                  placeholder="••••••••"
                  onChange={handleChange}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={createUser} className="flex-1">
                  Criar Usuário
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

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Usuários
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {listAdministrador.length +
                listSupervisores.length +
                listColaboradores.length}
            </div>
            <p className="text-xs text-muted-foreground">Cadastrados</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Administradores
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold ">
              {listAdministrador.length}
            </div>
            <p className="text-xs text-muted-foreground">Acesso total</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Supervisores</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold ">{listSupervisores.length}</div>
            <p className="text-xs text-muted-foreground">Acesso limitado</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Colaboradores</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{listColaboradores.length}</div>
            <p className="text-xs text-muted-foreground">Acesso limitado</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Pesquisar pelo nome"
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label>Perfil</Label>
              <Select onValueChange={(value) => setRoleTerm(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os perfis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="ADMIN">Administrador</SelectItem>
                  <SelectItem value="SUPERVISOR">Supervisor</SelectItem>
                  <SelectItem value="USER">Colaborador</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Usuários */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Perfil</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>RG</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((usuario) => {
                const role = usuario.role;
                const user = usuario;
                
                return (
                  <TableRow key={usuario.email}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{usuario.nome}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1"></p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPerfilColor(usuario.role)}>
                        {usuario.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {usuario.email}
                        </p>
                        <p className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {usuario.telefone
                            ? usuario.telefone
                            : "Não cadastrado"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {usuario.cpf ? usuario.cpf : "Não Cadastrado"}
                    </TableCell>
                    <TableCell>
                      {usuario.rg ? usuario.rg : "Não Cadastrado"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Link to={`/usuarios/${role}/${userRoute(user)}`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteUser(user, fetchAllUsers)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
