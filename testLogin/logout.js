document.addEventListener("DOMContentLoaded", function() {
    const loggedInUser = sessionStorage.getItem('loggedInUser');

    if (!loggedInUser) {
        window.location.href = 'index.html'; // Redirection vers la page de connexion
    }
});
