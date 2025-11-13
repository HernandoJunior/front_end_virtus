import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Edit, Save, X, ArrowLeft, DollarSign } from "lucide-react";
import { api } from "@/services/api";
import { formatCurrency } from "@/utils/formatter";

export default function VendaDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [venda, setVenda] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [currentUser, setCurrentUser] = useState({ role: null, id: null });

  // Efeito para buscar dados do usuário logado do localStorage
  useEffect(() => {
    const userDataString = localStorage.getItem("@virtus:user");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setCurrentUser({ role: userData.role, id: userData.id });
    }
  }, []);

  useEffect(() => {
    async function fetchSale() {
      if (!id) return;

      setLoading(true);
      let userData = null;

      try {
        const response = await api.get(`/vendas/buscarVenda/${id}`);
        if (response.data) {
          userData = response.data;
          setVenda(userData);
          setFormData(userData);
        }
      } catch (error) {
        console.error("Venda não encontrada.");
        setVenda(null);
      } finally {
        setLoading(false);
      }
    }
    fetchSale();
  }, [id]);

  useEffect(() => {
    if (venda) {
      document.title = `Venda: ${venda.cliente?.nome || "Detalhes"} | Virtus`;
    } else {
      document.title = `Detalhes da Venda | Virtus`;
    }
  }, [venda]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSaveChanges = async () => {
    if (!venda) {
      alert("Não foi possível identificar o perfil da venda para salvar.");
      return;
    }
    try {
      await api.put(`/vendas/atualizarVenda/${venda.ID_VENDA}`, formData);
      setVenda(formData);
      setIsEditing(false);
      alert("Venda atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
      alert("Não foi possível salvar as alterações. Tente novamente.");
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Carregando...</div>;
  }

  if (!venda) {
    return (
      <div className="p-4 space-y-4 text-center">
        <h1 className="text-3xl font-bold text-foreground">
          Venda não encontrada
        </h1>
        <p className="text-muted-foreground">
          A venda com o ID "{id}" não foi localizada no sistema.
        </p>
        <Button variant="outline" onClick={() => navigate("/vendas")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para a lista
        </Button>
      </div>
    );
  }

  // Função para verificar se o usuário pode ver informações de comissão
  const canViewCommission = () => {
    // ADMIN e SUPERVISOR podem ver todas as comissões
    if (["ADMIN", "SUPERVISOR"].includes(currentUser.role)) {
      return true;
    }
    
    // USER só pode ver se for o colaborador da venda
    if (currentUser.role === "USER" && venda.colaborador) {
      return venda.colaborador.id === currentUser.id;
    }
    
    return false;
  };

  // A comissão líquida é o valor que vem do backend já calculado:
  // MEI: 35% da comissão da empresa
  // CLT: 27% da comissão da empresa
  const calcularComissaoLiquida = () => {
    if (!venda.colaborador || !venda.comissaoColaborador) {
      return 0;
    }
    console.log(venda.comissaoColaborador)
    return venda.comissaoColaborador;
  };

  const renderField = (label, name, value, type = "text") => (
    <div className="flex flex-col">
      <span className="text-sm text-muted-foreground">{label}</span>
      {isEditing ? (
        <Input
          name={name}
          value={formData[name] || ""}
          onChange={handleInputChange}
          type={type}
          className="font-medium"
        />
      ) : (
        <span className="font-medium">{value || "Não informado"}</span>
      )}
    </div>
  );

  return (
    <div className="p-4 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Detalhes da Venda
          </h1>
          <p className="text-muted-foreground">
            {isEditing
              ? "Modo de edição ativado"
              : "Informações completas da venda"}
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleSaveChanges}>
                <Save className="h-4 w-4 mr-2" /> Salvar
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4 mr-2" /> Cancelar
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" /> Editar
              </Button>
              <Button variant="outline" onClick={() => navigate("/vendas")}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
              </Button>
            </>
          )}
        </div>
      </header>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" /> Informações da Venda
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b pb-2">
              Identificação
            </h3>
            <div className="space-y-3">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">
                  ID da Venda
                </span>
                <span className="font-medium">{id}</span>
              </div>
              {renderField(
                "Nome do Colaborador",
                "nomeColaborador",
                venda.colaborador
                  ? venda.colaborador.nome
                  : "Venda do Supervisor"
              )}
              {renderField(
                "Nome do Supervisor",
                "nomeSupervisor",
                venda.nomeSupervisor
              )}
              {renderField(
                "Nome do Cliente",
                "nomeCliente",
                venda.cliente?.nome
              )}
              {renderField("CPF do Cliente", "cpfCliente", venda.cliente?.cpf)}
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b pb-2">
              Informações
            </h3>
            <div className="space-y-3">
              {renderField("Banco", "banco", venda.banco)}
              {renderField("Linha de Venda", "linha_venda", venda.linha_venda)}
              {renderField("Cidade da Venda", "cidadeVenda", venda.cidadeVenda)}
              {renderField("Promotora", "promotora", venda.promotora)}
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b pb-2">
              Dados Financeiros
            </h3>
            <div className="space-y-3">
              {renderField(
                "Valor Liberado",
                "valorLiberado",
                formatCurrency(venda.valorLiberado)
              )}
              {renderField("Prazo", "prazo", venda.prazo)}
              {renderField("Taxa", "taxa", `${venda.taxa}%`)}
              {renderField(
                "Data de Pagamento",
                "dataPagamento",
                venda.dataPagamento,
                "date"
              )}
              {renderField(
                "Produto Venda",
                "produtoVenda",
                venda.produtoVenda
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" /> Informações de Comissão
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!canViewCommission() ? (
            <div className="p-6 text-center bg-muted rounded-lg">
              <p className="text-muted-foreground">
                🔒 Você não tem permissão para visualizar as informações de comissão desta venda.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Card: Regime de Contratação */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Regime de Contratação
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {venda.colaborador
                        ? venda.colaborador.regimeContratacao
                        : "N/A"}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Tipo de vínculo
                    </p>
                  </CardContent>
                </Card>

                {/* Card: Percentual de Comissão */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Percentual de Comissão
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {venda.colaborador
                        ? venda.colaborador.regimeContratacao === "MEI"
                          ? "35%"
                          : venda.colaborador.regimeContratacao === "CLT"
                          ? "27%"
                          : "N/A"
                        : "N/A"}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Sobre a comissão da empresa
                    </p>
                  </CardContent>
                </Card>

                {/* Card: Comissão Líquida do Colaborador */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Comissão do Colaborador
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {venda.colaborador
                        ? formatCurrency(calcularComissaoLiquida())
                        : "N/A"}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Valor a receber
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Informações adicionais */}
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Detalhamento da Comissão
                </h4>
                <div className="space-y-2 text-sm">
                  {["ADMIN", "SUPERVISOR"].includes(currentUser.role) && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Comissão da Empresa:</span>
                        <span className="font-medium">
                          {formatCurrency(venda.comissaoEmpresa || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Percentual do Colaborador ({venda.colaborador?.regimeContratacao === "MEI" ? "35%" : "27%"}):
                        </span>
                        <span className="font-medium">
                          {formatCurrency(calcularComissaoLiquida())}
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t">
                        <span className="font-semibold">Comissao Liquida Empresa:</span>
                        <span className="font-bold">
                          {formatCurrency(
                            calcularComissaoLiquida()
                          )}
                        </span>
                      </div>
                    </>
                  )}
                  {currentUser.role === "USER" && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sua Comissão:</span>
                      <span className="font-medium text-green-600 text-lg">
                        {formatCurrency(calcularComissaoLiquida())}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {!venda.colaborador && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Esta venda foi realizada diretamente pelo supervisor e não possui colaborador associado.
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}