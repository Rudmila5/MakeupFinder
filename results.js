document.addEventListener('DOMContentLoaded', () => {
  console.log('Frontend JavaScript is running!');

  const apiBaseURL = 'http://localhost:4000';

  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get('query');  
  console.log('URL Search Query:', searchQuery);

  if (searchQuery) {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.value = searchQuery;
    }
    fetchSearchResults(searchQuery);
  } else {
    displayErrorMessage('No search query found.');
  }

  async function fetchSearchResults(query) {
    console.log(`Fetching data for query: ${query}`);

    try {
      const response = await fetch(`${apiBaseURL}/search?query=${encodeURIComponent(query)}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Search results:', data);
      displayResults(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      displayErrorMessage('Error fetching products. Please try again.');
    }
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

  function displayErrorMessage(message) {
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = `<p>${message}</p>`;
  }
});
