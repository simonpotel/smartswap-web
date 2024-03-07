window.addEventListener('DOMContentLoaded', function() {
    loadHeaderFooter();
});

function loadHeaderFooter() {
    const headerFooterContainer = document.getElementById('header-footer-container');
    const headerRequest = new XMLHttpRequest();

    headerRequest.open('GET', '../../smartswap-web/html/common/header.html');
    headerRequest.onload = function() {
        if (headerRequest.status === 200) {
            headerFooterContainer.innerHTML += headerRequest.responseText;
        }
    };
    headerRequest.send();
}
