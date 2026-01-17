# Hypesoft Product Management API

API RESTful para gestão de produtos e categorias, desenvolvida com .NET 9, seguindo Clean Architecture, DDD e CQRS.

---

## Índice

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Execução](#instalação-e-execução)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Endpoints Principais](#endpoints-principais)
- [Configuração](#configuração)
- [Autenticação](#autenticação)
- [Testes](#testes)
- [Docker](#docker)
- [Logs](#logs)
- [Swagger](#swagger)
- [Rate Limiting](#rate-limiting)
- [Dependências Principais](#dependências-principais)

---

## Visão Geral

A API Hypesoft Product Management é uma API RESTful desenvolvida em .NET 9 que fornece funcionalidades completas para gestão de produtos e categorias. O projeto segue Clean Architecture com separação em 4 camadas principais (Domain, Application, Infrastructure, API) e implementa padrões DDD (Domain-Driven Design) e CQRS (Command Query Responsibility Segregation) com MediatR.

### Características Principais

**Arquitetura:**
- Clean Architecture com 4 camadas bem definidas
- DDD com entidades ricas e value objects imutáveis
- CQRS implementado com MediatR
- Inversão de dependências (SOLID principles)

**Funcionalidades:**
- CRUD completo de produtos e categorias
- Busca e filtros avançados (por nome, categoria, status)
- Controle de estoque com operações específicas
- Alertas automáticos de estoque baixo
- Dashboard com estatísticas em tempo real
- Paginação eficiente para grandes volumes de dados

**Qualidade:**
- Validações robustas com FluentValidation
- Error handling padronizado
- Logging estruturado com Serilog (JSON format)
- Health checks implementados
- Documentação interativa com Swagger

**Segurança:**
- Autenticação JWT Bearer configurada (Keycloak)
- Rate limiting por IP
- CORS configurável
- Validações de entrada (FluentValidation)

---

## Arquitetura

O projeto segue **Clean Architecture** com 4 camadas principais:

### Camadas

**1. Domain Layer (Hypesoft.Domain)**
- Entidades de domínio (Product, Category)
- Value Objects (Money, StockQuantity)
- Domain Events (ProductCreatedEvent, StockUpdatedEvent)
- Interfaces (IRepository<T>)
- Enums (ProductStatus)
- Exceções de domínio (BusinessRuleValidationException)

**2. Application Layer (Hypesoft.Application)**
- Commands (CreateProductCommand, UpdateProductCommand, etc.)
- Queries (GetProductsQuery, GetProductByIdQuery, etc.)
- Handlers (CommandHandlers, QueryHandlers)
- DTOs (Data Transfer Objects)
- Validators (FluentValidation validators)
- Mappings (AutoMapper profiles)

**3. Infrastructure Layer (Hypesoft.Infrastructure)**
- Repositórios MongoDB (ProductRepository, CategoryRepository)
- Contexto MongoDB (MongoDbContext)
- Configurações MongoDB (MongoDB configurations)
- Seeders (DatabaseSeeder para dados de exemplo)

**4. Presentation Layer (Hypesoft.API)**
- Controllers REST (ProductsController, CategoriesController, DashboardController)
- Middlewares customizados
- Extensions (Swagger, Services, Health Checks)
- Program.cs (configuração da aplicação)

### Fluxo de Requisição

1. Cliente faz requisição HTTP para um Controller
2. Controller recebe requisição e cria Command/Query via MediatR
3. MediatR envia Command/Query para Handler apropriado
4. Handler executa lógica de negócio e interage com Repository
5. Repository acessa MongoDB através do contexto
6. Resposta é mapeada para DTO e retornada ao cliente

---

## Tecnologias

### Framework e Runtime

- **.NET 9** - Framework principal com C# 13
- **ASP.NET Core** - Framework web para APIs RESTful

### Banco de Dados

- **MongoDB 7.0** - Banco de dados NoSQL
- **MongoDB.Driver 3.1.0** - Driver oficial do MongoDB para .NET

### Padrões e Arquitetura

- **MediatR 12.4.1** - Implementação do padrão Mediator para CQRS
- **AutoMapper 13.0.1** - Mapeamento automático entre objetos

### Validação

- **FluentValidation 11.11.0** - Validação fluente e expressiva

### Logging e Observabilidade

- **Serilog.AspNetCore 8.0.3** - Logging estruturado (JSON format)
- **Health Checks** - Health checks customizados para MongoDB

### Documentação

- **Swashbuckle.AspNetCore 6.9.0** - Swagger/OpenAPI para documentação

### Segurança

- **Keycloak** - Autenticação e autorização (OAuth2/OpenID Connect)
- **AspNetCoreRateLimit 5.0.0** - Rate limiting por IP

---

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **.NET 9 SDK** - [Download](https://dotnet.microsoft.com/download/dotnet/9.0)
- **Docker Desktop** (opcional, para executar MongoDB e Keycloak via Docker)
- **MongoDB 7.0+** (opcional, se não usar Docker)
- **Keycloak 24.0+** (opcional, para autenticação)

**Verificação:**
```bash
dotnet --version    # Deve ser 9.0.x
docker --version    # Opcional, se usar Docker
```

---

## Instalação e Execução

### Opção 1: Executar com Docker Compose (Recomendado)

**Passo 1: Na raiz do projeto backend**
```bash
cd backend
docker-compose up -d
```

**Passo 2: Aguarde alguns segundos para todos os serviços iniciarem**

```bash
# Verifique o status:
docker-compose ps

# Ver logs:
docker-compose logs -f
```

**Passo 3: A API estará disponível em:**
- HTTP: http://localhost:5000
- Swagger: http://localhost:5000/swagger
- Health Check: http://localhost:5000/health

**Comandos úteis:**
```bash
# Ver logs
docker-compose logs -f

# Parar todos os serviços
docker-compose down

# Reconstruir após mudanças
docker-compose build api
docker-compose up -d api
```

**Nota:** Para mais comandos Docker, consulte o arquivo `DOCKER_COMMANDS.md` se disponível.

### Opção 2: Executar Localmente

**Passo 1: Iniciar MongoDB**

Se não estiver usando Docker:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:7.0
```

Ou instale MongoDB localmente: [MongoDB Community Server](https://www.mongodb.com/try/download/community)

**Passo 2: Restaurar dependências**
```bash
cd backend
dotnet restore
```

**Passo 3: Executar a aplicação**
```bash
cd src/Hypesoft.API
dotnet run
```

A API estará disponível em `http://localhost:5000` ou `https://localhost:5001`

**Nota:** Certifique-se de que o MongoDB está rodando antes de iniciar a API.

---

## Estrutura do Projeto

```
backend/
├── src/
│   ├── Hypesoft.API/              # Camada de Apresentação
│   │   ├── Controllers/           # Controllers REST
│   │   │   ├── ProductsController.cs
│   │   │   ├── CategoriesController.cs
│   │   │   ├── DashboardController.cs
│   │   │   └── HealthController.cs
│   │   ├── Extensions/            # Extensions
│   │   │   ├── ServiceCollectionExtensions.cs
│   │   │   ├── SwaggerExtensions.cs
│   │   │   └── HealthCheckExtensions.cs
│   │   ├── Middlewares/           # Middlewares customizados
│   │   ├── Program.cs             # Configuração da aplicação
│   │   └── appsettings.json       # Configurações
│   │
│   ├── Hypesoft.Application/      # Camada de Aplicação (CQRS)
│   │   ├── Commands/              # Commands (escrita)
│   │   │   ├── Products/
│   │   │   │   ├── CreateProductCommand.cs
│   │   │   │   ├── UpdateProductCommand.cs
│   │   │   │   └── ...
│   │   │   └── Categories/
│   │   ├── Queries/               # Queries (leitura)
│   │   │   ├── Products/
│   │   │   │   ├── GetProductsQuery.cs
│   │   │   │   ├── GetProductByIdQuery.cs
│   │   │   │   └── ...
│   │   │   └── Dashboard/
│   │   ├── Handlers/              # Command/Query Handlers
│   │   │   ├── Products/
│   │   │   └── Categories/
│   │   ├── DTOs/                  # Data Transfer Objects
│   │   │   ├── Products/
│   │   │   │   ├── ProductDto.cs
│   │   │   │   ├── CreateProductDto.cs
│   │   │   │   └── ...
│   │   │   └── Common/
│   │   ├── Validators/            # FluentValidation validators
│   │   │   ├── Products/
│   │   │   └── Categories/
│   │   └── Mappings/              # AutoMapper profiles
│   │       └── MappingProfile.cs
│   │
│   ├── Hypesoft.Domain/           # Camada de Domínio
│   │   ├── Entities/              # Entidades de domínio
│   │   │   ├── Product.cs
│   │   │   └── Category.cs
│   │   ├── ValueObjects/          # Value Objects
│   │   │   ├── Money.cs
│   │   │   └── StockQuantity.cs
│   │   ├── Enums/                 # Enumeradores
│   │   │   └── ProductStatus.cs
│   │   ├── DomainEvents/          # Domain Events
│   │   │   ├── ProductCreatedEvent.cs
│   │   │   └── StockUpdatedEvent.cs
│   │   ├── Exceptions/            # Exceções de domínio
│   │   │   └── BusinessRuleValidationException.cs
│   │   └── Interfaces/            # Interfaces (repositories)
│   │       ├── IProductRepository.cs
│   │       └── ICategoryRepository.cs
│   │
│   └── Hypesoft.Infrastructure/   # Camada de Infraestrutura
│       ├── Data/                  # Repositórios e Contexto
│       │   ├── Repositories/
│       │   │   ├── ProductRepository.cs
│       │   │   └── CategoryRepository.cs
│       │   ├── Seeders/
│       │   │   └── DatabaseSeeder.cs
│       │   └── MongoDbContext.cs
│       ├── Configurations/        # Configurações MongoDB
│       │   ├── ProductConfiguration.cs
│       │   └── CategoryConfiguration.cs
│       └── Extensions/            # Extensions
│           └── ServiceCollectionExtensions.cs
│
├── tests/                         # Testes do backend
│   ├── Hypesoft.Domain.Tests/    # Testes de domínio
│   ├── Hypesoft.Application.Tests/ # Testes de aplicação
│   ├── Hypesoft.Infrastructure.Tests/ # Testes de infraestrutura
│   └── Hypesoft.API.Tests/       # Testes de API
│
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## Endpoints Principais

### Produtos

- `GET /api/products` - Listar produtos (com paginação e filtros)
  - Query parameters: `pageNumber`, `pageSize`, `categoryId`, `status`
- `GET /api/products/{id}` - Obter produto por ID
- `GET /api/products/search?q={term}` - Buscar produtos por nome
- `GET /api/products/low-stock` - Obter produtos com estoque baixo
- `POST /api/products` - Criar produto
- `PUT /api/products/{id}` - Atualizar produto
- `PUT /api/products/{id}/stock` - Atualizar estoque
- `DELETE /api/products/{id}` - Excluir produto

### Categorias

- `GET /api/categories` - Listar todas as categorias
- `GET /api/categories/{id}` - Obter categoria por ID
- `GET /api/categories/{id}/products` - Obter produtos da categoria
- `POST /api/categories` - Criar categoria
- `PUT /api/categories/{id}` - Atualizar categoria
- `DELETE /api/categories/{id}` - Excluir categoria

**Nota:** A exclusão de categoria falhará se houver produtos associados (integridade referencial).

### Dashboard

- `GET /api/dashboard/stats` - Estatísticas gerais (total de produtos, categorias, estoque)
- `GET /api/dashboard/low-stock` - Produtos com estoque baixo
- `GET /api/dashboard/products-by-category` - Gráfico de produtos por categoria

### Health Checks

- `GET /health` - Health check básico (retorna status de todos os checks)
- `GET /health/ready` - Readiness check (API pronta para receber requisições)
- `GET /health/live` - Liveness check (API viva)

**Documentação completa:** Consulte [DOCUMENTACAO_API.md](../DOCUMENTACAO_API.md) para documentação detalhada de todos os endpoints com exemplos.

---

## Configuração

As configurações estão em `appsettings.json` e `appsettings.Development.json`:

### MongoDB

```json
{
  "ConnectionStrings": {
    "MongoDB": "mongodb://mongodb:27017"
  },
  "MongoDB": {
    "DatabaseName": "hypesoft"
  }
}
```

**Nota:** Em Docker Compose, use o hostname do serviço (`mongodb`). Localmente, use `localhost`.

### Keycloak

```json
{
  "Keycloak": {
    "Authority": "http://keycloak:8080/realms/hypesoft",
    "Audience": "hypesoft-api"
  }
}
```

### Rate Limiting

```json
{
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

### CORS

```json
{
  "Cors": {
    "AllowedOrigins": ["http://localhost:3000"]
  }
}
```

### Serilog

Logging estruturado configurado para:
- Console (durante desenvolvimento)
- Arquivo: `logs/hypesoft-YYYY-MM-DD.txt` (rotaciona diariamente)

---

## Autenticação

A autenticação com Keycloak está configurada mas pode estar desabilitada por padrão em desenvolvimento.

### Para Ativar Autenticação

1. Configure o Keycloak (crie realm e client)
2. Descomente as linhas de autenticação no `Program.cs` se necessário
3. Adicione `[Authorize]` nos controllers que precisam de autenticação

### Exemplo de Controller Protegido

```csharp
[ApiController]
[Route("api/[controller]")]
[Authorize] // Requer autenticação
public class ProductsController : ControllerBase
{
    // ...
}
```

### Obter Token JWT

1. Acesse o Keycloak: http://localhost:8080
2. Faça login no realm `hypesoft`
3. Obtenha o token via OAuth2/OpenID Connect flow
4. Use o token no header `Authorization: Bearer {token}`

---

## Testes

**Executar todos os testes:**
```bash
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

### Estrutura de Testes

**Hypesoft.Domain.Tests:**
- Testes unitários de entidades (Product, Category)
- Testes de value objects (Money, StockQuantity)
- Testes de regras de negócio

**Hypesoft.Application.Tests:**
- Testes de handlers (commands e queries)
- Testes de validators (FluentValidation)
- Testes de mapeamento (AutoMapper)

**Hypesoft.Infrastructure.Tests:**
- Testes de integração com MongoDB
- Testes de repositórios
- Testes de seeders

**Hypesoft.API.Tests:**
- Testes de controllers
- Testes de middlewares
- Testes de health checks

---

## Docker

### Build da Imagem

```bash
docker build -t hypesoft-api .
```

### Executar Container

```bash
docker run -p 5000:5000 hypesoft-api
```

### Docker Compose

Consulte o `docker-compose.yml` na raiz do projeto para executar toda a infraestrutura (API, MongoDB, Keycloak).

---

## Logs

Os logs são gerados em:

- **Console** (durante desenvolvimento)
- **Arquivo:** `logs/hypesoft-YYYY-MM-DD.txt` (rotaciona diariamente)

**Formato:** JSON estruturado (facilita parsing e análise)

**Níveis de log:**
- Information: Operações normais
- Warning: Avisos e situações não críticas
- Error: Erros que precisam atenção
- Fatal: Erros críticos que impedem execução

---

## Swagger

A documentação Swagger está disponível em:

- **Desenvolvimento:** http://localhost:5000/swagger
- **Recursos:**
  - Documentação interativa de todos os endpoints
  - Exemplos de requisições e respostas
  - Suporte para autenticação JWT Bearer
  - Teste de endpoints diretamente na interface

**Configuração:** Configurada via `SwaggerExtensions.cs` com:
- Informações da API (título, versão, descrição)
- Suporte a autenticação Bearer JWT
- Documentação XML (se habilitada)

---

## Rate Limiting

A API possui rate limiting configurado para proteção contra abuso:

- **Geral:** 100 requisições por minuto por IP
- **POST /api/products:** 10 requisições por minuto por IP
- **POST /api/categories:** 10 requisições por minuto por IP

**Quando o limite é excedido:**
- Status Code: `429 Too Many Requests`
- Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `Retry-After`

**Configuração:** Defina regras em `appsettings.json` na seção `IpRateLimiting`.

---

## Dependências Principais

### Framework e Runtime

- **Microsoft.AspNetCore.App** - Framework ASP.NET Core
- **Microsoft.Extensions.*** - Extensões e utilitários

### Banco de Dados

- **MongoDB.Driver 3.1.0** - Driver oficial do MongoDB

### Padrões e Arquitetura

- **MediatR 12.4.1** - CQRS com Mediator pattern
- **AutoMapper 13.0.1** - Mapeamento automático

### Validação

- **FluentValidation 11.11.0** - Validação fluente
- **FluentValidation.DependencyInjectionExtensions** - DI para FluentValidation

### Logging

- **Serilog.AspNetCore 8.0.3** - Logging estruturado
- **Serilog.Sinks.Console** - Console sink
- **Serilog.Sinks.File** - File sink

### Documentação

- **Swashbuckle.AspNetCore 6.9.0** - Swagger/OpenAPI

### Segurança

- **AspNetCoreRateLimit 5.0.0** - Rate limiting
- **Microsoft.AspNetCore.Authentication.JwtBearer** - JWT Bearer authentication

### Health Checks

- **Microsoft.Extensions.Diagnostics.HealthChecks** - Health checks
- **AspNetCore.HealthChecks.MongoDb** - MongoDB health check

---
