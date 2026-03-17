# Projeto 01 - API ClickUp

API REST desenvolvida com Node.js e Express para gerenciamento de tarefas.

## Estrutura do Projeto

```
projeto_01/
├── src/
│   ├── controllers/     # Controladores das rotas
│   ├── services/        # Lógica de negócio
│   ├── routes/          # Definição de rotas
│   ├── middlewares/     # Middlewares personalizados
│   └── app.js          # Configuração principal
├── package.json
└── README.md
```

## Endpoints Disponíveis

### Tasks
- **GET** `/tasks` - Lista todas as tarefas (suporta `?sort=asc|desc` e `?search=texto`)
- **GET** `/tasks/stats` - Estatísticas das tarefas
- **GET** `/tasks/:id/comments` - Lista comentários de uma tarefa
- **POST** `/tasks` - Cria uma nova tarefa
- **POST** `/tasks/:id/tags` - Associa uma tag a uma tarefa
- **POST** `/tasks/:id/comments` - Cria um comentário em uma tarefa
- **PUT** `/tasks/:id` - Atualiza uma tarefa
- **DELETE** `/tasks/:id` - Deleta uma tarefa

### Users
- **GET** `/users` - Lista todos os usuários (suporta `?sort=asc|desc` e `?search=texto`)
- **GET** `/users/stats` - Estatísticas dos usuários
- **GET** `/users/:id` - Busca um usuário por id
- **POST** `/users` - Cria um novo usuário
- **PUT** `/users/:id` - Atualiza um usuário
- **PATCH** `/users/:id` - Alterna status ativo/inativo
- **DELETE** `/users/:id` - Deleta um usuário

### Tags
- **GET** `/tags` - Lista todas as tags
- **GET** `/tags/:id/tasks` - Lista tarefas de uma tag
- **POST** `/tags` - Cria uma nova tag
- **DELETE** `/tags/:id` - Deleta uma tag

## Instalação

```bash
npm install
```

## Executar

```bash
npm start
```

Servidor rodará em: `http://localhost:3000`

## Tecnologias

- Node.js
- Express.js
- ES6 Modules
