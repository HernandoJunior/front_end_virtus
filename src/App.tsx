import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {  Route } from "react-router-dom";
import { CrmLayout } from "@/components/CrmLayout";
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes/Clientes";
import Propostas from "./pages/Propostas/Propostas";
import Vendas from "./pages/Vendas/Vendas";
import Metas from "./pages/Metas";
import Relatorios from "./pages/Relatorios";
import Usuarios from "./pages/Usuarios/Usuarios";
import Bancos from "./pages/Bancos";
import Configuracoes from "./pages/Configuracoes";
import Carteiras from "./pages/Carteira/Carteiras";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import  { Routes }  from './Routes'
import { AuthProvider } from './hooks/auth'
import { BrowserRouter } from "react-router-dom";



const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
        <AuthProvider>
          <Routes /> 
        </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
