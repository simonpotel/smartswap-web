document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById('loginForm');
    const status = document.getElementById('status');
    const storedUser = sessionStorage.getItem('loggedInUser');

    if (storedUser) {
        window.location.replace("dashboard.html");
    }

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;


        sessionStorage.setItem('loggedInUser', username);
        window.location.replace("dashboard.html");
    });
});
