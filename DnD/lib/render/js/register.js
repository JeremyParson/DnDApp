const electron = require('electron');
const {ipcRenderer} = electron;
let email = document.getElementById('Email');
let username = document.getElementById('Username');
let password = document.getElementById('Password');
let cPassword = document.getElementById('cPassword');
let error = document.getElementById('error');

ipcRenderer.send('login:getKey');

//changes to login page
document.getElementById('login').addEventListener('click', (e) => {
    ipcRenderer.send('register:GOTOlogin');
})

document.getElementById('register').addEventListener('click', (e) => {
    //TO-DO confirm that credentials are valid

    if(validateEmail(email.value) == true){
        email.className = "";
        error.textContent = error.textContent.replace('Email not valid.',"");
    }else{
        console.log('email is invalid');
        if (error.textContent.search('Email not valid.') == -1) {
            error.textContent += "Email not valid.";
        }else{
            console.log('contains error message');
        }
        email.className = "error";
    }

    if(password.value == cPassword.value && password.value != ""){
        password.className = "";
        cPassword.className = "";
        error.textContent = error.textContent.replace('Passwords must be matching.',"");
    }else{
        console.log('email is invalid');
        if (error.textContent.search('Passwords must be matching.') == -1) {
            error.textContent += "Passwords must be matching.";
        }
        password.className = "error";
        cPassword.className = "error";
    }

    if(error.textContent.search('Passwords must be matching.') == -1 && error.textContent.search('Email not valid.') == -1){
        console.log("test");
        let data = {}
        data["username"] = username.value;
        data["userData"] = JSON.parse(
        `{
            "email":"${email.value}",
            "password":"${password.value}",
            "username":"${username.value}"
        }`
    );
        ipcRenderer.send("register:register", data)
    }
})



function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function shwPsw() {
    // var items = document.getElementsByTagName("input");
    
    // for(var i = 0; i < items.length; i++) {
    //     if (items[i].type === "password") {
    //         items[i].type = "text";
    //     } else {
    //         items[i].type = "password";
    //     }
    // }
}