const { pool } = require('../config/migrations');

async function up() {
  const client = await pool.connect();
  try {
    // Add indexes for better performance
    await client.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at)');

    console.log('Migration 002-add-indexes: UP - Indexes created successfully');
  } finally {
    client.release();
  }
}

async function down() {
  const client = await pool.connect();
  try {
    await client.query('DROP INDEX IF EXISTS idx_users_created_at');
    await client.query('DROP INDEX IF EXISTS idx_posts_created_at');
    await client.query('DROP INDEX IF EXISTS idx_posts_user_id');
    await client.query('DROP INDEX IF EXISTS idx_users_email');
    console.log('Migration 002-add-indexes: DOWN - Indexes dropped successfully');
  } finally {
    client.release();
  }
}

module.exports = { up, down };