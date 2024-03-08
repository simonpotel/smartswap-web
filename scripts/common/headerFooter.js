window.addEventListener('DOMContentLoaded', function() {
    loadHeaderFooter();
});

function loadHeaderFooter() {
    const headerFooterContainer = document.getElementById('header-footer-container');
    const headerRequest = new XMLHttpRequest();

    headerRequest.open('GET', '../../html/common/header.html');
    headerRequest.onload = function() {
        if (headerRequest.status === 200) {
            headerFooterContainer.innerHTML += headerRequest.responseText;
            handleLoggedInUser();
        }
    };
    headerRequest.send();
}

function handleLoggedInUser() {
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    const userAvatar = document.getElementById('user-avatar');
    const userName = document.getElementById('user-name');
    const userInfoContainer = document.getElementById('user-info');
    const disconnectClic = document.getElementById('disconnect-clic');
    const loginButton = document.getElementById('login-button');
    
    if (loggedInUser) { 
        loginButton.style.display = 'none';
        
        userInfoContainer.style.display = 'flex';
        userInfoContainer.style.alignItems = 'center';
        userInfoContainer.style.marginBottom = '40px';

        userAvatar.src = `../../files/avatar.png`;
        userAvatar.style.width = "30px";
        userAvatar.style.height = "30px";
        userAvatar.style.marginRight = '5px';

        userName.textContent = loggedInUser; 
        userName.style.color = 'white'; 
        userName.style.marginLeft = '5px'; 
        userName.style.marginRight = '5px';
        userName.style.fontSize = '16px';
        userName.style.marginTop = "-5px";

        disconnectClic.style.marginTop = "3px";
        disconnectClic.style.marginLeft = "25px";
        disconnectClic.style.marginRight = "-50px";
    } else {
        userInfoContainer.style.display = 'none';
        disconnectClic.style.display = 'none';

        loginButton.style.display = 'block'; 
    }


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

    if (disconnectClic) {
        disconnectClic.addEventListener('click', function() {
            sessionStorage.removeItem('loggedInUser'); 
            location.reload(); 
        });
    } else {
        console.error("Disconnect button not found in the document.");
    }
}
