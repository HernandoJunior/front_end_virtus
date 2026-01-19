// src/Routes/index.tsx
import { useAuth } from "../hooks/auth";
import { AppRoutes } from "./app.routes";
import { AuthRoutes } from "./auth.routes";
import { Building2 } from "lucide-react";

export function Routes() {
  const { user, loading } = useAuth();

  // Mostra loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Building2 className="h-16 w-16 text-primary mx-auto animate-pulse" />
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return user ? <AppRoutes /> : <AuthRoutes />;
}