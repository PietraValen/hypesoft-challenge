# Hypesoft Challenge - Sistema de Gestão de Produtos

Sistema completo de gestão de produtos e categorias desenvolvido seguindo as melhores práticas de Clean Architecture, DDD e CQRS. Projeto full-stack com backend em .NET 9 e frontend em Next.js 14.

---

## Índice

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Execução](#instalação-e-execução)
- [Configuração Inicial](#configuração-inicial)
- [Documentação](#documentação)
- [Testes](#testes)
- [Decisões Arquiteturais](#decisões-arquiteturais)
- [Contribuindo](#contribuindo)
- [Status do Projeto](#status-do-projeto)

---

## Visão Geral

Este projeto implementa um sistema completo de gestão de produtos com funcionalidades robustas para CRUD de produtos e categorias, dashboard analítico, autenticação enterprise-grade e arquitetura escalável.

### Funcionalidades Principais

**Gestão de Produtos:**

- CRUD completo (Criar, Ler, Atualizar, Excluir)
- Busca e filtros avançados (por nome, categoria, status)
- Controle de estoque com operações específicas (adicionar, remover, atualizar)
- Alertas automáticos de estoque baixo (threshold configurável)
- Status de produtos (Ativo, Inativo, Descontinuado)
- Validações robustas em múltiplas camadas (frontend e backend)
- Paginação eficiente para grandes volumes de dados

**Gestão de Categorias:**

- CRUD completo de categorias
- Validação de nomes únicos no domínio
- Relacionamento com produtos (integridade referencial)
- Proteção contra exclusão de categorias com produtos associados
- Visualização de produtos por categoria

**Dashboard:**

- Estatísticas gerais em tempo real (total de produtos, categorias, estoque)
- Visualização gráfica de produtos por categoria (usando Recharts)
- Lista filtrada de produtos com estoque baixo
- Métricas de negócio (valor total do estoque, produtos sem estoque)
- Interface responsiva e moderna

**Autenticação e Segurança:**

- Integração completa com Keycloak (OAuth2/OpenID Connect)
- Login/Logout com refresh automático de tokens
- Registro de novos usuários
- Proteção de rotas no frontend
- Autenticação JWT Bearer configurada no backend
- Rate limiting configurado para proteção contra abuso

### Diferenciais Técnicos

**Arquitetura:**

- Clean Architecture com separação clara de responsabilidades em 4 camadas
- DDD (Domain-Driven Design) com entidades ricas e value objects imutáveis
- CQRS com MediatR para separação de commands e queries
- Inversão de dependências (SOLID principles)
- Domain layer completamente independente de frameworks

**Performance e Escalabilidade:**

- Índices MongoDB otimizados para buscas frequentes
- Paginação eficiente para grandes datasets
- Queries otimizadas com projeções MongoDB
- Arquitetura preparada para cache (Redis-ready)
- Horizontal scaling facilitado pela arquitetura desacoplada

**Qualidade de Código:**

- Testes estruturados em todas as camadas (unitários e integração)
- Validações em múltiplas camadas (FluentValidation + Zod)
- Error handling robusto com respostas padronizadas
- Código limpo seguindo convenções Microsoft (C#) e ESLint (TypeScript)
- Logging estruturado com Serilog (JSON format)

**Developer Experience:**

- Docker Compose para setup em um único comando
- Swagger interativo para testar API diretamente
- TypeScript para type safety em todo o frontend
- Hot reload no desenvolvimento (backend e frontend)
- Estrutura de projeto clara e bem documentada

---

## Arquitetura

O projeto segue **Clean Architecture** com 4 camadas principais, garantindo separação de responsabilidades e independência de frameworks.

### Diagrama de Camadas

```
┌─────────────────────────────────────────────────────┐
│                  Frontend (Next.js)                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐│
│  │   Pages     │  │ Components  │  │    Hooks    ││
│  └─────────────┘  └─────────────┘  └─────────────┘│
└─────────────────────────────────────────────────────┘
                        │
                        │ HTTP/REST
                        ▼
┌─────────────────────────────────────────────────────┐
│              API Layer (.NET 9)                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐│
│  │ Controllers │  │ Middlewares │  │  Filters    ││
│  └─────────────┘  └─────────────┘  └─────────────┘│
└─────────────────────────────────────────────────────┘
                        │
                        │ MediatR
                        ▼
┌─────────────────────────────────────────────────────┐
│         Application Layer (CQRS)                    │
│  ┌──────────────┐      ┌──────────────┐            │
│  │  Commands    │      │   Queries    │            │
│  │  + Handlers  │      │  + Handlers  │            │
│  └──────────────┘      └──────────────┘            │
│  ┌──────────────┐      ┌──────────────┐            │
│  │   Validators │      │     DTOs     │            │
│  └──────────────┘      └──────────────┘            │
└─────────────────────────────────────────────────────┘
                        │
                        │ Interfaces
                        ▼
┌─────────────────────────────────────────────────────┐
│           Domain Layer                              │
│  ┌──────────────┐      ┌──────────────┐            │
│  │  Entities    │      │ Value Objects│            │
│  │  (Rich)      │      │  (Immutable) │            │
│  └──────────────┘      └──────────────┘            │
│  ┌──────────────┐      ┌──────────────┐            │
│  │ Domain Events│      │  Interfaces  │            │
│  └──────────────┘      └──────────────┘            │
└─────────────────────────────────────────────────────┘
                        │
                        │ Implementations
                        ▼
┌─────────────────────────────────────────────────────┐
│        Infrastructure Layer                         │
│  ┌──────────────┐      ┌──────────────┐            │
│  │ Repositories │      │   MongoDB    │            │
│  │  (MongoDB)   │      │   Context    │            │
│  └──────────────┘      └──────────────┘            │
└─────────────────────────────────────────────────────┘
```

### Princípios Arquiteturais

**Separação de Responsabilidades:**

Cada camada tem responsabilidade única e bem definida:
- **Domain:** Regras de negócio puras, sem dependências externas
- **Application:** Orquestração de casos de uso (CQRS)
- **Infrastructure:** Implementações técnicas (MongoDB, logging, etc.)
- **API:** Expõe a aplicação via HTTP (controllers, middlewares)

**Inversão de Dependência:**

Camadas superiores dependem de abstrações (interfaces) definidas nas camadas inferiores. Por exemplo:
- Application depende de interfaces definidas em Domain
- Infrastructure implementa interfaces definidas em Domain
- API depende de interfaces definidas em Application

**Independência de Frameworks:**

Domain layer é completamente independente de frameworks e bibliotecas externas:
- Sem referências a ASP.NET Core
- Sem referências a MongoDB.Driver
- Apenas código C# puro com regras de negócio

**Testabilidade:**

Cada camada pode ser testada independentemente através de mocks/stubs:
- Domain: Testes unitários puros
- Application: Testes de handlers com repositories mockados
- Infrastructure: Testes de integração com MongoDB
- API: Testes de controllers com MediatR mockado

---

## Tecnologias

### Backend

**Framework e Runtime:**
- **.NET 9** - Framework principal com C# 13
- **ASP.NET Core** - Framework web para APIs RESTful

**Banco de Dados:**
- **MongoDB 7.0** - Banco de dados NoSQL com driver oficial
- **MongoDB.Driver 3.1.0** - Driver oficial do MongoDB para .NET

**Padrões e Arquitetura:**
- **MediatR 12.4.1** - Implementação do padrão Mediator para CQRS
- **AutoMapper 13.0.1** - Mapeamento automático entre objetos

**Validação:**
- **FluentValidation 11.11.0** - Validação fluente e expressiva

**Logging e Observabilidade:**
- **Serilog.AspNetCore 8.0.3** - Logging estruturado (JSON)
- **Health Checks** - Health checks customizados para MongoDB

**Documentação:**
- **Swashbuckle.AspNetCore 6.9.0** - Swagger/OpenAPI para documentação

**Segurança:**
- **Keycloak** - Autenticação e autorização (OAuth2/OpenID Connect)
- **AspNetCoreRateLimit 5.0.0** - Rate limiting por IP

### Frontend

**Framework:**
- **Next.js 14** - Framework React com App Router (SSR/SSG)
- **React 18.3.0** - Biblioteca UI
- **TypeScript 5.3.0** - Tipagem estática

**Estilização:**
- **TailwindCSS 3.4.0** - Framework CSS utilitário
- **Shadcn/ui** - Componentes UI baseados em Radix UI
- **Lucide React** - Ícones modernos

**Gerenciamento de Estado:**
- **TanStack Query 5.0.0** - Gerenciamento de estado servidor (cache, sincronização)
- **React Hook Form 7.50.0** - Formulários performáticos

**Validação:**
- **Zod 3.22.0** - Validação de schemas TypeScript-first
- **@hookform/resolvers** - Integração Zod com React Hook Form

**Autenticação:**
- **Keycloak JS 24.0.0** - Cliente Keycloak para OAuth2/OpenID Connect

**Visualizações:**
- **Recharts 2.10.0** - Gráficos e visualizações de dados

**Testes:**
- **Vitest 1.2.0** - Framework de testes rápido
- **@testing-library/react** - Utilitários para testes de componentes
- **@testing-library/jest-dom** - Matchers customizados para DOM

**HTTP Client:**
- **Axios 1.6.0** - Cliente HTTP para chamadas à API

### Infraestrutura

**Containerização:**
- **Docker** - Containerização de aplicações
- **Docker Compose** - Orquestração de serviços

**Banco de Dados:**
- **MongoDB 7.0** - Banco de dados principal (NoSQL)
- **PostgreSQL 15** - Banco de dados do Keycloak

**Serviços Externos:**
- **Keycloak 24.0** - Servidor de autenticação e autorização

---

## Estrutura do Projeto

```
hypesoft-challenge/
├── backend/                    # Backend .NET
│   ├── src/
│   │   ├── Hypesoft.API/      # Camada de apresentação
│   │   │   ├── Controllers/   # Controllers REST
│   │   │   ├── Extensions/    # Extensions (Swagger, Services)
│   │   │   ├── Middlewares/   # Middlewares customizados
│   │   │   └── Program.cs     # Configuração da aplicação
│   │   ├── Hypesoft.Application/  # Camada de aplicação (CQRS)
│   │   │   ├── Commands/      # Commands (escrita)
│   │   │   ├── Queries/       # Queries (leitura)
│   │   │   ├── Handlers/      # Command/Query Handlers
│   │   │   ├── DTOs/          # Data Transfer Objects
│   │   │   ├── Validators/    # FluentValidation validators
│   │   │   └── Mappings/      # AutoMapper profiles
│   │   ├── Hypesoft.Domain/   # Camada de domínio
│   │   │   ├── Entities/      # Entidades de domínio
│   │   │   ├── ValueObjects/  # Value Objects
│   │   │   ├── Enums/         # Enumeradores
│   │   │   ├── Events/        # Domain Events
│   │   │   ├── Exceptions/    # Exceções de domínio
│   │   │   └── Interfaces/    # Interfaces (repositories)
│   │   └── Hypesoft.Infrastructure/  # Camada de infraestrutura
│   │       ├── Data/          # Contexto MongoDB, Repositories
│   │       ├── Configurations/ # Configurações (MongoDB)
│   │       └── Services/      # Serviços externos
│   ├── tests/                 # Testes do backend
│   │   ├── Hypesoft.Domain.Tests/
│   │   ├── Hypesoft.Application.Tests/
│   │   ├── Hypesoft.Infrastructure.Tests/
│   │   └── Hypesoft.API.Tests/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── README.md
│
├── frontend/                   # Frontend Next.js
│   ├── src/
│   │   ├── app/               # Next.js App Router
│   │   │   ├── dashboard/     # Páginas do dashboard
│   │   │   │   ├── products/  # Página de produtos
│   │   │   │   ├── categories/ # Página de categorias
│   │   │   │   └── users/     # Página de usuários
│   │   │   ├── login/         # Página de login
│   │   │   ├── register/      # Página de registro
│   │   │   ├── layout.tsx     # Layout principal
│   │   │   ├── page.tsx       # Página inicial (dashboard)
│   │   │   └── providers.tsx  # Providers (Query, Keycloak)
│   │   ├── components/        # Componentes React
│   │   │   ├── layout/        # Componentes de layout
│   │   │   ├── products/      # Componentes de produtos
│   │   │   ├── categories/    # Componentes de categorias
│   │   │   └── ui/            # Componentes UI (Shadcn)
│   │   ├── lib/               # Utilitários e configurações
│   │   │   ├── api/           # Clientes API (Axios)
│   │   │   ├── keycloak/      # Configuração Keycloak
│   │   │   └── utils/         # Utilitários gerais
│   │   ├── hooks/             # Hooks customizados
│   │   │   ├── useProducts.ts
│   │   │   ├── useCategories.ts
│   │   │   └── useDashboard.ts
│   │   └── types/             # Tipos TypeScript
│   │       ├── product.ts
│   │       ├── category.ts
│   │       └── api.ts
│   ├── public/                # Arquivos estáticos
│   ├── Dockerfile
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── README.md
│
├── docker-compose.yml          # Compose principal (todos os serviços)
├── README.md                   # Este arquivo
├── DOCUMENTACAO_API.md         # Documentação detalhada da API
├── GUIA_INSTALACAO.md          # Guia completo de instalação
└── DECISOES_ARQUITETURAIS.md   # Decisões arquiteturais (ADR)
```

---

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

### Opção 1: Docker Compose (Recomendado)

- **Docker Desktop** (Windows/Mac) ou **Docker Engine + Docker Compose** (Linux)
  - Windows: [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)
  - Mac: [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop)
  - Linux: [Docker Engine](https://docs.docker.com/engine/install/) + [Docker Compose](https://docs.docker.com/compose/install/)

**Verificação:**
```bash
docker --version
docker-compose --version
```

### Opção 2: Instalação Local

Se preferir executar sem Docker, você precisará de:

- **.NET 9 SDK** - [Download](https://dotnet.microsoft.com/download/dotnet/9.0)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **MongoDB 7.0+** - [Download](https://www.mongodb.com/try/download/community)
- **Keycloak 24.0+** (opcional, para autenticação)

**Verificação:**
```bash
dotnet --version    # Deve ser 9.0.x
node --version      # Deve ser 18.x.x ou superior
npm --version       # Deve ser 9.x.x ou superior
mongod --version    # Deve ser 7.0.x ou superior
```

**Nota:** Para a forma mais simples de execução, recomenda-se usar Docker Compose.

---

## Instalação e Execução

### Opção 1: Executar com Docker Compose (Recomendado)

Esta é a forma mais simples de executar todo o sistema. Um único comando sobe toda a infraestrutura necessária.

**Passo 1: Clone o repositório**
```bash
git clone <url-do-repositorio>
cd hypesoft-challenge
```

**Passo 2: Execute o Docker Compose**
```bash
# Na raiz do projeto
docker-compose up -d
```

Este comando irá:
- Construir as imagens do frontend e backend
- Iniciar os containers: Frontend, Backend, MongoDB, Keycloak e PostgreSQL
- Configurar as redes e volumes necessários

**Passo 3: Aguarde alguns segundos para todos os serviços iniciarem**

```bash
# Verifique o status:
docker-compose ps

# Ver logs em tempo real:
docker-compose logs -f
```

**Passo 4: Acesse as aplicações**

Após a inicialização, as seguintes URLs estarão disponíveis:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Swagger:** http://localhost:5000/swagger
- **Keycloak:** http://localhost:8080
- **MongoDB:** localhost:27017 (porta interna)

**Serviços incluídos:**
- Frontend (Next.js) - Porta 3000
- Backend API (.NET) - Porta 5000
- Keycloak (Autenticação) - Porta 8080
- MongoDB (Banco de dados) - Porta 27017
- PostgreSQL (Keycloak DB) - Porta 5432 (interno)

**Comandos úteis:**
```bash
# Ver logs de todos os serviços
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f api
docker-compose logs -f frontend

# Parar todos os serviços
docker-compose down

# Parar e remover volumes (limpa dados)
docker-compose down -v

# Reconstruir após mudanças
docker-compose build
docker-compose up -d

# Reiniciar um serviço específico
docker-compose restart api
```

### Opção 2: Executar Localmente

Se preferir executar localmente sem Docker:

#### Backend

**Passo 1: Iniciar MongoDB**
```bash
# Via Docker (mais simples):
docker run -d -p 27017:27017 --name mongodb mongo:7.0

# Ou instale MongoDB localmente
```

**Passo 2: Configurar Backend**
```bash
cd backend

# Restaurar dependências
dotnet restore

# Compilar o projeto
dotnet build
```

**Passo 3: Configurar appsettings.json**

Edite `backend/src/Hypesoft.API/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "MongoDB": "mongodb://localhost:27017"
  },
  "MongoDB": {
    "DatabaseName": "hypesoft"
  },
  "Keycloak": {
    "Authority": "http://localhost:8080/realms/hypesoft",
    "Audience": "hypesoft-api"
  }
}
```

**Passo 4: Executar a API**
```bash
cd src/Hypesoft.API
dotnet run
```

A API estará disponível em:
- HTTP: http://localhost:5000
- HTTPS: https://localhost:5001
- Swagger: http://localhost:5000/swagger

#### Frontend

**Passo 1: Instalar dependências**
```bash
cd frontend
npm install
```

**Passo 2: Configurar variáveis de ambiente**

Crie o arquivo `.env.local` baseado em `.env.example`:

```bash
cp .env.example .env.local
```

Edite `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8080
NEXT_PUBLIC_KEYCLOAK_REALM=hypesoft
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=hypesoft-frontend
```

**Passo 3: Executar em desenvolvimento**
```bash
npm run dev
```

O frontend estará disponível em: http://localhost:3000

**Configuração do Keycloak:** Consulte a documentação específica para configurar o Keycloak localmente, se necessário.

---

## Configuração Inicial

### 1. Configurar Keycloak

O Keycloak precisa ser configurado antes de usar autenticação:

1. Acesse http://localhost:8080
2. Login no Admin Console (usuário: `admin`, senha: `admin`)
3. Crie um novo realm chamado `hypesoft`
4. Crie um client chamado `hypesoft-frontend` com configurações:
   - Client Protocol: `openid-connect`
   - Access Type: `public`
   - Valid Redirect URIs: `http://localhost:3000/*`
   - Web Origins: `http://localhost:3000`

**Guias detalhados:**
- `KEYCLOAK_QUICK_SETUP.md` - Guia rápido (se disponível)
- `frontend/KEYCLOAK_SETUP.md` - Guia detalhado (se disponível)

### 2. Banco de Dados

O MongoDB é populado automaticamente com dados de exemplo quando a API inicia em modo **Development**.

**Dados de exemplo incluídos:**
- 4 categorias: Eletrônicos, Roupas, Alimentos, Livros
- Produtos relacionados a cada categoria com estoque variado
- Dados suficientes para demonstrar todas as funcionalidades

**Nota:** Os dados são semeados apenas em modo Development. Em produção, você precisará populá-los manualmente.

### 3. Variáveis de Ambiente

#### Backend

As variáveis são configuradas no `docker-compose.yml` ou `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "MongoDB": "mongodb://mongodb:27017"
  },
  "MongoDB": {
    "DatabaseName": "hypesoft"
  },
  "Keycloak": {
    "Authority": "http://keycloak:8080/realms/hypesoft",
    "Audience": "hypesoft-api"
  },
  "Cors": {
    "AllowedOrigins": ["http://localhost:3000"]
  },
  "IpRateLimiting": {
    "EnableEndpointRateLimiting": true,
    "StackBlockedRequests": false,
    "RealIpHeader": "X-Real-IP",
    "HttpStatusCode": 429,
    "GeneralRules": [
      {
        "Endpoint": "*",
        "Period": "1m",
        "Limit": 100
      }
    ]
  }
}
```

#### Frontend

Crie `.env.local` baseado em `.env.example`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8080
NEXT_PUBLIC_KEYCLOAK_REALM=hypesoft
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=hypesoft-frontend
```

---

## Documentação

### Documentação Principal

- **[README Backend](backend/README.md)** - Documentação completa do backend .NET
- **[README Frontend](frontend/README.md)** - Documentação completa do frontend Next.js
- **[Documentação da API](DOCUMENTACAO_API.md)** - Documentação detalhada de todos os endpoints
- **[Guia de Instalação](GUIA_INSTALACAO.md)** - Guia passo a passo de instalação
- **[Decisões Arquiteturais](DECISOES_ARQUITETURAIS.md)** - Documentação de decisões técnicas (ADR)

### Guias Específicos

- **Swagger UI:** http://localhost:5000/swagger (quando API estiver rodando)
  - Documentação interativa com exemplos de requisições e respostas
  - Teste de endpoints diretamente na interface
  - Suporte para autenticação JWT Bearer

### Estrutura da Documentação

- **README.md** (este arquivo) - Visão geral do projeto
- **DOCUMENTACAO_API.md** - Documentação completa da API REST
- **GUIA_INSTALACAO.md** - Instruções detalhadas de instalação
- **DECISOES_ARQUITETURAIS.md** - Architecture Decision Records (ADR)

---

## Testes

### Backend

**Executar todos os testes:**
```bash
cd backend
dotnet test
```

**Executar testes com cobertura:**
```bash
dotnet test --collect:"XPlat Code Coverage"
```

**Executar testes de um projeto específico:**
```bash
dotnet test tests/Hypesoft.Domain.Tests
dotnet test tests/Hypesoft.Application.Tests
dotnet test tests/Hypesoft.Infrastructure.Tests
dotnet test tests/Hypesoft.API.Tests
```

**Projetos de teste:**
- `Hypesoft.Domain.Tests` - Testes unitários de entidades e value objects
- `Hypesoft.Application.Tests` - Testes de handlers (commands e queries)
- `Hypesoft.Infrastructure.Tests` - Testes de integração com MongoDB
- `Hypesoft.API.Tests` - Testes de controllers e middlewares

**Cobertura de Testes:**

A cobertura de testes é medida com XPlat Code Coverage. Execute `dotnet test --collect:"XPlat Code Coverage"` para gerar relatórios.

### Frontend

**Executar todos os testes:**
```bash
cd frontend
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

**Estrutura de testes:**
- Testes unitários de componentes (React Testing Library)
- Testes de hooks customizados (useProducts, useCategories, etc.)
- Testes de integração de páginas
- Testes de utilitários e helpers

**Mais detalhes:** Consulte [frontend/TESTING.md](frontend/TESTING.md) se disponível.

---

## Decisões Arquiteturais

Para documentação completa das decisões arquiteturais, consulte **[DECISOES_ARQUITETURAIS.md](DECISOES_ARQUITETURAIS.md)**.

### Resumo das Principais Decisões

**Clean Architecture:**
- **Razão:** Separação clara de responsabilidades, testabilidade e manutenibilidade
- **Benefícios:** Cada camada pode ser testada independentemente, mudanças isoladas
- **Impacto:** Alto na qualidade e manutenibilidade do código

**Domain-Driven Design (DDD):**
- **Razão:** Entidades ricas com comportamentos encapsulados, value objects imutáveis
- **Benefícios:** Regras de negócio no domínio, código expressivo
- **Impacto:** Alto na qualidade e clareza do código

**CQRS com MediatR:**
- **Razão:** Separação de leitura e escrita, código mais focado
- **Benefícios:** Handlers isolados, fácil adicionar validações e logging
- **Impacto:** Médio na organização do código

**MongoDB:**
- **Razão:** Schema flexível, performance para leitura, JSON nativo
- **Benefícios:** Facilita evolução, boa performance out-of-the-box
- **Impacto:** Médio na escalabilidade e performance

**Keycloak:**
- **Razão:** Solução enterprise-grade, padrões OAuth2/OpenID Connect
- **Benefícios:** Segurança robusta, interface administrativa completa
- **Impacto:** Médio na segurança e preparação para produção

**Next.js 14:**
- **Razão:** App Router moderno, SSR/SSG, excelente Developer Experience
- **Benefícios:** Performance excelente, produtividade alta
- **Impacto:** Alto na produtividade e experiência do usuário

**Docker Compose:**
- **Razão:** Deploy simplificado, consistência entre ambientes
- **Benefícios:** Setup em um comando, isolamento de serviços
- **Impacto:** Alto na facilidade de deploy e onboarding

---

## Contribuindo

Este é um projeto de desafio técnico. Se desejar contribuir ou entender o código:

### Padrões Estabelecidos

1. **Arquitetura:**
   - Clean Architecture com 4 camadas
   - DDD com entidades ricas e value objects
   - CQRS com MediatR

2. **Convenções de Código:**
   - C#: Convenções da Microsoft
   - TypeScript: ESLint configurado
   - Conventional Commits para mensagens de commit

3. **Testes:**
   - Mantenha cobertura de testes alta
   - Testes unitários para lógica de negócio
   - Testes de integração para APIs e repositórios

4. **Documentação:**
   - Documente mudanças significativas
   - Mantenha READMEs atualizados
   - Atualize documentação da API quando necessário

### Estrutura de Commits

Use Conventional Commits:
- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `refactor:` Refatoração
- `test:` Testes
- `chore:` Tarefas de manutenção

Exemplo:
```
feat: adiciona filtro de busca por categoria
fix: corrige validação de estoque negativo
docs: atualiza documentação da API
```

---

## Status do Projeto

### Implementado

- Arquitetura Clean Architecture completa com 4 camadas
- DDD com entidades ricas (Product, Category) e value objects (Money, StockQuantity)
- CQRS implementado com MediatR (Commands e Queries separados)
- CRUD completo de produtos (criar, ler, atualizar, excluir, buscar, filtrar)
- CRUD completo de categorias com validação de unicidade
- Dashboard com estatísticas gerais e gráficos por categoria
- Autenticação com Keycloak integrada no frontend (login, logout, refresh)
- Docker Compose funcional para toda a infraestrutura
- Testes estruturados (unitários e integração) no backend e frontend
- Swagger/OpenAPI configurado com documentação interativa
- Interface responsiva e moderna com Shadcn/ui
- Rate limiting configurado para proteção contra abuso
- Health checks implementados (health, ready, live)
- Logging estruturado com Serilog (JSON format)
- Validações em múltiplas camadas (FluentValidation + Zod)

### Em Melhoria

- Ativar autenticação no backend (configurado mas não ativado por padrão)
- Aumentar cobertura de testes (atualmente parcial)
- Implementar sistema de cache (Redis-ready, mas não implementado)
- Adicionar testes E2E completos (atualmente apenas testes unitários/integração)

### Próximos Passos

- CI/CD pipeline (GitHub Actions, GitLab CI, etc.)
- Monitoring e observability avançado (ELK Stack, Prometheus, Grafana)
- Otimizações de performance adicionais (cache, índices, etc.)
- Documentação de APIs mais detalhada (exemplos adicionais, casos de uso)

---

## Licença

Este projeto foi desenvolvido como parte de um desafio técnico.

---

## Autor

Desenvolvido como parte do desafio técnico da Hypesoft.

---

**Última atualização:** Janeiro 2025
