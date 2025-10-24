import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

// Tipagem para o usuário — adicione mais campos conforme o retorno da sua API
interface User {
  id: string;
  name: string;
  email: string;
}

// Tipagem para as credenciais de login
interface SignInCredentials {
  email: string;
  senha: string;
}

// Tipagem para o contexto de autenticação
interface AuthContextType {
  user: User | null;
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => void;
}

// Criar o contexto com tipo explícito
export const AuthContext = createContext<AuthContextType | null>(null);

// Tipagem para o AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate();
  const [data, setData] = useState<{ user: User | null; token?: string }>({ user: null });
  
  async function signIn({ email, senha }: SignInCredentials) {
    try {
      const response = await api.post("/auth/login", { email, senha });

      if(response){
        alert("Login efetuado com sucesso!")
      }

      // CORREÇÃO: Capturar o 'user' e o 'token' da resposta.
      const { user, token } = response.data;
      
      // Guardar ambos no localStorage para persistir o login.
      localStorage.setItem("@virtus:token", token);
      localStorage.setItem("@virtus:user", JSON.stringify(user));

      // Configurar o cabeçalho padrão para futuras requisições.
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Atualizar o estado com ambos os dados para acionar a renderização.
      setData({ user, token });

      navigate("/dashboard")

    } catch (error: any) {
      if (error.response) {
        alert("Informacoes incorretas, tente novamente!")
      } else {
        alert("Não foi possível entrar.");
      }
    }
  }

  function signOut() {
    localStorage.removeItem("@virtus:token");
    localStorage.removeItem("@virtus:user");
    setData({ user: null });
    navigate("/")
  }

  useEffect(() => {
    const token = localStorage.getItem("@virtus:token");
    const storedUser = localStorage.getItem("@virtus:user");

    if (token && storedUser) {
      const user: User = JSON.parse(storedUser);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setData({ user, token });
    }

    // Configurar interceptor para detectar token expirado
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        // Se o erro for 401 (não autorizado) ou 403 (token expirado)
        if (error.response?.status === 401 || error.response?.status === 403) {
          // Limpar localStorage automaticamente
          localStorage.removeItem("@virtus:token");
          localStorage.removeItem("@virtus:user");
          
          // Limpar estado
          setData({ user: null });
          
          // Redirecionar para login
          navigate("/");
          
          // Opcional: mostrar mensagem ao usuário
          alert("Sessão expirada. Faça login novamente.");
        }
        return Promise.reject(error);
      }
    );

    // Cleanup: remover interceptor quando o componente desmontar
    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth };