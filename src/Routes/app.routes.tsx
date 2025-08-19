import { Routes, Route } from 'react-router-dom';
import { CrmLayout } from "@/components/CrmLayout";
//Pages
import Bancos from '../pages/Bancos'
import  Carteiras  from '../pages/Carteiras'
import  Clientes  from '../pages/Clientes'
import  Configuracoes  from '../pages/Configuracoes'
import  Dashboard  from '../pages/Dashboard';
import  Index  from '../pages/Index';
import  Metas  from '../pages/Metas';
import  NotFound  from '../pages/NotFound';
import  Propostas  from '../pages/Propostas';
import  Relatorios  from '../pages/Relatorios';
import  Usuarios  from '../pages/Usuarios';
import  Vendas  from '../pages/Vendas';
import  Login  from '../pages/Login';
import ClienteDetalhes from "../pages/ClientesDetalhes";
import ClientePropostas from "../pages/ClientesPropostas";
import SupervisorCarteira from "../pages/SupervisorCarteira";

export function AppRoutes(){
  return (
    <Routes>
      {/* Menu principal */}
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<CrmLayout><Dashboard /></CrmLayout>} />
      <Route path="/bancos" element={<CrmLayout><Bancos /></CrmLayout>} />
      <Route path="/carteiras" element={<CrmLayout><Carteiras /></CrmLayout>} />
      <Route path="/clientes" element={<CrmLayout><Clientes /></CrmLayout>} />
      <Route path="/configuracoes" element={<CrmLayout><Configuracoes /></CrmLayout>} />
      <Route path="/index" element={<CrmLayout><Index /></CrmLayout>} />
      <Route path="/metas" element={<CrmLayout><Metas /></CrmLayout>} />
      <Route path="/notfound" element={<CrmLayout><NotFound /></CrmLayout>} />
      <Route path="/propostas" element={<CrmLayout><Propostas /></CrmLayout>} />
      <Route path="/relatorios" element={<CrmLayout><Relatorios /></CrmLayout>} />
      <Route path="/usuarios" element={<CrmLayout><Usuarios /></CrmLayout>} />
      <Route path="/vendas" element={<CrmLayout><Vendas /></CrmLayout>} />
      
      {/* SUBMENU */}
      <Route path='/clientes/:id/propostas' element={<CrmLayout><ClientePropostas /></CrmLayout>}></Route>
      <Route path='/clientes/:id' element={<CrmLayout><ClienteDetalhes /></CrmLayout>}></Route>
      <Route path='/carteiras/:supervisorId' element={<CrmLayout><SupervisorCarteira /></CrmLayout>}></Route>
    </Routes>
  )
}