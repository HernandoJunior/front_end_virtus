import { Routes, Route } from 'react-router-dom';
import { CrmLayout } from "@/components/CrmLayout";
//Pages
import Bancos from '../pages/Bancos'
import  Carteiras  from '../pages/Carteira/Carteiras'
import CarteiraDetalhes from '../pages/Carteira/CarteiraDetalhes'
import  Clientes  from '../pages/Clientes/Clientes'
import  Configuracoes  from '../pages/Configuracoes'
import  Dashboard  from '../pages/Dashboard';
import  Index  from '../pages/Index';
import  Metas  from '../pages/Metas';
import  NotFound  from '../pages/NotFound';
import  Propostas  from '../pages/Propostas/Propostas';
import  PropostaDetalhes from '../pages/Propostas/PropostaDetalhes'
import  Relatorios  from '../pages/Relatorios';
import  Usuarios  from '../pages/Usuarios/Usuarios';
import  UsuariosDetalhes  from '../pages/Usuarios/UsuariosDetalhes';
import  Vendas  from '../pages/Vendas/Vendas';
import  VendasSection  from '../pages/Vendas/VendasSection';
import  Login  from '../pages/Login';
import ClienteDetalhes from "../pages/Clientes/ClientesDetalhes";
import ClientePropostas from "../pages/Clientes/ClientesPropostas";
import SupervisorCarteira from "../pages/Carteira/SupervisorCarteira";

export function AppRoutes(){
  return (
    <Routes>
      {/* Menu principal */}
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<CrmLayout><Dashboard /></CrmLayout>} />
      <Route path="/bancos" element={<CrmLayout><Bancos /></CrmLayout>} />
      <Route path="/clientes" element={<CrmLayout><Clientes /></CrmLayout>} />
      <Route path="/configuracoes" element={<CrmLayout><Configuracoes /></CrmLayout>} />
      <Route path="/index" element={<CrmLayout><Index /></CrmLayout>} />
      <Route path="/metas" element={<CrmLayout><Metas /></CrmLayout>} />
      <Route path="/notfound" element={<CrmLayout><NotFound /></CrmLayout>} />

      <Route path="/carteiras" element={<CrmLayout><Carteiras /></CrmLayout>} />
      <Route path="/carteiras/:id" element={<CrmLayout><SupervisorCarteira /></CrmLayout>} />


      <Route path="/propostas" element={<CrmLayout><Propostas /></CrmLayout>} />
      <Route path="/proposta/:id" element={<CrmLayout><PropostaDetalhes /> </CrmLayout>} />


      <Route path="/relatorios" element={<CrmLayout><Relatorios /></CrmLayout>} />


      <Route path="/vendas" element={<CrmLayout><Vendas /></CrmLayout>} />
      <Route path="/vendas/:id" element={<CrmLayout><VendasSection/></CrmLayout>} />


      <Route path="/usuarios" element={<CrmLayout><Usuarios /></CrmLayout>} />
      <Route path="/usuarios/:role/:id" element={<CrmLayout><UsuariosDetalhes/></CrmLayout>} ></Route>
      
      
      {/* SUBMENU */}
      <Route path='/clientes/:id/propostas' element={<CrmLayout><ClientePropostas /></CrmLayout>}></Route>
      <Route path='/clientes/:id' element={<CrmLayout><ClienteDetalhes /></CrmLayout>}></Route>
      <Route path='/carteiras/:supervisorId' element={<CrmLayout><SupervisorCarteira /></CrmLayout>}></Route>
    </Routes>
  )
}