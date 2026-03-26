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
├── services/          # Serviços locais em memória (sem API)
├── models/            # Tipos e interfaces de dados
├── ui/                # Componentes de renderização
├── security/          # Gestão de roles e permissões
├── logs/              # Sistema de logging
├── notifications/     # Serviço de notificações
├── utils/             # Utilitários e helpers
└── tasks/             # Funções relacionadas a tarefas
```

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

- Projeto frontend isolado: sem ligação a backend ou base de dados
- Dados e operações são locais (em memória)
- Estilos feitos com CSS tradicional em `styles.css`

## 👨‍💻 Desenvolvido por

Abel Pinto - UPSKILL Módulo 3 - JavaScript e TypeScript
