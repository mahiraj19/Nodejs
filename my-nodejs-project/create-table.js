// create-table.js
const { Pool } = require('pg');

// Replace these with your database connection details
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'nodejs',
    password: 'root',
    port: 5432, // Default PostgreSQL port
  });

// SQL statement to create the "items" table
const createTableQuery = `
  CREATE TABLE items (
    id serial PRIMARY KEY,
    name VARCHAR(255) NOT NULL
  );
`;

// Connect to the database and execute the query
pool.query(createTableQuery)
  .then(() => {
    console.log('Table "items" created successfully');
  })
  .catch((error) => {
    console.error('Error creating table:', error);
  })
  .finally(() => {
    // Close the database connection
    pool.end();
  });
