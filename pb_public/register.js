document
  .getElementById('registerForm')
  .addEventListener('submit', async function (event) {
    event.preventDefault();

    // Get form data
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

    // Validate passwords match
    if (password !== passwordConfirm) {
      document.getElementById('message').textContent =
        'Passwords do not match!';
      return;
    }
    try {
      // Send POST request to PocketBase
      const response = await fetch(
        'http://localhost:8090/api/collections/users/records',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            password: password,
            passwordConfirm: passwordConfirm,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        document.getElementById('registerForm').reset();
        document.getElementById('message').textContent =
          'Registration successful!';
        console.log('User created:', data);
        window.location.href = 'login.html';
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
