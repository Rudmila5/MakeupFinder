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
      displayResults(data); 
    })
    .catch(error => {
      console.error('Error fetching products:', error);
      alert('An error occurred while fetching products.');
    });
}


document.getElementById('search-button').addEventListener('click', searchIngredients);
