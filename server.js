const express = require('express');
const mysql = require('mysql2'); 
const cors = require('cors');

// Set up environment variables
const PORT = process.env.PORT || 4000;
const app = express();

// CORS setup
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Set up the database connection using environment variables
const db = mysql.createConnection({
  host: process.env.DB_HOST,  
  user: process.env.DB_USER, 
  password: process.env.DB_PASSWORD,  
  database: process.env.DB_NAME,  
  port: process.env.DB_PORT || 3306,  
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL database.');
});

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the Makeup Finder API!');
});

// Search route
app.get('/search', (req, res) => {
  const searchTerm = req.query.query;  

  if (!searchTerm) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  const queryParams = [`%${searchTerm}%`];

  const sqlQuery = `
    SELECT 
      p.product_name, 
      COALESCE(p.brand_name, 'No brand available') AS brand_name,
      COALESCE(c.category_name, 'No category available') AS category_name,
      i.ingredient_name, 
      COALESCE(p.product_URL, 'No URL available') AS product_URL
    FROM products_ingredients pi
    INNER JOIN products p ON pi.product_id = p.product_id
    INNER JOIN ingredients i ON pi.ingredient_id = i.ingredient_id
    INNER JOIN categories c ON p.category_id = c.category_id
    WHERE i.ingredient_name LIKE ?;
  `;

  console.log('SQL query being executed:', sqlQuery, queryParams); // Debugging log

  // Execute the SQL query
  db.query(sqlQuery, queryParams, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error', details: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No products found for the given ingredients' });
    }

    res.json(results);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
