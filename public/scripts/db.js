function c_login() {
    event.preventDefault();
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    if (username == "" || password == "") {
        alert("Please enter username and password");
    } else {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", "signin", true);
        xmlhttp.setRequestHeader("Content-type", "application/json");
        xmlhttp.send(JSON.stringify({ username: username, password: password }));
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                alert("Login Success");
                window.location = '/';
            }
            else if (xmlhttp.readyState == 4 && xmlhttp.status == 400) {
                alert("Login Error");
            }
        }
    };
}