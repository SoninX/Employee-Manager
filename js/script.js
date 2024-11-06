// login-scripts.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const userId = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (userId && password) {
            // Store the user ID and password in local storage
            localStorage.setItem('userId', userId);
            localStorage.setItem('password', password);

            alert('Login successful! User ID and password saved.');
            // Optionally redirect to the dashboard or another page
            window.location.href = 'admin-home.html';
        } else {
            alert('Please enter both User ID and password.');
        }
    });
});

