import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Plus, 
  TrendingUp, 
  Calendar,
  DollarSign,
  Users,
  Edit,
  Trash2,
  Filter,
  Search
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
import { api } from "@/services/api";


// Interface para tipar os dados que vêm da API
interface Meta {
  id: number;
  metaDescricao: string;
  valorMeta: number;
  tipoDaMeta: string;
  responsavelNome: string;
  dataInicio: string;
  dataFinal: string;
  statusMeta: string;
  valorRealizado: number;
  progresso: number;
  idColaborador?: number;
  idSupervisor?: number;
}

export default function Metas() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const [listMetas, setListMetas] = useState<Meta[]>([]);
  const [listSupervisores, setListSupervisores] = useState<any[]>([]);
  const [listColaboradores, setListColaboradores] = useState<any[]>([]);

  // Estados para os filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [tipoFilter, setTipoFilter] = useState("todos");

  const [editingMeta, setEditingMeta] = useState<Meta | null>(null);

  const initialState = {
    metaDescricao: "",
    valorMeta: "",
    tipoDaMeta: "",
    idColaborador: null,
    idSupervisor: null,
    dataInicio: "",
    dataFinal: "",
    statusMeta: "PROCESSANDO"
  };

  const [formData, setFormData] = useState(initialState);

  // --- FUNÇÕES DE API ---
  async function fetchMeta() {
    try {
      const response = await api.get("/metas");
      setListMetas(response.data);
    } catch (error) {
      alert("Nao foi possivel carregar as metas");
    }
  }

  async function fetchSupervisores() {
    try {
      const response = await api.get("/supervisor/listarsupervisores");
      setListSupervisores(response.data);
    } catch (error) {
      alert("Nao foi possivel carregar supervisores!");
    }
  }

  async function fetchColaboradores() {
    try {
      const response = await api.get("/colaborador/listarcol");
      setListColaboradores(response.data);
    } catch (error) {
      alert("Nao foi possivel buscar colaboradores");
    }
  }

  useEffect(() => {
    fetchMeta();
    fetchSupervisores();
    fetchColaboradores();
  }, []);

  async function criarMeta() {
    if (!formData.tipoDaMeta || (!formData.idColaborador && !formData.idSupervisor)) {
      alert("Por favor, selecione o tipo e o responsável pela meta.");
      return;
    }
    try {
      await api.post("/metas", formData);
      alert("Meta criada com sucesso!");
      fetchMeta();
      setIsDialogOpen(false);
      setFormData(initialState);
    } catch (error) {
      alert("Nao foi possivel criar a meta. Verifique os dados.");
    }
  }

  async function atualizarMeta() {
    if (!editingMeta) return;

  const payload = {
      metaDescricao: editingMeta.metaDescricao,
      valorMeta: editingMeta.valorMeta,
      tipoDaMeta: editingMeta.tipoDaMeta,
      idColaborador: editingMeta.tipoDaMeta === 'INDIVIDUAL' ? editingMeta.idColaborador : null,
      idSupervisor: editingMeta.tipoDaMeta === 'EQUIPE' ? editingMeta.idSupervisor : null,
      dataInicio: editingMeta.dataInicio,
      dataFinal: editingMeta.dataFinal,
      statusMeta: editingMeta.statusMeta,
  };

    try {
      await api.put(`/metas/${editingMeta.id}`, payload);
      alert("Meta atualizada com sucesso!");
      setIsEditDialogOpen(false);
      fetchMeta();
    } catch (error) {
      alert("Não foi possível atualizar a meta.");
    }
  }

  async function deletarMeta(id: number) {
    if (window.confirm("Tem certeza que deseja deletar esta meta?")) {
      try {
        await api.delete(`/metas/${id}`);
        alert("Meta deletada com sucesso!");
        fetchMeta();
      } catch (error) {
        alert("Não foi possível deletar a meta.");
      }
    }
  }

  // --- FUNÇÕES AUXILIARES ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [id]: value }));
  };
  
  const handleEditMeta = (meta: Meta) => {
    setEditingMeta(meta);
    setIsEditDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONCLUIDA": return "bg-success text-success-foreground";
      case "PROCESSANDO": return "bg-warning text-warning-foreground";
      case "FINALIZADA": return "bg-destructive text-destructive-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  const filteredMetas = listMetas.filter(meta => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch =
      meta.metaDescricao.toLowerCase().includes(searchTermLower) ||
      meta.responsavelNome.toLowerCase().includes(searchTermLower);
    const matchesStatus = statusFilter === "todos" || meta.statusMeta === statusFilter;
    const matchesTipo = tipoFilter === "todos" || meta.tipoDaMeta === tipoFilter;
    return matchesSearch && matchesStatus && matchesTipo;
  });

  const totalRealizado = filteredMetas.reduce((acc, meta) => acc + meta.valorRealizado, 0);
  const totalMeta = filteredMetas.reduce((acc, meta) => acc + meta.valorMeta, 0);
  const realizacaoMedia = totalMeta > 0 ? (totalRealizado / totalMeta) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Metas</h1>
          <p className="text-muted-foreground">
            Gerencie e acompanhe o desempenho das metas de vendas
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Meta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Criar Nova Meta</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input id="metaDescricao" placeholder="Nome da Meta (Ex: Meta Mensal Janeiro)" onChange={handleChange} value={formData.metaDescricao} />
              <Input id="valorMeta" type="number" placeholder="Valor da Meta (Ex: 850000)" onChange={handleChange} value={formData.valorMeta} />
              <div className="grid grid-cols-2 gap-4">
                <Input id="dataInicio" type="date" onChange={handleChange} value={formData.dataInicio} />
                <Input id="dataFinal" type="date" onChange={handleChange} value={formData.dataFinal} />
              </div>
              <Select onValueChange={(value) => setFormData((prevState) => ({ ...prevState, tipoDaMeta: value, idColaborador: null, idSupervisor: null }))}>
                <SelectTrigger><SelectValue placeholder="Selecione o tipo da meta" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                  <SelectItem value="EQUIPE">Equipe</SelectItem>
                </SelectContent>
              </Select>
              {formData.tipoDaMeta === 'INDIVIDUAL' && (
                <Select onValueChange={(value) => setFormData((prevState) => ({ ...prevState, idColaborador: Number(value) }))}>
                    <SelectTrigger><SelectValue placeholder="Selecione o colaborador" /></SelectTrigger>
                    <SelectContent>
                        {listColaboradores.map((col: any) => (
                            <SelectItem key={col.ID_COLABORADOR} value={String(col.ID_COLABORADOR)}>{col.nome}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              )}
              {formData.tipoDaMeta === 'EQUIPE' && (
                <Select onValueChange={(value) => setFormData((prevState) => ({ ...prevState, idSupervisor: Number(value) }))}>
                    <SelectTrigger><SelectValue placeholder="Selecione o supervisor" /></SelectTrigger>
                    <SelectContent>
                        {listSupervisores.map((sup: any) => (
                            <SelectItem key={sup.ID_SUPERVISOR} value={String(sup.ID_SUPERVISOR)}>{sup.nome}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              )}
              <div className="flex gap-2 pt-4">
                <Button onClick={criarMeta} className="flex-1">Criar Meta</Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Filter className="h-4 w-4" /> Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar metas..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos Status</SelectItem>
                <SelectItem value="PROCESSANDO">Em Andamento</SelectItem>
                <SelectItem value="CONCLUIDA">Concluída</SelectItem>
                <SelectItem value="FINALIZADA">Finalizada</SelectItem>
              </SelectContent>
            </Select>
            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos Tipos</SelectItem>
                <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                <SelectItem value="EQUIPE">Equipe</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => { setSearchTerm(""); setStatusFilter("todos"); setTipoFilter("todos"); }}>
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Metas Ativas</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredMetas.length}</div>
            <p className="text-xs text-muted-foreground">Filtradas</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Realização Média</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{realizacaoMedia.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Das metas filtradas</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Realizado</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalRealizado.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-muted-foreground">No período ativo</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {filteredMetas.map((meta) => (
          <Card key={meta.id} className="shadow-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-foreground">{meta.metaDescricao}</h3>
                <p className="text-sm text-muted-foreground">{meta.responsavelNome} ({meta.tipoDaMeta})</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(meta.statusMeta)}>{meta.statusMeta}</Badge>
                <Button variant="ghost" size="sm" onClick={() => handleEditMeta(meta)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => deletarMeta(meta.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
              <div>
                <p className="text-muted-foreground">Período</p>
                <p className="font-medium">{new Date(meta.dataInicio + 'T00:00:00').toLocaleDateString('pt-BR')} a {new Date(meta.dataFinal + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Meta</p>
                <p className="font-medium">R$ {meta.valorMeta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Realizado</p>
                <p className="font-medium text-success">R$ {meta.valorRealizado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Progresso</span>
                <span className="font-medium">{meta.progresso.toFixed(1)}%</span>
              </div>
              <Progress value={meta.progresso} className="h-2" />
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Meta</DialogTitle>
          </DialogHeader>
          {editingMeta && (
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="edit-metaDescricao">Nome da Meta</Label>
                <Input
                  id="edit-metaDescricao"
                  value={editingMeta.metaDescricao}
                  onChange={(e) => setEditingMeta({ ...editingMeta, metaDescricao: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-valorMeta">Valor da Meta (R$)</Label>
                <Input
                  id="edit-valorMeta"
                  type="number"
                  value={editingMeta.valorMeta}
                  onChange={(e) => setEditingMeta({ ...editingMeta, valorMeta: Number(e.target.value) })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-dataInicio">Data Início</Label>
                  <Input
                    id="edit-dataInicio"
                    type="date"
                    value={editingMeta.dataInicio}
                    onChange={(e) => setEditingMeta({ ...editingMeta, dataInicio: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-dataFinal">Data Fim</Label>
                  <Input
                    id="edit-dataFinal"
                    type="date"
                    value={editingMeta.dataFinal}
                    onChange={(e) => setEditingMeta({ ...editingMeta, dataFinal: e.target.value })}
                  />
                </div>
              </div>
              <div className="p-3 bg-muted rounded-lg text-sm">
                  <p><strong>Tipo:</strong> {editingMeta.tipoDaMeta}</p>
                  <p><strong>Responsável:</strong> {editingMeta.responsavelNome}</p>
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={editingMeta.statusMeta}
                  onValueChange={(value) => setEditingMeta({ ...editingMeta, statusMeta: value })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PROCESSANDO">Em Andamento</SelectItem>
                    <SelectItem value="CONCLUIDA">Concluída</SelectItem>
                    <SelectItem value="FINALIZADA">Finalizada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Progresso Atual</h4>
                <div className="space-y-2">
                  <Progress value={editingMeta.progresso} />
                  <p className="text-center text-sm font-medium">
                    {editingMeta.progresso.toFixed(1)}% concluído
                  </p>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={atualizarMeta} className="flex-1">Salvar Alterações</Button>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}