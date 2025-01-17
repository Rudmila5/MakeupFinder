const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 4000;

app.use(cors());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Rudu5@',
  database: 'ingredientfinder',
});

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

  pool.query(sqlQuery, queryParams, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No products found for the given ingredients' });
    }

    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
