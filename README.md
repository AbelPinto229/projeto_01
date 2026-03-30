# Projeto Task Manager (Backend + Frontend)

Autor: Abel Pinto

Repositorio GitHub: https://github.com/AbelPinto229/projeto_01.git

## Visao Geral

Este repositorio contem:

- Um backend em Node.js + Express + MySQL (pasta `src/`)
- Um frontend em TypeScript + Vite (pasta `frontend/`)

O frontend consome a API em `http://localhost:3000`.

## Requisitos

- Node.js 18+
- MySQL 8+

## Configuracao do Backend

1. Clone o repositorio:

```bash
git clone https://github.com/AbelPinto229/projeto_01.git
cd projeto_01
```

2. Instale dependencias do backend:

```bash
npm install
```

3. Crie a base de dados e importe o schema:

- Use o ficheiro `database.sql`

4. Crie o ficheiro `.env` na raiz com as variaveis:

```env
DB_HOST=localhost
DB_USER=seu_utilizador
DB_PASSWORD=sua_password
DB_NAME=seu_banco
DB_PORT=3306
PORT=3000
```

5. Inicie o backend:

```bash
npm start
```

Backend disponivel em: `http://localhost:3000`

## Configuracao do Frontend

1. Entre na pasta do frontend:

```bash
cd frontend
```

2. Instale dependencias:

```bash
npm install
```

3. Inicie em modo desenvolvimento:

```bash
npm run dev
```

Frontend disponivel em: `http://localhost:5173`

## Scripts

### Backend (raiz)

- `npm start`: inicia a API

### Frontend (`frontend/`)

- `npm run dev`: inicia Vite
- `npm run build`: compila TypeScript e gera build
- `npm run preview`: serve o build gerado

## Endpoints da API

### Users (`/users`)

- `GET /users`
- `GET /users/stats`
- `POST /users`
- `GET /users/:id/tasks`
- `PUT /users/:id`
- `PATCH /users/:id`
- `DELETE /users/:id`
- `GET /users/:id`

### Tasks (`/tasks`)

- `GET /tasks`
- `GET /tasks/stats`
- `POST /tasks`
- `PUT /tasks/:id`
- `DELETE /tasks/:id`
- `POST /tasks/:id/tags`
- `DELETE /tasks/:id/tags/:tagId`
- `GET /tasks/:id/comments`
- `POST /tasks/:id/comments`
- `PUT /tasks/:id/comments/:commentId`
- `DELETE /tasks/:id/comments/:commentId`

### Tags (`/tags`)

- `GET /tags`
- `POST /tags`
- `GET /tags/:id/tasks`
- `DELETE /tags/:id`