
console.log('Frontend JavaScript is running!');

const urlParams = new URLSearchParams(window.location.search);
const searchQuery = urlParams.get('search');  
if (searchQuery) {
  document.getElementById('searchInput').value = searchQuery; 
  fetchSearchResults(searchQuery); 
}

function displayResults(data) {
  const resultsContainer = document.getElementById('results-container');
  resultsContainer.innerHTML = ''; 

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


function fetchSearchResults(query) {
  document.getElementById('loading').style.display = 'block'; 
  
  console.log('Fetching data for query:', query);
  
  fetch(`http://localhost:4000/search?query=${encodeURIComponent(query)}`)
    .then(response => response.json())
    .then(data => {
      document.getElementById('loading').style.display = 'none'; 
      console.log('Data received:', data);
      displayResults(data); 
    })
    .catch(error => {
      console.error('Error fetching products:', error);
      document.getElementById('loading').style.display = 'none';
      document.getElementById('results-container').innerHTML = '<p>Error fetching products.</p>';
    });
}
