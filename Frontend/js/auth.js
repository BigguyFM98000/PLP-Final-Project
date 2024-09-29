// Base API URL
const apiUrl = 'http://localhost:5000/api/auth'; // Replace with your actual backend API URL

// Register Form Submission
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    try {
      const response = await fetch(`${apiUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registration successful! Please log in.');
        window.location.href = 'login.html'; // Redirect to login page
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during registration.');
    }
  });
}

// Login Form Submission
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log(data);  // Log the entire response object to check if token is present

      if (response.ok && data.token) {
        alert('Login successful!');
        localStorage.setItem("token", data.token);  // Store token from the response
        window.location.href = 'dashboard.html';  // Redirect to dashboard
      } else {
        alert(data.message || 'Login failed - No token provided');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during login.');
    }
  });
}

