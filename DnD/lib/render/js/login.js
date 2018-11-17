const electron = require('electron');
const {ipcRenderer} = electron;
let username = document.getElementById('Username');
let password = document.getElementById('Password');
let remember = document.getElementById('rememberMe');
let login = document.getElementById('login');

ipcRenderer.send('login:getKey');

//if loginkey is recieved from main.js that means the user has information they
//want remembered
ipcRenderer.on('main:loginKey', (e, data) => {
    console.log("Recieved");
    console.log(data);
    username.value = data.username;
    password.value = data.password;
    document.getElementById('rememberMe').checked = true;
});

//Makes it so that loging in will save current username and password
login.addEventListener('click' , (e) => {
    e.preventDefault();
    let data = {};
    data['username'] = username.value;
    data['password'] = password.value;
    console.log("storing loginKey for next time")
    ipcRenderer.send('login:loginKey', data);
})

//toggles rememberMe in storeage on Main.js
remember.addEventListener('click', (e) =>{
    ipcRenderer.send('register:remember', e.target.checked);
})

//changes to register page
document.getElementById('register').addEventListener('click', (e) => {
    ipcRenderer.send('register:GOTOregister');
})