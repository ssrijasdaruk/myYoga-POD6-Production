function getCookieList() {
    if(isCookieEmpty()){
        return {};
    }else{
        let spli = document.cookie.split('; ');
        let cookie_list = {};
        for(var j = 0; j < spli.length; j++) {
            let temp = spli[j];
            let spli2 = temp.split('=');
            cookie_list[spli2[0]] = spli2[1];
        }
        return cookie_list;
    }
}


function isCookieEmpty() {
    if(document.cookie == ""){
        return true;
    }else{
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

function setupElement() {
    let cookie_list = getCookieList();
    var login = document.getElementById("login").classList;
    var logout = document.getElementById("logout").classList;
    var classtable = document.getElementById("classtable").classList;
    var admin = document.getElementById("admin").classList;
    console.log(cookie_list);
    if(isCookieEmpty()){
        logout.add("hidden");
        classtable.add("hidden");
    }else{
        login.add("hidden");

    }


    if( isCookieEmpty() || cookie_list.isAdmin == 'false'){
        admin.add("hidden");
    }
}

