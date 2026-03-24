# Projeto ClickUP API

**Autor:** Abel Pinto

**Repositório GitHub:** [https://github.com/seu-usuario/seu-repositorio](https://github.com/seu-usuario/seu-repositorio)

## Passos para executar o código

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio.git
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