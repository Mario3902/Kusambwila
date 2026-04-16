const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDatabase() {
  const {
    DB_HOST = 'localhost',
    DB_USER = 'root',
    DB_PASSWORD = '',
    DB_NAME = 'kusambwila_db'
  } = process.env;

  const adminConnection = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    multipleStatements: true
  });

  try {
    console.log(`A recriar base de dados: ${DB_NAME}`);
    await adminConnection.query(`DROP DATABASE IF EXISTS \`${DB_NAME}\``);
    await adminConnection.query(
      `CREATE DATABASE \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    console.log(`Base de dados ${DB_NAME} criada com sucesso.`);
  } finally {
    await adminConnection.end();
  }

  const { initializeDatabase, pool } = require('./db');
  await initializeDatabase();
  await pool.end();
  console.log('Tabelas criadas com sucesso.');
}

setupDatabase().catch((err) => {
  console.error('Erro ao preparar base de dados:', err);
  process.exit(1);
});
