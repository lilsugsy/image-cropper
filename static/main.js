
function deleteImages() {
  // Define the server URL and the endpoint for the function
  const serverUrl = 'http://localhost:3000';
  const endpoint = '/delete-images';

  // Make a POST request to the server using the fetch API
  fetch(serverUrl + endpoint, {
    method: 'POST'
  })
    .then(response => {
      // Handle the response from the server
      //alert('deleted')
    })
    .catch(err => {
      // Handle any errors that occurred
      console.error(err);
      //alert('not deleted')
    });
}