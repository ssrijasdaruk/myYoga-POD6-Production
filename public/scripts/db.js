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



function admin_insert_class() {
    let spli = document.cookie.split('; ');
    let cookie_list = {};
    for (var j = 0; j < spli.length; j++) {
        let temp = spli[j];
        let spli2 = temp.split('=');
        cookie_list[spli2[0]] = spli2[1];
    }
    if (cookie_list.isAdmin == 'false') {
        alert("You are not authorized to insert");
    }
    else {
        var ClassName = document.getElementById("Insert_ClassName").value;
        var MaxVacancies = document.getElementById("Insert_MaxVacancies").value;
        var StartDate = document.getElementById("Insert_StartDate").value;
        var EndDate = document.getElementById("Insert_EndDate").value;
        var Coach = document.getElementById("Insert_Coach").value;
        if (ClassName == "" || MaxVacancies == "" || StartDate == "" || EndDate == "" || Coach == "") {
            alert("Please enter all fields");
        }
        else {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", `insert_class?ClassName=${ClassName}&MaxVacancies=${MaxVacancies}&StartDate=${StartDate}&EndDate=${EndDate}&Coach=${Coach}`, true);
            xmlhttp.setRequestHeader("Content-type", "application/json");
            xmlhttp.send();
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    alert("Add class Success");
                    window.location = '/admin.html';
                }
                else if (xmlhttp.readyState == 4 && xmlhttp.status == 400) {
                    alert("Add class Fail");
                }
            }
        };
    }
}



