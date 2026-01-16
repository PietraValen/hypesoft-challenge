# ShopSense Dashboard - Frontend

Frontend moderno e responsivo para o sistema de gestão de produtos, construído com Next.js 14, TypeScript, TailwindCSS e Shadcn/ui.

## Tecnologias

- **Next.js 14** (App Router) - Framework React com SSR/SSG
- **TypeScript** - Tipagem estática
- **TailwindCSS** - Estilização utilitária
- **Shadcn/ui** - Componentes UI base
- **TanStack Query** - Gerenciamento de estado servidor
- **React Hook Form + Zod** - Formulários e validação
- **Recharts** - Gráficos e visualizações
- **Keycloak JS** - Autenticação OAuth2/OpenID Connect
- **Vitest + React Testing Library** - Testes unitários e de integração

## Configuração

### Instalação

```bash
npm install
```

### Variáveis de Ambiente

Crie um arquivo `.env.local` baseado no `.env.example`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8080
NEXT_PUBLIC_KEYCLOAK_REALM=hypesoft
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=hypesoft-frontend
```

### Executar em Desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

### Build para Produção

```bash
npm run build
npm start
```

### Testes

```bash
npm test
npm run test:ui
npm run test:coverage
```

## Estrutura do Projeto

```
frontend/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/        # Componentes React
│   ├── lib/              # Utilitários e configurações
│   ├── hooks/            # Hooks customizados
│   ├── types/            # Tipos TypeScript
│   └── stores/           # Estado global
├── public/               # Arquivos estáticos
└── tests/                # Testes
```

## Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm start` - Inicia servidor de produção
- `npm run lint` - Executa ESLint
- `npm test` - Executa testes
- `npm run test:ui` - Executa testes com interface
- `npm run test:coverage` - Executa testes com cobertura
