

var url = 'https://www.alphavantage.co/query?function=EARNINGS&symbol=IBM&apikey=24B0JWGHHKVJZPXU';


fetch(url)
  .then(response => {
    // Check if the request was successful
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    // Parse the JSON response
    return response.json();
  })
  .then(data => {
    // Handle the data returned from the server
    console.log(data);
  })
  .catch(error => {
    // Handle any errors that occurred during the fetch
    console.error('There was a problem with the fetch operation:', error);
  });