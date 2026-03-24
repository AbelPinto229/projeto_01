# Projeto ClickUP API

**Autor:** Abel Pinto

**Repositório GitHub:** [https://github.com/AbelPinto229/projeto_01.git](https://github.com/AbelPinto229/projeto_01.git)

## Passos para executar o código

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/AbelPinto229/projeto_01.git
   cd seu-repositorio
   ```
2. **Instale as dependências:**
   ```bash
   npm install
   ```
3. **Configure o banco de dados:**
   - Crie um banco MySQL e importe o arquivo `database.sql`.
   - Configure as variáveis de ambiente no arquivo `.env` (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT).
4. **Inicie o servidor:**
   ```bash
   npm start
   ```
5. **Acesse a API:**
   - O servidor estará disponível em `http://localhost:3000` (ou porta definida no `.env`).

## Principais decisões tomadas e justificação

- **Estrutura em camadas (controllers, services, routes):**
  - Separação clara de responsabilidades facilita manutenção, testes e escalabilidade.
- **Uso de async/await:**
  - Permite código assíncrono mais limpo e fácil de entender.
- **Validação e tratamento de erros:**
  - Controllers retornam status HTTP adequados e mensagens claras para o cliente.
- **SQL parametrizado:**
  - Previne SQL Injection e aumenta a segurança.
- **Remoção de comentários e código limpo:**
  - Facilita leitura e entendimento do código por outros desenvolvedores.

Essas decisões garantem um projeto robusto, seguro e de fácil evolução.

## Endpoints disponíveis

### Usuários (`/users`)
- `GET /users` — Lista todos os usuários (parâmetros: `search`, `sort`)
- `GET /users/stats` — Estatísticas de usuários
- `POST /users` — Cria um novo usuário
- `GET /users/:id/tasks` — Lista tarefas atribuídas ao usuário
- `PUT /users/:id` — Atualiza usuário (requer middleware)
- `PATCH /users/:id` — Alterna status ativo/inativo (requer middleware)
- `DELETE /users/:id` — Remove usuário (requer middleware)
- `GET /users/:id` — Busca usuário por ID (requer middleware)

### Tarefas (`/tasks`)
- `GET /tasks` — Lista todas as tarefas (parâmetros: `search`, `sort`)
- `GET /tasks/stats` — Estatísticas de tarefas
- `POST /tasks` — Cria uma nova tarefa
- `PUT /tasks/:id` — Atualiza tarefa
- `DELETE /tasks/:id` — Remove tarefa
- `POST /tasks/:id/tags` — Adiciona tag à tarefa
- `GET /tasks/:id/comments` — Lista comentários da tarefa
- `POST /tasks/:id/comments` — Cria comentário na tarefa
- `PUT /tasks/:id/comments/:commentId` — Atualiza comentário
- `DELETE /tasks/:id/comments/:commentId` — Remove comentário

### Tags (`/tags`)
- `GET /tags` — Lista todas as tags
- `POST /tags` — Cria uma nova tag
- `GET /tags/:id/tasks` — Lista tarefas com a tag
- `DELETE /tags/:id` — Remove tag