const name = document.getElementById('username');
const pass = document.getElementById('password');
const errorW = document.getElementsByClassName('container-error')[0];
const btn = document.getElementById('btn');
const checkbox = document.getElementById('checkbox');
const form = document.getElementById('form')

function MostrarPass() {
    checkbox.addEventListener('click', () => {
        if (checkbox.checked) {
            pass.setAttribute('type', 'text');
        } else {
            pass.setAttribute('type', 'password');
        }
    });
}

function onSignIn(googleUser) {
    let profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}


MostrarPass();