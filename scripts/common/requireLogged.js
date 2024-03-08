// always put this required script in start of the body to not charge the content of the page
// if the user is not logged

document.addEventListener("DOMContentLoaded", function() {
    const loggedInUser = sessionStorage.getItem('loggedInUser');

    if (!loggedInUser) { 
        // not logged
        window.location.href = '../../html/pages/login.html'; // redirect to login page
    } else {
        // logged
    }
});
