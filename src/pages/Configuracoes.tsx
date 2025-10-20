import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Settings,
  Save,
  Building2,
  FileSpreadsheet,
  Users,
  Shield,
  Mail,
  Database,
  Upload
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function Configuracoes() {
  const [configuracoes, setConfiguracoes] = useState({
    empresa: {
      nome: "Virtus Consultoria Financeira",
      cnpj: "12.345.678/0001-90",
      endereco: "Rua das Flores, 123",
      cidade: "São Paulo",
      estado: "SP",
      telefone: "(11) 3456-7890",
      email: "contato@virtus.com.br"
    },
    sistema: {
      emailNotificacoes: true,
      backupAutomatico: true,
      relatorioDiario: true,
      logAuditoria: true
    },
    planilhas: {
      tipoINSS: "padrao",
      tipoGOVBA: "simplificado",
      tipoGOVSP: "completo",
      tipoPREFSP: "padrao",
      tipoCLT: "detalhado"
    }
  });

  const handleSave = () => {
    // Implementar salvamento das configurações
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie as configurações do sistema e da empresa
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Salvar Alterações
        </Button>
      </div>

      <Tabs defaultValue="empresa" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="empresa">Empresa</TabsTrigger>
          <TabsTrigger value="sistema">Sistema</TabsTrigger>
          <TabsTrigger value="planilhas">Planilhas</TabsTrigger>
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
        </TabsList>

        {/* Configurações da Empresa */}
        <TabsContent value="empresa">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Dados da Empresa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nomeEmpresa">Nome da Empresa</Label>
                  <Input
                    id="nomeEmpresa"
                    value={configuracoes.empresa.nome}
                    onChange={(e) => setConfiguracoes(prev => ({
                      ...prev,
                      empresa: { ...prev.empresa, nome: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    value={configuracoes.empresa.cnpj}
                    onChange={(e) => setConfiguracoes(prev => ({
                      ...prev,
                      empresa: { ...prev.empresa, cnpj: e.target.value }
                    }))}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    value={configuracoes.empresa.endereco}
                    onChange={(e) => setConfiguracoes(prev => ({
                      ...prev,
                      empresa: { ...prev.empresa, endereco: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                    id="cidade"
                    value={configuracoes.empresa.cidade}
                    onChange={(e) => setConfiguracoes(prev => ({
                      ...prev,
                      empresa: { ...prev.empresa, cidade: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="estado">Estado</Label>
                  <Select value={configuracoes.empresa.estado} onValueChange={(value) => 
                    setConfiguracoes(prev => ({
                      ...prev,
                      empresa: { ...prev.empresa, estado: value }
                    }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SP">São Paulo</SelectItem>
                      <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                      <SelectItem value="MG">Minas Gerais</SelectItem>
                      <SelectItem value="BA">Bahia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={configuracoes.empresa.telefone}
                    onChange={(e) => setConfiguracoes(prev => ({
                      ...prev,
                      empresa: { ...prev.empresa, telefone: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={configuracoes.empresa.email}
                    onChange={(e) => setConfiguracoes(prev => ({
                      ...prev,
                      empresa: { ...prev.empresa, email: e.target.value }
                    }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações do Sistema */}
        <TabsContent value="sistema">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Configurações do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Notificações</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="emailNotif">Notificações por E-mail</Label>
                        <p className="text-sm text-muted-foreground">
                          Receber notificações de vendas e alterações importantes
                        </p>
                      </div>
                      <Switch
                        id="emailNotif"
                        checked={configuracoes.sistema.emailNotificacoes}
                        onCheckedChange={(checked) => setConfiguracoes(prev => ({
                          ...prev,
                          sistema: { ...prev.sistema, emailNotificacoes: checked }
                        }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="relatorio">Relatório Diário</Label>
                        <p className="text-sm text-muted-foreground">
                          Enviar resumo diário de vendas por e-mail
                        </p>
                      </div>
                      <Switch
                        id="relatorio"
                        checked={configuracoes.sistema.relatorioDiario}
                        onCheckedChange={(checked) => setConfiguracoes(prev => ({
                          ...prev,
                          sistema: { ...prev.sistema, relatorioDiario: checked }
                        }))}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Segurança e Auditoria</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="backup">Backup Automático</Label>
                        <p className="text-sm text-muted-foreground">
                          Realizar backup automático dos dados diariamente
                        </p>
                      </div>
                      <Switch
                        id="backup"
                        checked={configuracoes.sistema.backupAutomatico}
                        onCheckedChange={(checked) => setConfiguracoes(prev => ({
                          ...prev,
                          sistema: { ...prev.sistema, backupAutomatico: checked }
                        }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="auditoria">Log de Auditoria</Label>
                        <p className="text-sm text-muted-foreground">
                          Registrar todas as ações dos usuários no sistema
                        </p>
                      </div>
                      <Switch
                        id="auditoria"
                        checked={configuracoes.sistema.logAuditoria}
                        onCheckedChange={(checked) => setConfiguracoes(prev => ({
                          ...prev,
                          sistema: { ...prev.sistema, logAuditoria: checked }
                        }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações de Planilhas */}
        <TabsContent value="planilhas">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
                Padronização de Planilhas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Configure os tipos de planilhas para cada órgão/convênio
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="inss">INSS - Tipo de Planilha</Label>
                      <Select 
                        value={configuracoes.planilhas.tipoINSS}
                        onValueChange={(value) => setConfiguracoes(prev => ({
                          ...prev,
                          planilhas: { ...prev.planilhas, tipoINSS: value }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="padrao">Padrão INSS</SelectItem>
                          <SelectItem value="simplificado">Simplificado</SelectItem>
                          <SelectItem value="detalhado">Detalhado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="govba">GOV BA - Tipo de Planilha</Label>
                      <Select 
                        value={configuracoes.planilhas.tipoGOVBA}
                        onValueChange={(value) => setConfiguracoes(prev => ({
                          ...prev,
                          planilhas: { ...prev.planilhas, tipoGOVBA: value }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="padrao">Padrão GOV BA</SelectItem>
                          <SelectItem value="simplificado">Simplificado</SelectItem>
                          <SelectItem value="detalhado">Detalhado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="govsp">GOV SP - Tipo de Planilha</Label>
                      <Select 
                        value={configuracoes.planilhas.tipoGOVSP}
                        onValueChange={(value) => setConfiguracoes(prev => ({
                          ...prev,
                          planilhas: { ...prev.planilhas, tipoGOVSP: value }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="padrao">Padrão GOV SP</SelectItem>
                          <SelectItem value="simplificado">Simplificado</SelectItem>
                          <SelectItem value="completo">Completo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="prefsp">PREF SP - Tipo de Planilha</Label>
                      <Select 
                        value={configuracoes.planilhas.tipoPREFSP}
                        onValueChange={(value) => setConfiguracoes(prev => ({
                          ...prev,
                          planilhas: { ...prev.planilhas, tipoPREFSP: value }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="padrao">Padrão PREF SP</SelectItem>
                          <SelectItem value="simplificado">Simplificado</SelectItem>
                          <SelectItem value="detalhado">Detalhado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="clt">CLT - Tipo de Planilha</Label>
                      <Select 
                        value={configuracoes.planilhas.tipoCLT}
                        onValueChange={(value) => setConfiguracoes(prev => ({
                          ...prev,
                          planilhas: { ...prev.planilhas, tipoCLT: value }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="padrao">Padrão CLT</SelectItem>
                          <SelectItem value="simplificado">Simplificado</SelectItem>
                          <SelectItem value="detalhado">Detalhado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-lg font-semibold mb-4">Templates de Planilhas</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Upload de Templates</p>
                        <p className="text-sm text-muted-foreground">
                          Faça upload dos templates personalizados para cada tipo de planilha
                        </p>
                      </div>
                      <Button variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações de Usuários */}
        <TabsContent value="usuarios">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Configurações de Usuários
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Administradores do Sistema</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Carlos Lima</p>
                        <p className="text-sm text-muted-foreground">carlos.lima@virtus.com</p>
                      </div>
                      <Badge>Administrador Principal</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Gilney Filho</p>
                        <p className="text-sm text-muted-foreground">gilney.filho@virtus.com</p>
                      </div>
                      <Badge variant="secondary">Administrador</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Políticas de Acesso</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="sessao">Tempo de Sessão (horas)</Label>
                      <Input id="sessao" type="number" defaultValue="8" className="w-32" />
                    </div>
                    <div>
                      <Label htmlFor="tentativas">Máximo de Tentativas de Login</Label>
                      <Input id="tentativas" type="number" defaultValue="3" className="w-32" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="2fa" />
                      <Label htmlFor="2fa">Exigir autenticação de dois fatores</Label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações de Backup */}
        <TabsContent value="backup">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Backup e Recuperação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Configurações de Backup</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Frequência do Backup</Label>
                      <Select defaultValue="diario">
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="diario">Diário</SelectItem>
                          <SelectItem value="semanal">Semanal</SelectItem>
                          <SelectItem value="mensal">Mensal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="horario">Horário do Backup</Label>
                      <Input id="horario" type="time" defaultValue="02:00" className="w-32" />
                    </div>
                    <div>
                      <Label htmlFor="retencao">Retenção (dias)</Label>
                      <Input id="retencao" type="number" defaultValue="30" className="w-32" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-lg font-semibold mb-4">Ações de Backup</h3>
                  <div className="flex gap-4">
                    <Button>
                      <Database className="h-4 w-4 mr-2" />
                      Backup Manual
                    </Button>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Restaurar Backup
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-lg font-semibold mb-4">Últimos Backups</h3>
                  <div className="space-y-2">
                    {[
                      { data: "24/01/2024 02:00", tamanho: "245 MB", status: "Sucesso" },
                      { data: "23/01/2024 02:00", tamanho: "243 MB", status: "Sucesso" },
                      { data: "22/01/2024 02:00", tamanho: "241 MB", status: "Sucesso" }
                    ].map((backup, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{backup.data}</p>
                          <p className="text-sm text-muted-foreground">{backup.tamanho}</p>
                        </div>
                        <Badge variant="secondary">{backup.status}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}