# Virtus Web CRM

Sistema de CRM desenvolvido com React, TypeScript e Vite, integrado com backend Spring Boot para gestão de relacionamento com clientes.

## 🚀 Tecnologias

- **React 18.3** - Biblioteca JavaScript para construção de interfaces
- **TypeScript 5.6** - Superset JavaScript com tipagem estática
- **Vite 5.4** - Build tool e dev server de nova geração
- **Tailwind CSS 3.4** - Framework CSS utility-first
- **Shadcn/ui** - Componentes React reutilizáveis e acessíveis
- **React Router DOM 6.26** - Roteamento para aplicações React
- **React Query (TanStack Query) 5.56** - Gerenciamento de estado assíncrono
- **Axios 1.11** - Cliente HTTP para requisições
- **React Hook Form 7.53** - Gerenciamento de formulários performático
- **Zod 3.23** - Validação de schemas TypeScript-first
- **Recharts 2.12** - Biblioteca de gráficos para React
- **date-fns 3.6** - Biblioteca moderna de utilitários para datas
- **jsPDF 3.0** - Geração de documentos PDF
- **XLSX 0.18** - Leitura e escrita de planilhas Excel

## 📋 Pré-requisitos

- Node.js 18.x ou superior
- npm 8.x ou superior
- Backend Spring Boot rodando (configurado via `VITE_API_URL`)

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd virtuswebcrm
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:

Crie um arquivo `.env` na raiz do projeto:
```env
VITE_API_URL=https://sua-api.net
```

## 💻 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento (porta 8080)

# Build
npm run build        # Build de produção
npm run build:dev    # Build de desenvolvimento

# Qualidade de código
npm run lint         # Executa ESLint

# Preview
npm run preview      # Preview do build de produção
```

## 🏗️ Estrutura do Projeto

```
virtuswebcrm/
├── src/
│   ├── components/     # Componentes React reutilizáveis
│   ├── hooks/          # Custom React Hooks
│   ├── lib/            # Utilitários e configurações
│   ├── pages/          # Páginas/rotas da aplicação
│   └── main.tsx        # Ponto de entrada da aplicação
├── public/             # Arquivos estáticos
├── .github/
│   └── workflows/      # CI/CD com GitHub Actions
└── dist/               # Build de produção (gerado)
```

## 🎨 Componentes UI

O projeto utiliza componentes do **Shadcn/ui** incluindo:

- Accordion, Alert Dialog, Avatar
- Button, Card, Checkbox
- Dialog, Dropdown Menu, Form
- Input, Label, Navigation Menu
- Popover, Progress, Radio Group
- Select, Separator, Slider
- Switch, Tabs, Toast
- Tooltip, e mais...

Todos os componentes seguem os padrões de acessibilidade ARIA e são totalmente customizáveis via Tailwind CSS.

## 🌐 Deploy

### Azure Web App

O projeto está configurado para deploy automático no Azure via GitHub Actions:

1. Push para branch `main` dispara o workflow
2. Build é criado com Node.js 20.x
3. Deploy é feito via PM2 com serve

## 🔑 Funcionalidades

- ✅ Sistema de autenticação
- ✅ Dashboard com métricas
- ✅ Gestão de clientes (CRUD)
- ✅ Gestão de vendas e oportunidades
- ✅ Relatórios e gráficos
- ✅ Exportação para PDF e Excel
- ✅ Interface responsiva
- ✅ Tema claro/escuro
- ✅ Validação de formulários
- ✅ Feedback visual (toasts)

## 🛠️ Configuração do Ambiente de Desenvolvimento

### ESLint

O projeto usa ESLint 9.x com TypeScript:
- Configuração em `eslint.config.js`
- Plugins: react-hooks, react-refresh
- Regras relaxadas para desenvolvimento ágido

### TypeScript

Configuração em `tsconfig.json`:
- Target: ES2020
- Module: ESNext
- Strict mode: desabilitado (configurável)
- Path aliases: `@/*` → `./src/*`

### Tailwind CSS

Configuração em `tailwind.config.ts`:
- Design system customizado
- Variáveis CSS para cores e espaçamentos
- Suporte a dark mode
- Plugin de animações

## 📦 Build de Produção

O build de produção inclui:
- Minificação de código
- Tree-shaking
- Code splitting
- Otimização de assets
- Source maps (opcional)

Arquivos gerados em `/dist`

## 🔄 Integração com Backend

O frontend se comunica com API Spring Boot via:
- Axios configurado com interceptors
- React Query para cache e sincronização
- Variáveis de ambiente

## 📱 Responsividade

- Mobile-first design
- Breakpoints Tailwind padrão
- Componentes adaptáveis
- Touch-friendly na versão mobile

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é privado e proprietário.

## 👥 Equipe

Desenvolvido para equipe Virtus

## 📞 Suporte

Para suporte e questões, entre em contato através dos canais internos da organização.

---

**Nota**: Este é um projeto privado. Não compartilhe credenciais ou informações sensíveis em commits ou issues públicas.
