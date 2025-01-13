// Handle the results of the search query
console.log('Frontend JavaScript is running!');

// Get the query parameter from the URL
const urlParams = new URLSearchParams(window.location.search);
const searchQuery = urlParams.get('search');  // Updated this to 'search'
if (searchQuery) {
  document.getElementById('searchInput').value = searchQuery; // Set the query in the search input
  fetchSearchResults(searchQuery); // Trigger the search on page load
}

function displayResults(data) {
  const resultsContainer = document.getElementById('results-container');
  resultsContainer.innerHTML = ''; // Clear previous results

  if (data.length === 0) {
    resultsContainer.innerHTML = '<p>No products found.</p>';
    return;
  }

  data.forEach(product => {
    const productDiv = document.createElement('div');
    productDiv.classList.add('product-card');
    productDiv.innerHTML = `
      <h3 class="product-title"><a href="${product.product_URL}" target="_blank">${product.product_name}</a></h3>
      <p>Brand: ${product.brand_name}</p>
      <p>Category: ${product.category_name}</p>
      <p>Ingredient: ${product.ingredient_name}</p>
    `;
    resultsContainer.appendChild(productDiv);
  });
}

// Fetch data from the API based on user input
function fetchSearchResults(query) {
  document.getElementById('loading').style.display = 'block'; // Show loading indicator
  
  console.log('Fetching data for query:', query);
  
  fetch(`http://localhost:4000/search?query=${encodeURIComponent(query)}`)
    .then(response => response.json())
    .then(data => {
      document.getElementById('loading').style.display = 'none'; // Hide loading indicator
      console.log('Data received:', data);
      displayResults(data); // Call the displayResults function to handle the data
    })
    .catch(error => {
      console.error('Error fetching products:', error);
      document.getElementById('loading').style.display = 'none';
      document.getElementById('results-container').innerHTML = '<p>Error fetching products.</p>';
    });
}
