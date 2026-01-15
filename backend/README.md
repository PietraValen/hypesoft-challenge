# Hypesoft Product Management API

API RESTful para gestão de produtos e categorias, desenvolvida com .NET 9, seguindo Clean Architecture, DDD e CQRS.

## 🏗️ Arquitetura

O projeto segue **Clean Architecture** com 4 camadas principais:

- **Domain**: Entidades, Value Objects, Interfaces e Regras de Negócio
- **Application**: Commands, Queries, Handlers, DTOs e Validators (CQRS + MediatR)
- **Infrastructure**: Implementações de repositórios MongoDB e serviços externos
- **API**: Controllers, Middlewares, Filters e configurações

## 🚀 Tecnologias

- **.NET 9** com C#
- **MongoDB** como banco de dados
- **MediatR** para CQRS
- **FluentValidation** para validação
- **AutoMapper** para mapeamento
- **Serilog** para logging estruturado
- **Swagger/OpenAPI** para documentação
- **Keycloak** para autenticação (configurado, mas não ativado por padrão)
- **AspNetCoreRateLimit** para rate limiting

## 📋 Pré-requisitos

- .NET 9 SDK
- Docker Desktop (para executar MongoDB e Keycloak)
- MongoDB (ou usar Docker)

## 🔧 Instalação e Execução

### Opção 1: Executar com Docker Compose (Recomendado)

```bash
# Na raiz do projeto backend
docker-compose up -d

# Aguarde alguns segundos para todos os serviços iniciarem
# Verifique o status:
docker-compose ps

# A API estará disponível em:
# - http://localhost:5000
# - Swagger: http://localhost:5000/swagger
# - Health Check: http://localhost:5000/health
```

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

Para mais comandos Docker, consulte o arquivo `DOCKER_COMMANDS.md`

### Opção 2: Executar Localmente

1. **Iniciar MongoDB** (se não estiver usando Docker):
```bash
docker run -d -p 27017:27017 --name mongodb mongo:7.0
```

2. **Restaurar dependências**:
```bash
dotnet restore
```

3. **Executar a aplicação**:
```bash
cd src/Hypesoft.API
dotnet run
```

A API estará disponível em `http://localhost:5000` ou `https://localhost:5001`

## 📚 Endpoints Principais

### Produtos

- `GET /api/products` - Listar produtos (com paginação e filtros)
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

### Dashboard

- `GET /api/dashboard/stats` - Estatísticas gerais
- `GET /api/dashboard/low-stock` - Produtos com estoque baixo
- `GET /api/dashboard/products-by-category` - Gráfico de produtos por categoria

### Health Checks

- `GET /health` - Health check básico
- `GET /health/ready` - Readiness check
- `GET /health/live` - Liveness check

## 🔐 Autenticação

A autenticação com Keycloak está configurada mas desabilitada por padrão. Para ativar:

1. Descomente as linhas de autenticação no `Program.cs`
2. Configure o Keycloak conforme necessário
3. Adicione `[Authorize]` nos controllers que precisam de autenticação

## ⚙️ Configuração

As configurações estão em `appsettings.json` e `appsettings.Development.json`:

- **MongoDB**: Connection string e nome do banco
- **Keycloak**: Authority e Audience
- **Rate Limiting**: Regras de limite de requisições
- **Serilog**: Configuração de logging

## 🧪 Testes

Para executar os testes (quando implementados):

```bash
dotnet test
```

## 📝 Estrutura do Projeto

```
backend/
├── src/
│   ├── Hypesoft.API/          # Camada de Apresentação
│   ├── Hypesoft.Application/  # Camada de Aplicação (CQRS)
│   ├── Hypesoft.Domain/       # Camada de Domínio
│   └── Hypesoft.Infrastructure/ # Camada de Infraestrutura
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## 🐳 Docker

### Build da imagem:
```bash
docker build -t hypesoft-api .
```

### Executar container:
```bash
docker run -p 5000:5000 hypesoft-api
```

## 📊 Logs

Os logs são gerados em:
- Console (durante desenvolvimento)
- Arquivo: `logs/hypesoft-YYYY-MM-DD.txt`

## 🔍 Swagger

A documentação Swagger está disponível em:
- **Desenvolvimento**: http://localhost:5000/swagger
- Inclui exemplos de requisições e respostas
- Suporte para autenticação JWT Bearer

## 🚨 Rate Limiting

A API possui rate limiting configurado:
- Geral: 100 requisições por minuto
- POST /api/products: 10 requisições por minuto
- POST /api/categories: 10 requisições por minuto

## 📦 Dependências Principais

- MediatR 12.4.1
- FluentValidation 11.11.0
- AutoMapper 13.0.1
- MongoDB.Driver 3.1.0
- Serilog.AspNetCore 8.0.3
- AspNetCoreRateLimit 5.0.0
- Swashbuckle.AspNetCore 6.9.0

## 🤝 Contribuindo

Este é um projeto de desafio técnico. Siga os padrões estabelecidos:
- Clean Architecture
- CQRS com MediatR
- DDD (Domain-Driven Design)
- Commits seguindo Conventional Commits

## 📄 Licença

Este projeto faz parte do desafio técnico da Hypesoft.
