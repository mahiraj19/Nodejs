// index.js
const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');

const app = express();
const port = 3003;

app.use(bodyParser.json());

// Set up a PostgreSQL connection pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'nodejs',
  password: 'root',
  port: 5432, // Default PostgreSQL port
});

// CRUD Routes

// Read all items
app.get('/items', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM items');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Read a single item
app.get('/items/:id', async (req, res) => {
  const itemId = req.params.id;

  try {
    const { rows } = await pool.query('SELECT * FROM items WHERE id = $1', [itemId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new item
app.post('/items', async (req, res) => {
  const newItem = req.query;
  console.log("🚀 ~ file: index.js:52 ~ app.post ~ newItem:", newItem)

  try {
    const { rows } = await pool.query('INSERT INTO items(name) VALUES($1) RETURNING *', [newItem.name]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update an item
app.put('/items/:id', async (req, res) => {
  const itemId = req.params.id;
  const updatedItem = req.body;

  try {
    const { rows } = await pool.query('UPDATE items SET name = $1 WHERE id = $2 RETURNING *', [
      updatedItem.name,
      itemId,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete an item
app.delete('/items/:id', async (req, res) => {
  const itemId = req.params.id;

  try {
    const { rows } = await pool.query('DELETE FROM items WHERE id = $1 RETURNING *', [itemId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
