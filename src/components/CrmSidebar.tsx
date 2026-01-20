// src/components/CrmSidebar.tsx
import { NavLink, useLocation } from "react-router-dom";
import { useMemo } from 'react';
import {
  LayoutDashboard,
  Users,
  FileText,
  TrendingUp,
  Settings,
  Target,
  Building,
  UserCheck
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/auth"; // ✅ IMPORTAR useAuth

// Definição completa de todos os itens de navegação
const allNavigationItems = [
  { 
    title: "Painel de Gestao", 
    url: "/dashboard", 
    icon: LayoutDashboard, 
    group: "Principal",
    roles: ['ADMIN', 'SUPERVISOR', 'USER']
  },
  { 
    title: "Clientes", 
    url: "/clientes", 
    icon: Users, 
    group: "Gestão",
    roles: ['ADMIN', 'SUPERVISOR', 'USER']
  },
  { 
    title: "Carteiras", 
    url: "/carteiras", 
    icon: UserCheck, 
    group: "Gestão",
    roles: ['ADMIN', 'SUPERVISOR']
  },
  { 
    title: "Propostas", 
    url: "/propostas", 
    icon: FileText, 
    group: "Vendas",
    roles: ['ADMIN', 'SUPERVISOR', 'USER']
  },
  { 
    title: "Vendas", 
    url: "/vendas", 
    icon: TrendingUp, 
    group: "Vendas",
    roles: ['ADMIN', 'SUPERVISOR', 'USER']
  },
  { 
    title: "Metas", 
    url: "/metas", 
    icon: Target, 
    group: "Performance",
    roles: ['ADMIN', 'SUPERVISOR']
  },
  { 
    title: "Relatórios", 
    url: "/relatorios", 
    icon: TrendingUp, 
    group: "Performance",
    roles: ['ADMIN', 'SUPERVISOR']
  },
  { 
    title: "Usuários", 
    url: "/usuarios", 
    icon: UserCheck, 
    group: "Configuração",
    roles: ['ADMIN']
  }
];

export function CrmSidebar() {
  const { user } = useAuth(); // ✅ USAR useAuth
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  // ✅ Filtrar itens baseado na role do usuário autenticado
  const accessibleNavigationItems = useMemo(() => {
    if (!user) return [];
    
    return allNavigationItems.filter(item => 
      item.roles.includes(user.role)
    );
  }, [user]);

  // Agrupar itens por categoria
  const groupedItems = useMemo(() => {
    return accessibleNavigationItems.reduce((groups, item) => {
      const group = item.group;
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(item);
      return groups;
    }, {} as Record<string, typeof accessibleNavigationItems>);
  }, [accessibleNavigationItems]);

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return currentPath === "/dashboard" || currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  const getNavClasses = (active: boolean) =>
    `transition-smooth hover:bg-secondary-hover ${
      active 
        ? "bg-primary text-primary-foreground font-medium" 
        : "text-muted-foreground hover:text-foreground"
    }`;

  // ✅ Não renderizar se não houver usuário
  if (!user) {
    return null;
  }

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"}>
      <SidebarContent className="bg-card border-r">
        {Object.entries(groupedItems).map(([groupName, items]) => (
          <SidebarGroup key={groupName}>
            {!collapsed && (
              <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
                {groupName}
              </SidebarGroupLabel>
            )}
            
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        className={({ isActive: navIsActive }) => 
                          getNavClasses(navIsActive || isActive(item.url))
                        }
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        {!collapsed && <span className="truncate">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}