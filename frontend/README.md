# Hypesoft Product Management - Frontend

Frontend moderno e responsivo para o sistema de gestão de produtos, construído com Next.js 14, TypeScript, TailwindCSS e Shadcn/ui.

---

## Índice

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executar em Desenvolvimento](#executar-em-desenvolvimento)
- [Build para Produção](#build-para-produção)
- [Testes](#testes)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Componentes](#componentes)
- [Hooks Customizados](#hooks-customizados)
- [Autenticação](#autenticação)
- [Chamadas à API](#chamadas-à-api)

---

## Visão Geral

O frontend do Hypesoft Product Management é uma aplicação web moderna construída com Next.js 14 que fornece uma interface intuitiva e responsiva para gestão de produtos e categorias. O projeto utiliza TypeScript para type safety, TailwindCSS para estilização e Shadcn/ui para componentes UI acessíveis e customizáveis.

### Características Principais

**Interface e UX:**
- Design responsivo e moderno
- Componentes UI acessíveis (Shadcn/ui baseado em Radix UI)
- Feedback visual em todas as operações
- Tratamento de erros elegante
- Loading states para melhor UX

**Funcionalidades:**
- Dashboard com estatísticas em tempo real e gráficos
- CRUD completo de produtos (criar, editar, excluir, buscar, filtrar)
- CRUD completo de categorias
- Paginação eficiente para grandes volumes de dados
- Busca e filtros avançados

**Performance:**
- Server-Side Rendering (SSR) com Next.js
- Static Site Generation (SSG) para páginas estáticas
- Cache inteligente com TanStack Query
- Otimizações de imagens e assets automáticas

**Qualidade:**
- TypeScript para type safety
- Validações robustas com Zod
- Testes unitários com Vitest
- ESLint configurado para qualidade de código

**Autenticação:**
- Integração completa com Keycloak (OAuth2/OpenID Connect)
- Login/Logout com refresh automático de tokens
- Proteção de rotas
- Registro de novos usuários

---

## Tecnologias

### Framework e Biblioteca Principal

- **Next.js 14.2.0** - Framework React com App Router (SSR/SSG)
- **React 18.3.0** - Biblioteca UI
- **TypeScript 5.3.0** - Tipagem estática

### Estilização

- **TailwindCSS 3.4.0** - Framework CSS utilitário
- **Shadcn/ui** - Componentes UI baseados em Radix UI
- **Lucide React 0.344.0** - Ícones modernos
- **tailwindcss-animate** - Animações CSS

### Gerenciamento de Estado

- **TanStack Query 5.0.0** - Gerenciamento de estado servidor (cache, sincronização)
- **React Hook Form 7.50.0** - Formulários performáticos

### Validação

- **Zod 3.22.0** - Validação de schemas TypeScript-first
- **@hookform/resolvers 3.3.0** - Integração Zod com React Hook Form

### Autenticação

- **Keycloak JS 24.0.0** - Cliente Keycloak para OAuth2/OpenID Connect

### Visualizações

- **Recharts 2.10.0** - Gráficos e visualizações de dados

### HTTP Client

- **Axios 1.6.0** - Cliente HTTP para chamadas à API

### Testes

- **Vitest 1.2.0** - Framework de testes rápido (alternativa ao Jest)
- **@testing-library/react 14.1.0** - Utilitários para testes de componentes
- **@testing-library/jest-dom 6.2.0** - Matchers customizados para DOM
- **jsdom 23.0.0** - Ambiente DOM simulado para testes

### Build e Ferramentas

- **@vitejs/plugin-react 4.2.0** - Plugin React para Vite (usado por Vitest)
- **autoprefixer 10.4.0** - Autoprefixer para CSS
- **postcss 8.4.0** - PostCSS para processamento de CSS
- **ESLint 8.57.0** - Linter JavaScript/TypeScript
- **eslint-config-next 14.2.0** - Configuração ESLint para Next.js

### Utilidades

- **clsx 2.1.0** - Utilitário para condicionalmente juntar classes CSS
- **tailwind-merge 2.2.0** - Merge de classes Tailwind sem conflitos
- **class-variance-authority 0.7.0** - Gerenciamento de variantes de componentes

---

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm 9+** (incluído com Node.js)
- **Git** - [Download](https://git-scm.com/)

**Verificação:**
```bash
node --version    # Deve ser 18.x.x ou superior
npm --version     # Deve ser 9.x.x ou superior
git --version
```

**Nota:** Para executar o sistema completo, você também precisará da API backend rodando. Consulte [GUIA_INSTALACAO.md](../GUIA_INSTALACAO.md) para instruções completas.

---

## Instalação

**Passo 1: Navegue até o diretório do frontend**
```bash
cd frontend
```

**Passo 2: Instale as dependências**
```bash
npm install
```

Isso instalará todas as dependências listadas no `package.json`.

**Tempo estimado:** 2-5 minutos (dependendo da velocidade da internet)

---

## Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local` baseado no `.env.example`:

```bash
cp .env.example .env.local
```

**Edite `.env.local` com as seguintes variáveis:**

```env
# URL da API Backend
NEXT_PUBLIC_API_URL=http://localhost:5000

# Configurações do Keycloak
NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8080
NEXT_PUBLIC_KEYCLOAK_REALM=hypesoft
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=hypesoft-frontend
```

**Explicação das variáveis:**

- `NEXT_PUBLIC_API_URL`: URL base da API backend (deve corresponder à porta onde a API está rodando)
- `NEXT_PUBLIC_KEYCLOAK_URL`: URL do servidor Keycloak (padrão: http://localhost:8080)
- `NEXT_PUBLIC_KEYCLOAK_REALM`: Nome do realm no Keycloak (padrão: hypesoft)
- `NEXT_PUBLIC_KEYCLOAK_CLIENT_ID`: ID do client no Keycloak (padrão: hypesoft-frontend)

**Nota:** Variáveis que começam com `NEXT_PUBLIC_` são expostas ao navegador. Não inclua informações sensíveis nestas variáveis.

---

## Executar em Desenvolvimento

**Comando:**
```bash
npm run dev
```

O servidor de desenvolvimento será iniciado e você verá algo como:

```
> hypesoft-frontend@0.1.0 dev
> next dev

   ▲ Next.js 14.2.0
   - Local:        http://localhost:3000
   - Ready in 2.5s
```

**Acesse:** http://localhost:3000 no seu navegador.

### Recursos do Modo Desenvolvimento

- **Hot Reload:** Mudanças no código são refletidas automaticamente no navegador
- **Error Overlay:** Erros são exibidos diretamente no navegador
- **Source Maps:** Debug facilitado com source maps
- **Fast Refresh:** Estado dos componentes React é preservado durante hot reload

---

## Build para Produção

**Passo 1: Criar build de produção**
```bash
npm run build
```

Isso criará uma versão otimizada da aplicação na pasta `.next/`.

**Tempo estimado:** 1-3 minutos

**Passo 2: Executar servidor de produção**
```bash
npm start
```

O servidor de produção será iniciado na porta 3000 (ou na porta especificada pela variável de ambiente `PORT`).

**Nota:** O build de produção é otimizado para performance:
- Código minificado e tree-shaken
- CSS otimizado
- Imagens otimizadas
- Server-Side Rendering configurado

---

## Testes

**Executar todos os testes:**
```bash
npm test
```

**Executar testes em modo watch:**
```bash
npm test -- --watch
```

**Executar testes com interface visual:**
```bash
npm run test:ui
```

**Executar testes com cobertura:**
```bash
npm run test:coverage
```

### Estrutura de Testes

Os testes estão organizados em:

- **Componentes:** Testes unitários de componentes React
- **Hooks:** Testes de hooks customizados (useProducts, useCategories, etc.)
- **Utilitários:** Testes de funções utilitárias (format.ts, validation.ts)
- **Páginas:** Testes de integração de páginas completas

### Configuração de Testes

Os testes são configurados via:
- **vitest.config.ts** - Configuração do Vitest
- **test/setup.ts** - Setup global para testes
- **test/test-utils.tsx** - Utilitários de teste (wrapper com providers)

---

## Estrutura do Projeto

```
frontend/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── dashboard/            # Páginas do dashboard
│   │   │   ├── products/         # Página de produtos
│   │   │   │   ├── page.tsx      # Lista de produtos
│   │   │   │   └── [id]/         # Detalhes/Edição de produto
│   │   │   ├── categories/       # Página de categorias
│   │   │   │   └── page.tsx      # Lista de categorias
│   │   │   └── users/            # Página de usuários
│   │   │       ├── layout.tsx
│   │   │       └── page.tsx
│   │   ├── login/                # Página de login
│   │   │   └── page.tsx
│   │   ├── register/             # Página de registro
│   │   │   └── page.tsx
│   │   ├── layout.tsx            # Layout principal
│   │   ├── page.tsx              # Página inicial (dashboard)
│   │   ├── providers.tsx         # Providers (Query, Keycloak)
│   │   └── globals.css           # Estilos globais
│   │
│   ├── components/               # Componentes React
│   │   ├── layout/               # Componentes de layout
│   │   │   ├── MainLayout.tsx    # Layout principal
│   │   │   ├── Sidebar.tsx       # Barra lateral
│   │   │   └── Header.tsx        # Cabeçalho
│   │   ├── products/             # Componentes de produtos
│   │   │   ├── ProductForm.tsx   # Formulário de produto
│   │   │   ├── ProductList.tsx   # Lista de produtos
│   │   │   ├── ProductCard.tsx   # Card de produto
│   │   │   └── ProductFilters.tsx # Filtros de produtos
│   │   ├── categories/           # Componentes de categorias
│   │   │   ├── CategoryForm.tsx  # Formulário de categoria
│   │   │   └── CategoryList.tsx  # Lista de categorias
│   │   └── ui/                   # Componentes UI (Shadcn)
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── dialog.tsx
│   │       ├── table.tsx
│   │       └── ...
│   │
│   ├── lib/                      # Utilitários e configurações
│   │   ├── api/                  # Clientes API (Axios)
│   │   │   ├── client.ts         # Cliente Axios configurado
│   │   │   ├── products.ts       # API de produtos
│   │   │   ├── categories.ts     # API de categorias
│   │   │   ├── dashboard.ts      # API de dashboard
│   │   │   └── auth.ts           # API de autenticação
│   │   ├── keycloak/             # Configuração Keycloak
│   │   │   ├── config.ts         # Configuração do Keycloak
│   │   │   ├── provider.tsx      # Provider do Keycloak
│   │   │   └── hooks.ts          # Hooks do Keycloak
│   │   └── utils/                # Utilitários gerais
│   │       ├── cn.ts             # Utilitário para classes CSS
│   │       ├── format.ts         # Formatação (moeda, datas)
│   │       └── validation.ts     # Schemas Zod
│   │
│   ├── hooks/                    # Hooks customizados
│   │   ├── useProducts.ts        # Hook para produtos (TanStack Query)
│   │   ├── useCategories.ts      # Hook para categorias
│   │   ├── useDashboard.ts       # Hook para dashboard
│   │   ├── useDebounce.ts        # Hook para debounce
│   │   └── use-toast.ts          # Hook para notificações (Shadcn)
│   │
│   ├── types/                    # Tipos TypeScript
│   │   ├── product.ts            # Tipos de produto
│   │   ├── category.ts           # Tipos de categoria
│   │   ├── dashboard.ts          # Tipos de dashboard
│   │   ├── api.ts                # Tipos de API (responses, errors)
│   │   └── auth.ts               # Tipos de autenticação
│   │
│   └── stores/                   # Estado global (futuro: Zustand, Redux)
│       └── .gitkeep
│
├── public/                       # Arquivos estáticos
│   └── silent-check-sso.html     # Silent check SSO para Keycloak
│
├── test/                         # Configuração de testes
│   ├── setup.ts                  # Setup global para testes
│   └── test-utils.tsx            # Utilitários de teste
│
├── Dockerfile                    # Dockerfile para produção
├── package.json                  # Dependências e scripts
├── package-lock.json             # Lock file de dependências
├── tsconfig.json                 # Configuração TypeScript
├── tailwind.config.ts            # Configuração TailwindCSS
├── postcss.config.js             # Configuração PostCSS
├── next.config.js                # Configuração Next.js
├── vitest.config.ts              # Configuração Vitest
├── components.json               # Configuração Shadcn/ui
├── .eslintrc.json                # Configuração ESLint
├── .env.example                  # Exemplo de variáveis de ambiente
└── README.md                     # Este arquivo
```

---

## Scripts Disponíveis

### Desenvolvimento

- `npm run dev` - Inicia servidor de desenvolvimento com hot reload
- `npm run build` - Cria build de produção otimizado
- `npm start` - Inicia servidor de produção (requer build anterior)

### Qualidade de Código

- `npm run lint` - Executa ESLint para verificar qualidade do código
- `npm run lint:fix` - Executa ESLint e corrige problemas automaticamente

### Testes

- `npm test` - Executa todos os testes com Vitest
- `npm run test:ui` - Executa testes com interface visual
- `npm run test:coverage` - Executa testes e gera relatório de cobertura
- `npm test -- --watch` - Executa testes em modo watch (reativo)

### Build e Deploy

- `npm run build` - Cria build de produção
- `npm start` - Inicia servidor de produção (após build)

---

## Componentes

### Componentes de Layout

- **MainLayout:** Layout principal da aplicação com sidebar e header
- **Sidebar:** Barra lateral com navegação
- **Header:** Cabeçalho com informações do usuário e logout

### Componentes de Produtos

- **ProductList:** Lista de produtos com tabela paginada
- **ProductForm:** Formulário para criar/editar produtos
- **ProductCard:** Card individual de produto (usado em listagens)
- **ProductFilters:** Filtros avançados (por categoria, status, busca)

### Componentes de Categorias

- **CategoryList:** Lista de categorias com tabela
- **CategoryForm:** Formulário para criar/editar categorias

### Componentes UI (Shadcn/ui)

Componentes base acessíveis e customizáveis:
- Button, Input, Select, Dialog, Alert, Toast, Table, etc.
- Baseados em Radix UI (acessibilidade garantida)
- Estilizados com TailwindCSS (totalmente customizáveis)

---

## Hooks Customizados

### useProducts

Hook para gerenciar produtos usando TanStack Query:

```typescript
const { data, isLoading, error, createProduct, updateProduct, deleteProduct } = useProducts();
```

**Funcionalidades:**
- Lista produtos com paginação e filtros
- Busca produtos por nome
- Cria, atualiza e exclui produtos
- Atualiza estoque de produtos

### useCategories

Hook para gerenciar categorias:

```typescript
const { data, isLoading, error, createCategory, updateCategory, deleteCategory } = useCategories();
```

**Funcionalidades:**
- Lista todas as categorias
- Cria, atualiza e exclui categorias

### useDashboard

Hook para dados do dashboard:

```typescript
const { stats, lowStockProducts, productsByCategory } = useDashboard();
```

**Funcionalidades:**
- Estatísticas gerais (total de produtos, categorias, estoque)
- Produtos com estoque baixo
- Contagem de produtos por categoria (para gráficos)

### useDebounce

Hook para debounce de valores (útil para busca):

```typescript
const debouncedValue = useDebounce(value, 500);
```

---

## Autenticação

A autenticação é gerenciada através do Keycloak JS.

### Configuração

A configuração está em `src/lib/keycloak/config.ts`:

```typescript
export const keycloakConfig = {
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL,
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM,
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
};
```

### Provider

O `KeycloakProvider` envolve a aplicação em `src/app/providers.tsx`:

```typescript
<KeycloakProvider>
  {children}
</KeycloakProvider>
```

### Hooks

Use `useKeycloak` para acessar funcionalidades do Keycloak:

```typescript
const { keycloak, authenticated, login, logout } = useKeycloak();
```

### Proteção de Rotas

As rotas são protegidas via middleware em `src/middleware.ts`:

```typescript
export function middleware(request: NextRequest) {
  // Lógica de proteção de rotas
}
```

---

## Chamadas à API

As chamadas à API são feitas através de clientes Axios configurados em `src/lib/api/`.

### Cliente Base

O cliente Axios base está em `src/lib/api/client.ts`:

```typescript
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Clientes Específicos

- **products.ts:** Endpoints de produtos
- **categories.ts:** Endpoints de categorias
- **dashboard.ts:** Endpoints de dashboard
- **auth.ts:** Endpoints de autenticação (se necessário)

### Uso com TanStack Query

As chamadas são encapsuladas em hooks customizados que usam TanStack Query:

```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['products'],
  queryFn: () => getProducts(),
});
```

**Benefícios:**
- Cache automático
- Sincronização em background
- Retry automático em caso de erro
- Loading e error states gerenciados

---
