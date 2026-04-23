import bcrypt from 'bcryptjs'

// Run this script to generate the bcrypt hash for the admin password
// Then use it to insert the admin user into the database

async function generateHash() {
  const password = 'Cronos1997!'
  const hash = await bcrypt.hash(password, 12)
  console.log('Password hash for Cronos1997!:', hash)
  
  // SQL to insert/update admin user:
  console.log('\nRun this SQL in Neon:')
  console.log(`
INSERT INTO users (email, password_hash, first_name, last_name, role)
VALUES ('silvio.l.monzon@hotmail.com', '${hash}', 'Silvio', 'Monzon', 'admin')
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  role = 'admin',
  updated_at = NOW();
  `)
}

generateHash()
