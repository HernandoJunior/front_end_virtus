import { NavLink, useLocation } from "react-router-dom";
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

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
    group: "Principal"
  },
  {
    title: "Clientes",
    url: "/clientes",
    icon: Users,
    group: "Gestão"
  },
  {
    title: "Propostas",
    url: "/propostas",
    icon: FileText,
    group: "Vendas"
  },
  {
    title: "Vendas",
    url: "/vendas",
    icon: TrendingUp,
    group: "Vendas"
  },
  {
    title: "Metas",
    url: "/metas",
    icon: Target,
    group: "Performance"
  },
  {
    title: "Relatórios",
    url: "/relatorios",
    icon: TrendingUp,
    group: "Performance"
  },
  {
    title: "Bancos",
    url: "/bancos",
    icon: Building,
    group: "Configuração"
  },
  {
    title: "Carteiras",
    url: "/carteiras",
    icon: UserCheck,
    group: "Gestão"
  },
  {
    title: "Usuários",
    url: "/usuarios",
    icon: UserCheck,
    group: "Configuração"
  },
  {
    title: "Configurações",
    url: "/configuracoes",
    icon: Settings,
    group: "Configuração"
  }
];

// Group items by category
const groupedItems = navigationItems.reduce((groups, item) => {
  const group = item.group;
  if (!groups[group]) {
    groups[group] = [];
  }
  groups[group].push(item);
  return groups;
}, {} as Record<string, typeof navigationItems>);

export function CrmSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  const getNavClasses = (active: boolean) =>
    `transition-smooth hover:bg-secondary-hover ${
      active 
        ? "bg-primary text-primary-foreground font-medium" 
        : "text-muted-foreground hover:text-foreground"
    }`;

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