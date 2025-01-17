app.get('/search', (req, res) => {
  const searchTerm = req.query.query;

  if (!searchTerm) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  // Prepare the search term for SQL
  const queryParams = [`%${searchTerm}%`];

  // SQL query
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

  // Log the query for debugging
  console.log("Running SQL query with search term:", searchTerm);
  console.log("Prepared query params:", queryParams);

  pool.query(sqlQuery, queryParams, (err, results) => {
    if (err) {
      console.error("Database error:", err); // Log the error if there's any
      return res.status(500).json({ error: 'Database error', details: err.message });
    }

    // Log the query results to see what we are getting back
    console.log("Query Results:", results);

    if (results.length === 0) {
      console.log("No products found for search term:", searchTerm); // Log when no results are found
      return res.status(404).json({ message: 'No products found for the given ingredients' });
    }

    // Send back the results
    res.json(results);
  });
});

