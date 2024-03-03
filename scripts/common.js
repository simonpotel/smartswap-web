/* logo is the menu nav for phones */
document.addEventListener('DOMContentLoaded', function () {
    const logo = document.querySelector('.logo-main img');
    const navLinks = document.querySelector('nav ul');

    logo.addEventListener('click', function () {
        if (navLinks.style.display === 'block') {
            navLinks.style.display = 'none';
        } else {
            navLinks.style.display = 'block';
        }
    });
});
