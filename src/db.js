import mysql from 'mysql2';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente
dotenv.config();

export const db = mysql
.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "primeira_api",
  connectionLimit: 10
})
.promise(); 