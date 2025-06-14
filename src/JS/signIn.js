const user = document.getElementById('username');
const pass = document.getElementById('password');
const email = document.getElementById('email');
const checkbox = document.getElementById('checkbox');
const errorW = document.getElementsByClassName('container-error')[0];
const btn = document.getElementById('btn');
const form = document.getElementById('form');

function MostrarPass() {
    checkbox.addEventListener('click', () => {
        if (checkbox.checked) {
            pass.setAttribute('type', 'text');
        } else {
            pass.setAttribute('type', 'password');
        }
    });
}

function Verificar() {
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        if (email.value.length < 8 || !email.value.endsWith('@gmail.com')) {
            mostrarError('Email invalido');
        } else if (user.value.length < 8) {
            mostrarError('La nombre de usuario es muy corto');
        } else if (pass.value.length < 8) {
            mostrarError('La contraseña es muy corta');
        } else {
            errorW.innerHTML = '';
            form.submit();
        } 
    });
}
function mostrarError(mensaje) {
    errorW.innerHTML = ''; // Limpiar errores previos
    let p = document.createElement("p");
    p.classList.add('p1')
    p.textContent = mensaje;
    errorW.appendChild(p);
}

if (window.location.search.includes('error=')) {
    history.replaceState({}, document.title, window.location.pathname);
}

MostrarPass();
Verificar();
