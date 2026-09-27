# 💰 FinTrack — Sistema de Controle Financeiro

Aplicação full-stack de controle financeiro pessoal: receitas, despesas, categorias,
contas/cartões, orçamento mensal, dashboard com gráficos, filtros por período e
exportação em CSV/PDF.

## Stack

- **Frontend:** React + TypeScript + Vite + Tailwind CSS + Recharts + React Router
- **Backend:** Node.js + Express + TypeScript
- **Banco:** PostgreSQL + Prisma ORM
- **Autenticação:** JWT (access token) + Refresh Token
- **Testes:** Vitest + Supertest
- **Deploy sugerido:** Frontend na Vercel · Backend + Postgres no Render/Railway

## Estrutura

```
fintrack/
├── backend/     # API REST (Express + Prisma)
└── frontend/    # SPA (React + Vite)
```

## Como rodar localmente

### 1. Banco de dados

Suba um Postgres local com Docker (já incluso `docker-compose.yml` na raiz):

```bash
docker compose up -d
```

### 2. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate      # cria as tabelas
npm run seed                # (opcional) popula com um usuário demo
npm run dev                 # http://localhost:3333
```

Login de demonstração criado pelo seed: `demo@fintrack.com` / senha `123456`.

Rodar os testes automatizados (usa o mesmo banco configurado em `.env`):

```bash
npm test
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev                 # http://localhost:5173
```

## Principais endpoints da API

| Método | Rota                              | Descrição                          |
|--------|------------------------------------|-------------------------------------|
| POST   | /api/auth/register                | Cria usuário e retorna tokens       |
| POST   | /api/auth/login                   | Login                               |
| POST   | /api/auth/refresh                 | Renova access token                 |
| GET    | /api/accounts                     | Lista contas/cartões                |
| POST   | /api/accounts                     | Cria conta/cartão                   |
| GET    | /api/categories                   | Lista categorias                    |
| POST   | /api/categories                   | Cria categoria                      |
| GET    | /api/transactions                 | Lista transações (filtros + paginação) |
| POST   | /api/transactions                 | Cria transação                      |
| GET    | /api/budgets/progress             | Progresso do orçamento do mês       |
| POST   | /api/budgets                      | Define orçamento mensal             |
| GET    | /api/dashboard/summary            | Receita, despesa e saldo do período |
| GET    | /api/dashboard/expenses-by-category | Dados para o gráfico de pizza     |
| GET    | /api/dashboard/balance-evolution  | Evolução dos últimos N meses        |
| GET    | /api/export/csv                   | Exporta transações em CSV           |
| GET    | /api/export/pdf                   | Exporta transações em PDF           |

Todas as rotas (exceto `/api/auth/*`) exigem `Authorization: Bearer <accessToken>`.

## Deploy

- **Frontend (Vercel):** aponte para a pasta `frontend`, defina `VITE_API_URL` apontando
  para a URL pública do backend.
- **Backend (Render/Railway):** aponte para a pasta `backend`, configure `DATABASE_URL`
  (Postgres gerenciado do próprio Render/Railway), `JWT_ACCESS_SECRET`,
  `JWT_REFRESH_SECRET` e `CORS_ORIGIN` (URL do frontend). Rode `npm run build && npm run
  prisma:generate` no build e `npm start` no start command, e execute
  `npx prisma migrate deploy` antes do primeiro start.

## Próximos passos sugeridos

- Paginação/infinite scroll no dashboard de categorias
- Anexar comprovantes (upload de imagem) às transações
- Notificações quando o orçamento estourar
- Modo multiusuário compartilhado (conta família)
