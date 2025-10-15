import { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
  MemoryRouter,
  Routes,
  Route,
} from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Edit, Save, X, ArrowLeft, DollarSign } from "lucide-react";
import { api } from "@/services/api";
import { KPICard } from "@/components/DashboardKPI";
import { formatCurrency } from "@/utils/formatter";


export default function vendaDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [venda, setVenda] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const [listColaboratorsAtSupervisors, setListColaboratorsAtSupervisors] =
    useState([]);

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
          console.log(response.data);
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
      document.title = `Venda: ${venda.nome} | Virtus`;
    } else {
      document.title = `Detalhes do Venda | Virtus`;
    }
  }, [venda]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSaveChanges = async () => {
    if (!venda) {
      alert("Não foi possível identificar o perfil do venda para salvar.");
      return;
    }
    try {
      await api.put(`/vendas/atualizarVenda/${venda.ID_VENDA}`, formData);
      setVenda(formData);
      console.log(formData);
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
          A venda com o ID "{id}" não foi localizado no sistema.
        </p>
        <Button variant="outline" onClick={() => navigate("/vendas")}>
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
                venda.colaborador ? venda.colaborador.nome : "Colaborador nao registrado"
              )}
              {renderField(
                "Nome do Supervisor",
                "nomeSupervisor",
                venda.nomeSupervisor
              )}
              {renderField(
                "Nome do Cliente",
                "nomeCliente",
                venda.cliente.nome
              )}
              {renderField("Cpf do Cliente", "cpfCliente", venda.cliente.cpf)}
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b pb-2">
              Informaçoes
            </h3>
            <div className="space-y-3">
              {renderField("Banco", "banco", venda.banco)}
              {renderField("Agente", "agente", venda.agente)}
              {renderField(
                "Linha de Operacao",
                "linhaOperacao",
                venda.linhaOperacao
              )}
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
                "Valor Venda",
                "valorLiberado",
                formatCurrency(venda.valorLiberado),
                "valorLiberado"
              )}
              {renderField("Prazo", "prazo", venda.prazo, "prazo")}
              {renderField("Taxa", "taxa", `${venda.taxa} %`, "taxa")}
              {renderField(
                "Data de Pagamento",
                "dataPagamento",
                venda.dataPagamento,
                "date"
              )}
              {renderField(
                "Produto Venda",
                "produtoVenda",
                venda.produtoVenda,
                "produtoVenda"
              )}
            </div>
          </div>

        </CardContent>
      </Card>

            <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" /> Informações da Comissao
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground border-b pb-2">
              Dados da Comissao
            </h3>
            <div className="space-y-3">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">
                  Regime de Contratacao
                </span>
                <span className="font-medium">{venda.colaborador ? venda.colaborador.regimeContratacao : "Colaborador nao registrado"}</span>

                <span className="text-sm text-muted-foreground">
                  Porcentagem de comissao
                </span>
                <span className="font-medium">{venda.colaborador ? 
                venda.colaborador.regimeContratacao.includes("MEI") ? "35%" : "27%"
                  : "Colaborador nao registrado" }</span>

                <span className="text-sm text-muted-foreground">
                  Comissao Bruta
                </span>
                <span className="font-medium">{venda.comissaoColaborador ? formatCurrency(venda.comissaoColaborador) : "Colaborador nao registrado"}</span>

                <span className="text-sm text-muted-foreground">
                  Comissao Liquida
                </span>
                <span className="font-medium">
                  {venda.colaborador ? venda.colaborador.regimeContratacao.includes("MEI") ? 
                  formatCurrency(venda.comissaoColaborador * 0.35) :
                  formatCurrency(venda.comissaoColaborador * 0.27) : "Colaborador nao registrado"}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
