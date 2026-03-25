-- Criar schema se não existir
CREATE SCHEMA IF NOT EXISTS primeira_api;


-- Remover tabelas existentes (ordem importante por causa das foreign keys)
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS task_tags;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS users;

-- ==================================================
-- Criar tabelas
-- ==================================================

-- Tabela de usuários
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de tarefas
CREATE TABLE tasks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(200) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    concluida BOOLEAN DEFAULT FALSE,
    responsavelNome VARCHAR(100) NOT NULL,
    dataConclusao DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de tags
CREATE TABLE tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de relação entre tarefas e tags (muitos para muitos)
CREATE TABLE task_tags (
    task_id INT NOT NULL,
    tag_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (task_id, tag_id),
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Tabela de comentários
CREATE TABLE comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    task_id INT NOT NULL,
    user_id INT NOT NULL,
    conteudo TEXT NOT NULL,
    dataCriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ==================================================
-- Inserir dados de teste
-- ==================================================

-- Inserir usuários
INSERT INTO users (name, email, active) VALUES
('João Silva', 'joao.silva@email.com', TRUE),
('Maria Santos', 'maria.santos@email.com', TRUE),
('Pedro Oliveira', 'pedro.oliveira@email.com', FALSE),
('Ana Costa', 'ana.costa@email.com', TRUE),
('Carlos Ferreira', 'carlos.ferreira@email.com', TRUE),
('Sofia Rodrigues', 'sofia.rodrigues@email.com', FALSE),
('Miguel Alves', 'miguel.alves@email.com', TRUE),
('Beatriz Martins', 'beatriz.martins@email.com', TRUE);

-- Inserir tarefas
INSERT INTO tasks (titulo, categoria, concluida, responsavelNome, dataConclusao) VALUES
('Desenvolver API REST', 'Desenvolvimento', TRUE, 'João Silva', '2026-03-15'),
('Criar documentação técnica', 'Documentação', FALSE, 'Maria Santos', NULL),
('Implementar autenticação', 'Segurança', TRUE, 'Pedro Oliveira', '2026-03-10'),
('Realizar testes unitários', 'Testes', FALSE, 'Ana Costa', NULL),
('Configurar banco de dados', 'Infraestrutura', TRUE, 'Carlos Ferreira', '2026-03-05'),
('Design da interface', 'Frontend', FALSE, 'Sofia Rodrigues', NULL),
('Otimizar queries SQL', 'Performance', FALSE, 'Miguel Alves', NULL),
('Revisar código', 'Code Review', TRUE, 'Beatriz Martins', '2026-03-20'),
('Deploy em produção', 'DevOps', FALSE, 'João Silva', NULL),
('Criar backup automático', 'Infraestrutura', FALSE, 'Carlos Ferreira', NULL);

-- Inserir tags
INSERT INTO tags (nome) VALUES
('urgente'),
('bug'),
('feature'),
('melhoria'),
('backend'),
('frontend'),
('database'),
('segurança');

-- Associar tags às tarefas
INSERT INTO task_tags (task_id, tag_id) VALUES
(1, 3), -- Desenvolver API REST - feature
(1, 5), -- Desenvolver API REST - backend
(2, 4), -- Criar documentação técnica - melhoria
(3, 8), -- Implementar autenticação - segurança
(3, 5), -- Implementar autenticação - backend
(4, 5), -- Realizar testes unitários - backend
(5, 7), -- Configurar banco de dados - database
(6, 6), -- Design da interface - frontend
(7, 4), -- Otimizar queries SQL - melhoria
(7, 7), -- Otimizar queries SQL - database
(8, 4), -- Revisar código - melhoria
(9, 1), -- Deploy em produção - urgente
(10, 7); -- Criar backup automático - database

-- Inserir comentários
INSERT INTO comments (task_id, user_id, conteudo) VALUES
(1, 2, 'Excelente trabalho! A API está funcionando perfeitamente.'),
(1, 4, 'Consegui integrar com o frontend sem problemas.'),
(2, 1, 'Preciso de ajuda com a estrutura da documentação.'),
(3, 5, 'A autenticação JWT foi implementada corretamente.'),
(3, 1, 'Falta adicionar refresh token.'),
(4, 3, 'Os testes estão cobrindo 85% do código.'),
(5, 7, 'Database configurado com PostgreSQL.'),
(6, 2, 'O design precisa seguir o guia de estilo da empresa.'),
(7, 5, 'Algumas queries estão demorando mais de 2 segundos.'),
(8, 1, 'Code review concluído. Código aprovado!'),
(9, 4, 'Aguardando aprovação para fazer o deploy.'),
(10, 5, 'Backup será realizado diariamente às 3h da manhã.');
