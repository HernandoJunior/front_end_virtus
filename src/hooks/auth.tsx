// src/hooks/auth.tsx (NÃO auth.routes.tsx!)
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "../services/api";

interface User {
  ID_ADMINISTRADOR?: number;
  ID_SUPERVISOR?: number;
  ID_COLABORADOR?: number;
  nome: string;
  email: string;
  role: string;
  cpf?: string;
  telefone?: string;
}

interface SignInCredentials {
  email: string;
  senha: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Verifica se o usuário está autenticado ao carregar a aplicação
  async function checkAuth() {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function signIn({ email, senha }: SignInCredentials) {
    try {
      const response = await api.post("/auth/login", { email, senha });

      // O token já está no cookie httpOnly
      // A API retorna apenas os dados públicos do usuário
      const { user } = response.data;

      setUser(user);
      
      // Não precisa de navigate aqui, o Routes vai redirecionar automaticamente
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || "Informações incorretas");
      } else {
        throw new Error("Não foi possível entrar. Verifique sua conexão.");
      }
    }
  }

  async function signOut() {
    try {
      // Chama o endpoint de logout para revogar o refresh token
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setUser(null);
      // Não precisa de navigate, o Routes vai redirecionar automaticamente
    }
  }

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, checkAuth }}>
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