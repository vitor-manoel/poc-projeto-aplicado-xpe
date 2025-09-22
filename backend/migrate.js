const { umzug } = require('./config/migrations');

async function runMigrations() {
  try {
    console.log('Running migrations...');
    await umzug.up();
    console.log('All migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

async function rollbackMigrations() {
  try {
    console.log('Rolling back migrations...');
    await umzug.down();
    console.log('Migrations rolled back successfully');
    process.exit(0);
  } catch (error) {
    console.error('Rollback failed:', error);
    process.exit(1);
  }
}

async function showStatus() {
  try {
    const pending = await umzug.pending();
    const executed = await umzug.executed();
    
    console.log('Migration Status:');
    console.log('Executed migrations:', executed.length);
    console.log('Pending migrations:', pending.length);
    
    if (executed.length > 0) {
      console.log('\nExecuted:');
      executed.forEach(migration => console.log(`  ✓ ${migration.name}`));
    }
    
    if (pending.length > 0) {
      console.log('\nPending:');
      pending.forEach(migration => console.log(`  ○ ${migration.name}`));
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Status check failed:', error);
    process.exit(1);
  }
}

// Command line interface
const command = process.argv[2];

switch (command) {
  case 'up':
    runMigrations();
    break;
  case 'down':
    rollbackMigrations();
    break;
  case 'status':
    showStatus();
    break;
  default:
    console.log('Usage: node migrate.js [up|down|status]');
    process.exit(1);
}