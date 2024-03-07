document.addEventListener('DOMContentLoaded', function () {
    const logo = document.querySelector('.logo-main img');
    const navLinks = document.querySelector('nav ul');

    if (logo && navLinks) {
        logo.addEventListener('click', function () {
            window.location.href = '../../index.html'; // Toujours rediriger vers la page d'accueil
        });

        // Ajoutez un événement de clic à l'élément .logo-main pour masquer ou afficher les liens de navigation
        document.querySelector('.logo-main').addEventListener('click', function () {
            if (window.innerWidth <= 768) {
                if (navLinks.style.display === 'block') {
                    navLinks.style.display = 'none';
                } else {
                    navLinks.style.display = 'block';
                }
            } else {
                window.location.href = '../../index.html'; // Toujours rediriger vers la page d'accueil
            }
        });
    } else {
        console.error("Logo or nav links not found in the document.");
    }
});
