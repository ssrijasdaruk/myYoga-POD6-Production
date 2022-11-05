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

function checkIdentity() {
    let cookie_list = getCookieList();
    if( isCookieEmpty() || cookie_list.isAdmin == 'false'){
        alert("You are not authorized to access this page");
        window.location = '/';
    }
}