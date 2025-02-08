document
  .getElementById('loginForm')
  .addEventListener('submit', async function (event) {
    event.preventDefault();
    if (localStorage.getItem('authToken')) {
      window.location.href = 'index.html';
    }
    // Get form data
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
      // Send POST request to PocketBase login endpoint
      const response = await fetch(
        'http://localhost:8090/api/collections/users/auth-with-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            identity: email, // Email as identity
            password: password, // User's password
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        document.getElementById('message').textContent = 'Login successful!';
        console.log('User authenticated:', data);
        // Save the authentication token (optional)
        //@request.auth.id!="" && @request.body.author = @request.auth.id
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userId', data.record.id); // Save the user ID
        document.getElementById('loginForm').reset();
        alert('Login successful!, press OK to transfer to main page ....');
        window.location.href = 'index.html';
      } else {
        const error = await response.json();
        document.getElementById('message').textContent =
          'Error: ' + error.message;
        console.error('Error:', error);
      }
    } catch (err) {
      document.getElementById('message').textContent =
        'An unexpected error occurred.';
      console.error('Unexpected error:', err);
    }
  });
