import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2 } from "lucide-react";
import { useAuth } from '../hooks/auth'
import { api } from '../services/api'
import { useNavigate } from "react-router-dom";



export default function Auth() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [registerForm, setRegisterForm] = useState({
    nome: "",
    email: "",
    cpf: "",
    senha: "",
    role: ""
  });

  const handleLogin = (event) => {
    event.preventDefault();
    async function login() {
      try {
        const response = await signIn({ email , senha })
      } catch (error) {
        alert(error)
        navigate("/")
      }
  }

  login()
    
  };

  async function handleRegister () {
    if(!registerForm.cpf || !registerForm.email || !registerForm.nome || !registerForm.role || !registerForm.senha){
      return alert("Preencha todos os campos")
    }
    const response = await api.post("/administrador/create", registerForm)
    .then(() => {
      alert("Usuario cadastrado com sucesso!");
    })
    .catch(error => {
      if(error.response){
        alert(error.response.data.message)
      } else {
        alert("Erro ao cadastrar o usuário")
        console.log(error)
        console.log(registerForm)
      }
    })
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Building2 className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold text-foreground">Virtus CRM</span>
          </div>
          <p className="text-muted-foreground">Sistema de gestão empresarial</p>
        </div>

        {/* Formulários */}
        <Card className="shadow-lg">
          <Tabs defaultValue="login" className="w-full">
            
            {/* Formulário de Login */}
            <TabsContent value="login">
              <CardHeader>
                <CardTitle>Entrar na conta</CardTitle>
                <CardDescription>
                  Digite suas credenciais para acessar o sistema
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail( e.target.value )}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Senha</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Digite sua senha"
                      value={senha}
                      onChange={(e) => setSenha( e.target.value )}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full">
                    Entrar
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}