function getCookieList() {
    if (isCookieEmpty()) {
        return {};
    } else {
        let spli = document.cookie.split('; ');
        let cookie_list = {};
        for (var j = 0; j < spli.length; j++) {
            let temp = spli[j];
            let spli2 = temp.split('=');
            cookie_list[spli2[0]] = spli2[1];
        }
        return cookie_list;
    }
}


function isCookieEmpty() {
    if (document.cookie == "") {
        return true;
    } else {
        return false;
    }
}

function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }

    alert("You are logout");
}

async function setupElement() {
    let cookie_list = getCookieList();
    var login = document.getElementById("login").classList;
    var logout = document.getElementById("logout").classList;
    var admin = document.getElementById("admin").classList;

    if (isCookieEmpty()) {
        logout.add("hidden");
        renderNormalTable();
    } else {
        login.add("hidden");
        await reset_cookies(cookie_list.user_id);
        await renderMmbTable();
    }

    if (isCookieEmpty() || cookie_list.isAdmin == 'false') {
        //admin.add("hidden");
    }
}

function renderTable() {
    if (isCookieEmpty()) {
        renderNormalTable();
    } else {
        renderMmbTable();
    }
}

async function renderNormalTable() {
    const res = await retriev_class();

    if (res != "Error") {
        var data = JSON.parse(res);
        var table = document.getElementById('table');
        var html_str = '<thead><tr><th>Class</th><th>Vacancies</th><th>Time</th><th>Coach</th></tr></thead><tbody>';
        for (let i = 0; i < data.length; i++) {
            html_str = html_str + '<tr><td>'
                + data[i].ClassID + '</td><td>'
                + data[i].CurrVacancies + '/' + data[i].MaxVacancies + '</td><td>'
                + data[i].EndDate + '</td><td>'
                + data[i].Coach + '</td><tr>';
        }
        html_str = html_str + '</tbody>';
        table.innerHTML = html_str;
    }
}

async function renderMmbTable() {
    const cookie_list = getCookieList();
    var vouchers = document.getElementById('vouchers');
    vouchers.innerHTML = '<h2 style="text-align: center;"> Voucher(s): ' + cookie_list.vouchers + '</h2>';
    const res = await retriev_class();

    if (res != "Error") {
        var data = JSON.parse(res);
        var table = document.getElementById('table');
        var html_str = '<thead><tr><th>Class</th><th>Vacancies</th><th>Time</th><th>Coach</th><th>Action</th></tr></thead><tbody>';
        for (let i = 0; i < data.length; i++) {
            html_str = html_str + '<tr><td>'
                + data[i].ClassID + '</td><td>'
                + data[i].CurrVacancies + '/' + data[i].MaxVacancies + '</td><td>'
                + data[i].EndDate + '</td><td>'
                + data[i].Coach + '</td><td>'
                + '<a href="javascript:;" onclick="applyCourse(' +
                data[i].ClassID + ',' + cookie_list.user_id + ',' + data[i].CurrVacancies + ',' + data[i].MaxVacancies + ',' + cookie_list.vouchers +
                ')">Book</a>';

            if (cookie_list.isAdmin == 'true') {
                html_str = html_str + '&nbsp;&nbsp;<a href="javascript:;">Edit</a>'
            }

            html_str = html_str + '</td></tr>';
        }
        html_str = html_str + '</tbody>';
        table.innerHTML = html_str;
        var admin = document.getElementById('Add_class');
        admin.innerHTML = '<div id="Add_class"><h2 style="color: white;"> Add Class: </h2><form style="text - align: -webkit - center;"><div class="content">                            <div class="field">                <span><i class="fas fa - user"></i></span>                <input id="Insert_ClassName" type="text" placeholder="Class Name" required="">              </div>              <div class="field">                <span><i class="fas fa - user"></i></span>                <input type="text" placeholder="Max Vacancies" id="Insert_MaxVacancies" required="">              </div>              <div class="field">                <span><i class="fas fa - user"></i></span>                <input type="datetime-local" placeholder="Start Date" id="Insert_StartDate" required="">              </div>              <div class="field">                <span><i class="fas fa - user"></i></span>                <input type="datetime-local" placeholder="End Date" id="Insert_EndDate" required="">              </div>              <div class="field">                <span><i class="fas fa - user"></i></span>                <input type="text" placeholder="Coach" id="Insert_Coach" required="">              </div>              <button onclick="admin_insert_class();">Add Class</button>            </div></form></div>';

    }
}

async function applyCourse(classid, userid, curr, max, vouchers) {
    if (curr >= max) {
        alert("This class is full !")
    } else if (vouchers < 1) {
        alert("You don't have enough vouchers !")
    } else {
        await update_vouchers(userid, vouchers);
        await update_vacancies(classid, curr);
        alert("Booking success");
        window.location = '/';
    }
}

function retriev_class() { // Run this function when onload
    return new Promise((resolve) => {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", "retrieve_class", true);
        xmlhttp.send();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                //Retrieve data from database
                //xmlhttp.response = data
                //document.getElementById("class_tabl

                resolve(xmlhttp.responseText);
            }
            else if (xmlhttp.readyState == 4 && xmlhttp.status == 400) {
                resolve("Error");
            }
        }
    });
};



function update_vouchers(userid, vouchers) { // Run this function when onload
    return new Promise((resolve) => {
        var new_vouchers = vouchers - 1;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", `update_vouchers?userid=${userid}&vouchers=${new_vouchers}`, true);
        xmlhttp.setRequestHeader("Content-type", "application/json");
        xmlhttp.send();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                console.log("Update vouchers Success");
                resolve();
            }
            else if (xmlhttp.readyState == 4 && xmlhttp.status == 500) {
                console.log("Update vouchers Fail");
                resolve();
            }
        }
    });
};

function reset_cookies(userid) {
    return new Promise((resolve) => {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", `reset_cookies?userid=${userid}`, true);
        xmlhttp.setRequestHeader("Content-type", "application/json");
        xmlhttp.send();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                console.log("Reset cookies Success");
                const cookie_list = getCookieList();
                var vouchers = document.getElementById('vouchers');
                vouchers.innerHTML = "";
                vouchers.innerHTML = '<h2 style="text-align: center;"> Voucher(s): ' + cookie_list.vouchers + '</h2>';
                resolve();
            }
            else if (xmlhttp.readyState == 4 && xmlhttp.status == 500) {
                console.log("Reset cookies fail")
                resolve();
            }
        }
    });
}

function update_vacancies(classid, curr) { // Run this function when onload
    return new Promise((resolve) => {
        var new_curr = curr + 1;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", `update_vacancies?classid=${classid}&vacancies=${new_curr}`, true);
        xmlhttp.setRequestHeader("Content-type", "application/json");
        xmlhttp.send();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                console.log("Update vacancies Success");
                resolve();
            }
            else if (xmlhttp.readyState == 4 && xmlhttp.status == 500) {
                console.log("Update vacancies Fail");
                resolve();
            }
        }
    });
};