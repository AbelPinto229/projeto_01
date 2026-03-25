# Task Manager Frontend

Frontend moderno para o gestor de tarefas. Interface completa para gestão de utilizadores, tarefas, comentários e tags.

## 🚀 Funcionalidades

- ✅ **Gestão de Utilizadores** - CRUD completo
- ✅ **Gestão de Tarefas** - Criar, editar, deletar e marcar como concluída
- ✅ **Sistema de Tags** - Categorizar tarefas
- ✅ **Comentários** - Discussão sobre tarefas
- ✅ **Dashboard** - Estatísticas em tempo real
- ✅ **Controle de Roles** - Admin, Manager, Member, Viewer
- ✅ **Notificações** - Feedback das ações
- ✅ **Logging** - Sistema de logs integrado

## 📦 Instalação

```bash
npm install
```

## 🛠️ Desenvolvimento

```bash
npm run dev
```

A aplicação abrirá em `http://localhost:5173`

## 🏗️ Build

```bash
npm run build
```

## 📁 Estrutura de Pastas

```
src/
├── services/          # Serviços para chamadas à API
├── models/            # Tipos e interfaces de dados
├── ui/                # Componentes de renderização
├── security/          # Gestão de roles e permissões
├── logs/              # Sistema de logging
├── notifications/     # Serviço de notificações
├── utils/             # Utilitários e helpers
└── tasks/             # Funções relacionadas a tarefas
```

## 🔗 Integração Backend

O frontend comunica com a API do backend em `http://localhost:3000`

### Endpoints Utilizados

- **GET** `/users` - Lista utilizadores
- **POST** `/users` - Cria utilizador
- **PUT** `/users/:id` - Atualiza utilizador
- **PATCH** `/users/:id` - Alterna status
- **DELETE** `/users/:id` - Deleta utilizador
- **GET** `/tasks` - Lista tarefas
- **POST** `/tasks` - Cria tarefa
- **PUT** `/tasks/:id` - Atualiza tarefa
- **PATCH** `/tasks/:id` - Alterna status
- **DELETE** `/tasks/:id` - Deleta tarefa
- **POST** `/tasks/:id/comments` - Adiciona comentário
- **PUT** `/tasks/:id/comments/:commentId` - Atualiza comentário
- **DELETE** `/tasks/:id/comments/:commentId` - Deleta comentário

## 👥 Roles e Permissões

### Admin
- Criar/editar/deletar utilizadores
- Criar/editar/deletar tarefas
- Criar/deletar tags
- Ver tudo

### Manager
- Criar/editar tarefas
- Criar tags
- Atribuir tarefas

### Member
- Criar/editar tarefas
- Adicionar comentários

### Viewer
- Ver tudo
- Adicionar comentários

## 📝 Notas

- O backend deve estar rodando em `http://localhost:3000`
- TypeScript é compilado automaticamente com Vite
- Usa Tailwind CSS para estilos

## 👨‍💻 Desenvolvido por

Abel Pinto - UPSKILL Módulo 3 - JavaScript e TypeScript
