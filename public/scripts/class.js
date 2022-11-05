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
    if( isCookieEmpty()){
        alert("You are not authorized to access this page");
        window.location = '/';
    }
}

function retriev_class () { // Run this function when onload
    return new Promise((resolve) => {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", "retrieve_class", true);
            xmlhttp.send();
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    //Retrieve data from database
                    //xmlhttp.response = data
                    //document.getElementById("class_tabl
                    console.log("1, ", xmlhttp.responseText)
                    resolve(xmlhttp.responseText);
                }
                else if (xmlhttp.readyState == 4 && xmlhttp.status == 400) {
                    resolve("Error");
                }
            }
      });
};

async function renderTable(){
    const cookie_list = getCookieList();
    var vouchers = document.getElementById('vouchers');
    vouchers.innerHTML = '<h2> Voucher(s): ' + cookie_list.vouchers +  '</h2>';
    const res = await retriev_class();
    
    if(res != "Error"){
        var data = JSON.parse(res);
        var table = document.getElementById('table');
        var html_str = '<thead><tr><th>Class</th><th>Vacancies</th><th>Time</th><th>Coach</th><th>Action</th></tr></thead><tbody>';
        for( let i = 0; i < data.length ; i++){
            html_str = html_str + '<tr><td>'
            + data[i].ClassID + '</td><td>'
            + data[i].CurrVacancies + '/' + data[i].MaxVacancies + '</td><td>'
            + data[i].EndDate + '</td><td>'
            + data[i].Coach + '</td><td>'
            + '<a href="javascript:;" onclick="applyCourse(' + 
            data[i].ClassID + ',' + data[i].CurrVacancies + ',' + data[i].MaxVacancies + ',' + cookie_list.vouchers +
            ')">Apply</a>' + '</td></tr>';
        }
        html_str = html_str + '</tbody>';
        table.innerHTML = html_str;
    }
}

function applyCourse(id,curr,max,vouchers){
    if( curr >= max){
        alert("This class is full !")
    }else if( vouchers < 1){
        alert("You don't have enough vouchers !")
    }else{
        alert("Apply success !")
    }
}