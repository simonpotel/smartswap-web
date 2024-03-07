// this file is used in all pages of the website to load the header from:
// html/common/header.html and style/common.css

// asynchronous load of the header to not get disturb with the others pages

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
        }
    };
    headerRequest.send();
}
