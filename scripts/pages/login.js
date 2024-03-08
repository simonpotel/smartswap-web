document.addEventListener("DOMContentLoaded", function() {
    const loginBtn = document.getElementById("loginBtn");

    loginBtn.addEventListener("click", function() {
        const login = document.getElementById("login").value;
        const password = document.getElementById("password").value;

        const formData = new FormData();
        formData.append('login', login);
        formData.append('password', password);

        fetch('../../requests/login.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success){
                // logged
                sessionStorage.setItem('loggedInUser', login);
                window.location.replace("../../html/pages/dashboard.html");
            }else{
                // not logged
                window.location.replace("../../html/pages/error.html");
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});
