console.log('Frontend JavaScript is running!');

const apiBaseURL = 'https://makeupfinder.onrender.com'; 

const urlParams = new URLSearchParams(window.location.search);
const searchQuery = urlParams.get('search');
console.log('URL Search Query:', searchQuery);
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

async function fetchSearchResults(query) {
  console.log(`Fetching data for query: ${query}`);
  try {
    const response = await fetch(`${apiBaseURL}/search?query=${query}`); 
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Search results:', data);
    displayResults(data);
  } catch (error) {
    console.error('Error fetching products:', error);
    displayErrorMessage('Error fetching products. Please try again.');
  }
}

function displayErrorMessage(message) {
  const resultsContainer = document.getElementById('results-container');
  resultsContainer.innerHTML = `<p>${message}</p>`;
}
