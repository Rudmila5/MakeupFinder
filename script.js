// Handle the search input and send the query to the server
function searchIngredients() {
  const searchTerm = document.getElementById('search-input').value.trim();

  if (!searchTerm) {
    alert('Please enter an ingredient to search.');
    return;
  }

  fetch(`http://localhost:3000/search?query=${encodeURIComponent(searchTerm)}`)
    .then(response => response.json())
    .then(data => {
      displayResults(data); // Call the function to display results
    })
    .catch(error => {
      console.error('Error fetching products:', error);
      alert('An error occurred while fetching products.');
    });
}

// Event listener for search button
document.getElementById('search-button').addEventListener('click', searchIngredients);
