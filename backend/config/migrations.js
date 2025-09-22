const { Umzug } = require('umzug');
const { Pool } = require('pg');

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'poc_pa_xpe',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'password123',
};

// Create database connection pool
const pool = new Pool(dbConfig);

// Custom storage for PostgreSQL
const postgresStorage = {
  async executed() {
    const client = await pool.connect();
    try {
      // Create migrations table if it doesn't exist
      await client.query(`
        CREATE TABLE IF NOT EXISTS migrations (
          name VARCHAR(255) PRIMARY KEY,
          executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      const result = await client.query('SELECT name FROM migrations ORDER BY executed_at');
      return result.rows.map(row => ({ name: row.name }));
    } finally {
      client.release();
    }
  },

  async logMigration(migration) {
    const client = await pool.connect();
    try {
      await client.query(
        'INSERT INTO migrations (name) VALUES ($1)',
        [migration.name]
      );
    } finally {
      client.release();
    }
  },

  async unlogMigration(migration) {
    const client = await pool.connect();
    try {
      await client.query('DELETE FROM migrations WHERE name = $1', [migration.name]);
    } finally {
      client.release();
    }
  },
};

// Umzug configuration
const umzug = new Umzug({
  migrations: {
    glob: 'migrations/*.js',
  },
  context: { pool },
  storage: postgresStorage,
  logger: console,
});

module.exports = { umzug, pool };