# Task Manager Frontend

Interface web em TypeScript (Vite) para gerir utilizadores, tarefas, tags e comentarios.

## Funcionalidades

- Gestao de utilizadores
- Gestao de tarefas
- Associacao de tags a tarefas
- Comentarios por tarefa
- Estatisticas
- Controlo de permissoes por role
- Sistema de logs e notificacoes

## Requisitos

- Node.js 18+
- Backend da API ativo em `http://localhost:3000`

## Instalacao

```bash
npm install
```

## Desenvolvimento

```bash
npm run dev
```

Aplicacao disponivel em: `http://localhost:5173`

## Build

```bash
npm run build
```

## Preview do Build

```bash
npm run preview
```

## Scripts Disponiveis

- `npm run dev`
- `npm run build`
- `npm run build:ts`
- `npm run build:ts:watch`
- `npm run preview`
- `npm run compile`

## Estrutura Principal

```
src/
├── api/               # Integracao com a API backend
├── services/          # Camada de servicos da aplicacao
├── models/            # Tipos e interfaces
├── ui/                # Gestao de modais e elementos de interface
├── security/          # Roles e permissoes
├── logs/              # Logging local
├── notifications/     # Sistema de notificacoes
└── utils/             # Funcoes utilitarias
```

## Notas

- O frontend faz chamadas HTTP para a API backend
- URL base da API definida nos ficheiros em `src/api/`
