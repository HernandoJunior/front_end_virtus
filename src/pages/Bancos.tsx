import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Building,
  Plus,
  Search,
  Edit,
  Trash2,
  DollarSign,
  TrendingUp,
  Users,
  FileText
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

export default function Bancos() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const bancos = [
    {
      id: 1,
      nome: "Banco Master",
      codigo: "MASTER",
      ativo: true,
      vendas: "R$ 845.200",
      operacoes: 245,
      comissaoReceber: "R$ 45.800",
      comissaoPagar: "R$ 23.400",
      configuracoes: {
        valorPago: true,
        producao: true,
        numeroOperacao: true,
        pesquisaCPF: true
      }
    },
    {
      id: 2,
      nome: "Banco do Brasil",
      codigo: "BB",
      ativo: true,
      vendas: "R$ 623.150",
      operacoes: 187,
      comissaoReceber: "R$ 34.200",
      comissaoPagar: "R$ 18.900",
      configuracoes: {
        valorPago: true,
        producao: true,
        numeroOperacao: false,
        pesquisaCPF: true
      }
    },
    {
      id: 3,
      nome: "Facta",
      codigo: "FACTA",
      ativo: true,
      vendas: "R$ 456.800",
      operacoes: 134,
      comissaoReceber: "R$ 25.600",
      comissaoPagar: "R$ 14.200",
      configuracoes: {
        valorPago: true,
        producao: false,
        numeroOperacao: true,
        pesquisaCPF: false
      }
    },
    {
      id: 4,
      nome: "C6 Bank",
      codigo: "C6",
      ativo: true,
      vendas: "R$ 378.450",
      operacoes: 98,
      comissaoReceber: "R$ 21.300",
      comissaoPagar: "R$ 12.100",
      configuracoes: {
        valorPago: false,
        producao: true,
        numeroOperacao: true,
        pesquisaCPF: true
      }
    },
    {
      id: 5,
      nome: "Daycoval",
      codigo: "DAYCOVAL",
      ativo: true,
      vendas: "R$ 289.300",
      operacoes: 76,
      comissaoReceber: "R$ 16.800",
      comissaoPagar: "R$ 9.400",
      configuracoes: {
        valorPago: true,
        producao: true,
        numeroOperacao: false,
        pesquisaCPF: true
      }
    },
    {
      id: 6,
      nome: "Banco Pan",
      codigo: "PAN",
      ativo: true,
      vendas: "R$ 234.600",
      operacoes: 65,
      comissaoReceber: "R$ 13.500",
      comissaoPagar: "R$ 7.800",
      configuracoes: {
        valorPago: true,
        producao: false,
        numeroOperacao: true,
        pesquisaCPF: false
      }
    },
    {
      id: 7,
      nome: "Santander",
      codigo: "SANTANDER",
      ativo: true,
      vendas: "R$ 198.750",
      operacoes: 52,
      comissaoReceber: "R$ 11.200",
      comissaoPagar: "R$ 6.300",
      configuracoes: {
        valorPago: false,
        producao: true,
        numeroOperacao: false,
        pesquisaCPF: true
      }
    },
    {
      id: 8,
      nome: "Qualy",
      codigo: "QUALY",
      ativo: false,
      vendas: "R$ 89.400",
      operacoes: 23,
      comissaoReceber: "R$ 5.600",
      comissaoPagar: "R$ 2.800",
      configuracoes: {
        valorPago: true,
        producao: false,
        numeroOperacao: true,
        pesquisaCPF: false
      }
    }
  ];

  const filteredBancos = bancos.filter(banco =>
    banco.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    banco.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalVendas = bancos.reduce((sum, banco) => {
    const valor = parseFloat(banco.vendas.replace(/[R$\s.]/g, '').replace(',', '.'));
    return sum + valor;
  }, 0);

  const bancosAtivos = bancos.filter(banco => banco.ativo).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bancos</h1>
          <p className="text-muted-foreground">
            Gerencie bancos parceiros e suas configurações
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Banco
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Banco</DialogTitle>
              <DialogDescription>
                Configure um novo banco parceiro no sistema
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome do Banco</Label>
                <Input id="nome" placeholder="Ex: Banco do Brasil" />
              </div>
              <div>
                <Label htmlFor="codigo">Código</Label>
                <Input id="codigo" placeholder="Ex: BB" />
              </div>
              <div className="col-span-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea id="descricao" placeholder="Detalhes sobre o banco..." />
              </div>
              
              <div className="col-span-2">
                <Label className="text-base font-semibold">Configurações do Banco</Label>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div className="flex items-center space-x-2">
                    <Switch id="valorPago" defaultChecked />
                    <Label htmlFor="valorPago">Valores Pagos</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="producao" defaultChecked />
                    <Label htmlFor="producao">Produção</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="numeroOperacao" defaultChecked />
                    <Label htmlFor="numeroOperacao">Número da Operação</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="pesquisaCPF" defaultChecked />
                    <Label htmlFor="pesquisaCPF">Pesquisa por CPF</Label>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 col-span-2">
                <Switch id="ativo" defaultChecked />
                <Label htmlFor="ativo">Banco ativo no sistema</Label>
              </div>
              
              <div className="flex gap-2 pt-4 col-span-2">
                <Button onClick={() => setIsDialogOpen(false)} className="flex-1">
                  Cadastrar Banco
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
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
            <CardTitle className="text-sm font-medium">Total de Bancos</CardTitle>
            <Building className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bancos.length}</div>
            <p className="text-xs text-muted-foreground">Cadastrados</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bancos Ativos</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{bancosAtivos}</div>
            <p className="text-xs text-muted-foreground">{Math.round((bancosAtivos/bancos.length)*100)}% do total</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vendas</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalVendas.toLocaleString('pt-BR', {minimumFractionDigits: 0})}</div>
            <p className="text-xs text-muted-foreground">Acumulado</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Operações</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bancos.reduce((sum, banco) => sum + banco.operacoes, 0)}</div>
            <p className="text-xs text-muted-foreground">Total processadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nome ou código do banco..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Bancos */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Lista de Bancos Parceiros</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Banco</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Comissões</TableHead>
                <TableHead>Configurações</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBancos.map((banco) => (
                <TableRow key={banco.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{banco.nome}</p>
                      <p className="text-sm text-muted-foreground">
                        Código: {banco.codigo}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{banco.vendas}</p>
                      <p className="text-xs text-muted-foreground">
                        {banco.operacoes} operações
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm text-success">
                        ↓ {banco.comissaoReceber}
                      </p>
                      <p className="text-sm text-destructive">
                        ↑ {banco.comissaoPagar}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {banco.configuracoes.valorPago && (
                        <Badge variant="secondary" className="text-xs">Valores</Badge>
                      )}
                      {banco.configuracoes.producao && (
                        <Badge variant="secondary" className="text-xs">Produção</Badge>
                      )}
                      {banco.configuracoes.numeroOperacao && (
                        <Badge variant="secondary" className="text-xs">Nº Op</Badge>
                      )}
                      {banco.configuracoes.pesquisaCPF && (
                        <Badge variant="secondary" className="text-xs">CPF</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${banco.ativo ? 'bg-success' : 'bg-destructive'}`}></div>
                      <span className="text-sm">{banco.ativo ? 'Ativo' : 'Inativo'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}