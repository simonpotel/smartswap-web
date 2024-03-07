document.addEventListener('DOMContentLoaded', function () {
    const logo = document.querySelector('.logo-main img');
    const navLinks = document.querySelector('nav ul');

    if (logo && navLinks) {
        logo.addEventListener('click', function () {
            window.location.href = '../../index.html'; 
        });

        document.querySelector('.logo-main').addEventListener('click', function () {
            if (window.innerWidth <= 768) {
                if (navLinks.style.display === 'block') {
                    navLinks.style.display = 'none';
                } else {
                    navLinks.style.display = 'block';
                }
            } else {
                window.location.href = '../../index.html'; 
            }
        });
    } else {
        console.error("Logo or nav links not found in the document.");
    }
});
