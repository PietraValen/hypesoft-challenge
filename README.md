# Hypesoft Challenge - Sistema de Gestão de Produtos

Sistema completo de gestão de produtos e categorias desenvolvido seguindo as melhores práticas de Clean Architecture, DDD e CQRS. Projeto full-stack com backend em .NET 9 e frontend em Next.js 14.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Execução](#instalação-e-execução)
- [Documentação](#documentação)
- [Testes](#testes)
- [Decisões Arquiteturais](#decisões-arquiteturais)
- [Contribuindo](#contribuindo)

## 🎯 Visão Geral

Este projeto implementa um sistema completo de gestão de produtos com as seguintes funcionalidades:

### Funcionalidades Principais

- ✅ **Gestão de Produtos:**
  - CRUD completo (Criar, Ler, Atualizar, Excluir)
  - Busca e filtros avançados
  - Controle de estoque
  - Alertas de estoque baixo
  - Status de produtos (Ativo, Inativo, Descontinuado)

- ✅ **Gestão de Categorias:**
  - CRUD completo
  - Validação de nomes únicos
  - Relacionamento com produtos

- ✅ **Dashboard:**
  - Estatísticas gerais
  - Visualização de produtos por categoria
  - Lista de produtos com estoque baixo
  - Gráficos e métricas

- ✅ **Autenticação:**
  - Integração com Keycloak
  - Login/Logout
  - Registro de usuários
  - Refresh automático de tokens
  - Proteção de rotas

### Diferenciais Técnicos

- 🏗️ **Clean Architecture** com separação clara de responsabilidades
- 📚 **DDD (Domain-Driven Design)** com entidades ricas e value objects
- ⚡ **CQRS** com MediatR para separação de commands e queries
- 🔒 **Autenticação Enterprise** com Keycloak
- 🚀 **Performance** otimizada com índices MongoDB e paginação
- 🧪 **Testes** estruturados (unitários e de integração)
- 🐳 **Docker** para fácil deploy e desenvolvimento
- 📊 **Monitoring** com health checks e structured logging

## 🏗️ Arquitetura

O projeto segue **Clean Architecture** com 4 camadas principais:

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

- **Separação de Responsabilidades:** Cada camada tem responsabilidade única e bem definida
- **Inversão de Dependência:** Camadas superiores dependem de abstrações (interfaces) definidas nas camadas inferiores
- **Independência de Frameworks:** Domain layer é independente de frameworks e bibliotecas externas
- **Testabilidade:** Cada camada pode ser testada independentemente

## 🚀 Tecnologias

### Backend
- **.NET 9** - Framework principal
- **MongoDB** - Banco de dados NoSQL
- **MediatR** - Implementação de CQRS
- **AutoMapper** - Mapeamento de objetos
- **FluentValidation** - Validação de dados
- **Serilog** - Logging estruturado
- **Keycloak** - Autenticação e autorização
- **Swagger/OpenAPI** - Documentação da API
- **AspNetCoreRateLimit** - Rate limiting

### Frontend
- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **TailwindCSS** - Estilização utilitária
- **Shadcn/ui** - Componentes UI
- **TanStack Query** - Gerenciamento de estado servidor
- **React Hook Form** - Formulários
- **Zod** - Validação de schemas
- **Keycloak JS** - Cliente Keycloak
- **Recharts** - Gráficos e visualizações
- **Vitest** - Framework de testes

### Infraestrutura
- **Docker** - Containerização
- **Docker Compose** - Orquestração de serviços
- **MongoDB** - Banco de dados
- **Keycloak** - Servidor de autenticação
- **PostgreSQL** - Banco de dados do Keycloak

## 📁 Estrutura do Projeto

```
hypesoft-challenge/
├── backend/                    # Backend .NET
│   ├── src/
│   │   ├── Hypesoft.API/      # Camada de apresentação
│   │   ├── Hypesoft.Application/  # Camada de aplicação (CQRS)
│   │   ├── Hypesoft.Domain/   # Camada de domínio
│   │   └── Hypesoft.Infrastructure/  # Camada de infraestrutura
│   ├── tests/                 # Testes do backend
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── README.md
│
├── frontend/                   # Frontend Next.js
│   ├── src/
│   │   ├── app/               # Next.js App Router
│   │   ├── components/        # Componentes React
│   │   ├── lib/               # Utilitários e configurações
│   │   ├── hooks/             # Hooks customizados
│   │   └── types/             # Tipos TypeScript
│   ├── Dockerfile
│   └── README.md
│
├── docker-compose.yml          # Compose principal (todos os serviços)
├── README.md                   # Este arquivo
└── VERIFICACAO_CRITERIOS.md    # Verificação de critérios de avaliação
```

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Docker Desktop** (recomendado) ou Docker + Docker Compose
- **Git**
- **Node.js 18+** (opcional, se quiser rodar frontend localmente)
- **.NET 9 SDK** (opcional, se quiser rodar backend localmente)

## 🚀 Instalação e Execução

### Opção 1: Executar com Docker Compose (Recomendado) ✅

Esta é a forma mais simples de executar todo o sistema:

```bash
# 1. Clone o repositório
git clone <url-do-repositorio>
cd hypesoft-challenge

# 2. Execute o Docker Compose (na raiz do projeto)
docker-compose up -d

# 3. Aguarde alguns segundos para todos os serviços iniciarem
# Verifique o status:
docker-compose ps

# 4. Acesse as aplicações:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:5000
# - Swagger: http://localhost:5000/swagger
# - Keycloak: http://localhost:8080
# - MongoDB: localhost:27017
```

**Serviços incluídos:**
- 🎨 **Frontend** (Next.js) - Porta 3000
- 🔌 **Backend API** (.NET) - Porta 5000
- 🔐 **Keycloak** (Autenticação) - Porta 8080
- 🍃 **MongoDB** (Banco de dados) - Porta 27017
- 🐘 **PostgreSQL** (Keycloak DB) - Porta 5432 (interno)

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
```

### Opção 2: Executar Localmente

Se preferir executar localmente sem Docker:

#### Backend

```bash
cd backend

# 1. Certifique-se de que o MongoDB está rodando
# Via Docker:
docker run -d -p 27017:27017 --name mongodb mongo:7.0

# 2. Restaurar dependências
dotnet restore

# 3. Executar a API
cd src/Hypesoft.API
dotnet run

# API estará disponível em:
# - http://localhost:5000
# - Swagger: http://localhost:5000/swagger
```

**Configuração:** Edite `backend/src/Hypesoft.API/appsettings.json` se necessário.

#### Frontend

```bash
cd frontend

# 1. Instalar dependências
npm install

# 2. Criar arquivo .env.local
cp .env.example .env.local
# Edite .env.local com as configurações necessárias

# 3. Executar em desenvolvimento
npm run dev

# Frontend estará disponível em:
# - http://localhost:3000
```

**Configuração do Keycloak:** Consulte `frontend/KEYCLOAK_SETUP.md` para configurar o Keycloak.

## 🔧 Configuração Inicial

### 1. Configurar Keycloak

O Keycloak precisa ser configurado antes de usar autenticação:

1. Acesse http://localhost:8080
2. Login no Admin Console (admin/admin)
3. Siga o guia em `KEYCLOAK_QUICK_SETUP.md`

Ou consulte os guias detalhados:
- `KEYCLOAK_QUICK_SETUP.md` - Guia rápido
- `frontend/KEYCLOAK_SETUP.md` - Guia detalhado

### 2. Banco de Dados

O MongoDB é populado automaticamente com dados de exemplo quando a API inicia em modo **Development**.

**Dados de exemplo incluídos:**
- 4 categorias (Eletrônicos, Roupas, Alimentos, Livros)
- Produtos relacionados a cada categoria
- Estoque variado para demonstrar funcionalidades

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

## 📚 Documentação

### Documentação Principal
- **[README Backend](backend/README.md)** - Documentação completa do backend
- **[README Frontend](frontend/README.md)** - Documentação completa do frontend
- **[Verificação de Critérios](VERIFICACAO_CRITERIOS.md)** - Checklist de avaliação

### Guias Específicos
- **[KEYCLOAK_QUICK_SETUP.md](KEYCLOAK_QUICK_SETUP.md)** - Configuração rápida do Keycloak
- **[frontend/KEYCLOAK_SETUP.md](frontend/KEYCLOAK_SETUP.md)** - Guia detalhado do Keycloak
- **[frontend/TESTING.md](frontend/TESTING.md)** - Guia de testes do frontend
- **[backend/ESTRUTURA_BANCO.md](backend/ESTRUTURA_BANCO.md)** - Estrutura do banco de dados
- **[ARCHITECTURE_DECISIONS.md](ARCHITECTURE_DECISIONS.md)** - Decisões arquiteturais (ADR)
- **[GIT_FLOW.md](GIT_FLOW.md)** - Guia de Git Flow e convenções de commits

### Documentação da API
- **Swagger UI:** http://localhost:5000/swagger (quando API estiver rodando)
- Documentação interativa com exemplos de requisições e respostas

## 🧪 Testes

### Backend

```bash
cd backend

# Executar todos os testes
dotnet test

# Executar testes com cobertura
dotnet test --collect:"XPlat Code Coverage"

# Executar testes de um projeto específico
dotnet test tests/Hypesoft.Domain.Tests
```

**Projetos de teste:**
- `Hypesoft.Domain.Tests` - Testes de domínio
- `Hypesoft.Application.Tests` - Testes de aplicação
- `Hypesoft.Infrastructure.Tests` - Testes de infraestrutura
- `Hypesoft.API.Tests` - Testes de API

### Frontend

```bash
cd frontend

# Executar todos os testes
npm test

# Executar testes em modo watch
npm test -- --watch

# Executar testes com UI
npm run test:ui

# Executar testes com cobertura
npm run test:coverage
```

**Estrutura de testes:**
- Testes unitários de componentes
- Testes de hooks customizados
- Testes de integração de páginas
- Testes de utilitários

**Mais detalhes:** Consulte [frontend/TESTING.md](frontend/TESTING.md)

## 🏛️ Decisões Arquiteturais

Para documentação completa das decisões arquiteturais, consulte **[ARCHITECTURE_DECISIONS.md](ARCHITECTURE_DECISIONS.md)**.

### Por que Clean Architecture?

- **Testabilidade:** Permite testar cada camada independentemente
- **Manutenibilidade:** Mudanças em uma camada não afetam outras
- **Independência:** Domain não depende de frameworks ou bancos de dados
- **Escalabilidade:** Facilita adicionar novas funcionalidades

### Por que DDD?

- **Entidades Ricas:** Comportamentos encapsulados nas entidades
- **Value Objects:** Validações e imutabilidade garantidas
- **Domain Events:** Comunicação desacoplada entre bounded contexts
- **Ubiquitous Language:** Código reflete a linguagem do negócio

### Por que CQRS?

- **Separação de Responsabilidades:** Commands para escrita, Queries para leitura
- **Performance:** Otimizações diferentes para leitura e escrita
- **Escalabilidade:** Possibilidade de escalar reads e writes independentemente
- **Clareza:** Código mais claro e focado

### Por que MongoDB?

- **Flexibilidade:** Schema flexível facilita evolução
- **Performance:** Boa performance para leitura
- **Escalabilidade:** Horizontal scaling facilitado
- **JSON nativo:** Alinhado com APIs REST JSON

### Por que Keycloak?

- **Enterprise-grade:** Solução robusta e madura
- **Padrões:** Suporte a OAuth2, OpenID Connect, SAML
- **Gestão de usuários:** Interface administrativa completa
- **Multi-tenancy:** Suporte a múltiplos realms

### Por que Next.js?

- **SSR/SSG:** Renderização no servidor para melhor SEO
- **App Router:** Nova arquitetura moderna e performática
- **Developer Experience:** Excelente DX com hot reload e TypeScript
- **Ecosystem:** Rico ecossistema de componentes e bibliotecas

## 🤝 Contribuindo

Este é um projeto de desafio técnico. Para contribuir:

1. Siga os padrões estabelecidos:
   - Clean Architecture
   - CQRS com MediatR
   - DDD (Domain-Driven Design)
   - Conventional Commits

2. Mantenha a cobertura de testes alta

3. Documente mudanças significativas

4. Siga os padrões de código:
   - C#: Convenções da Microsoft
   - TypeScript: ESLint configurado

## 📊 Status do Projeto

### ✅ Implementado
- [x] Arquitetura Clean Architecture completa
- [x] DDD com entidades ricas e value objects
- [x] CQRS com MediatR
- [x] CRUD completo de produtos e categorias
- [x] Autenticação com Keycloak (frontend)
- [x] Dashboard com estatísticas e gráficos
- [x] Docker Compose funcional
- [x] Testes estruturados (backend e frontend)
- [x] Swagger/OpenAPI configurado
- [x] Interface responsiva e moderna

### ⚠️ Em Melhoria
- [ ] Ativar autenticação no backend
- [ ] Aumentar cobertura de testes
- [ ] Implementar sistema de cache
- [ ] Adicionar testes E2E

### 📝 Próximos Passos
- [ ] CI/CD pipeline
- [ ] Monitoring e observability
- [ ] Otimizações de performance adicionais
- [ ] Documentação de APIs mais detalhada

## 📝 Licença

Este projeto foi desenvolvido como parte de um desafio técnico.

## 👥 Autor

Desenvolvido como parte do desafio técnico da Hypesoft.

---

**Última atualização:** Janeiro 2025
