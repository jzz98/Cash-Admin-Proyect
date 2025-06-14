const errorW = document.getElementsByClassName('container-error')[0];

function Verificar() {
    const nombre = document.getElementById('Name');
    const apellido = document.getElementById('Apellido');
    const pass = document.getElementById('password');
    const pass2 = document.getElementById('password2');
    const telefono = document.getElementById('Telefono');
    const email = document.getElementById('Email');
    const btn = document.getElementById('btn');
    const nameEmpresa = document.getElementById('company');
    const form = document.getElementById('form');

    btn.addEventListener('click', (event) => {
        event.preventDefault();
        // Validación de campos
        if (email.value.length < 8 || !email.value.endsWith('@gmail.com')) {
            mostrarError('Email invalido');
        }else if (pass.value.length < 8) {
            mostrarError('Contraseña muy corta');
        }else if (pass2.value !== pass.value) {
            mostrarError('Las contraseñas deben ser iguales');
        }else if(nombre.value.length < 2 || apellido.value.length < 2){
            mostrarError('Nombre o apellido invalido')
        }else if(telefono.value.length < 10 || !isNaN(telefono)){
            mostrarError('Numero telefonico invalido');
        }else if(nameEmpresa.value.length < 3){
            mostrarError('El nombre de tu empresa es invalido');
        }else { 
            form.submit();
            errorW.innerHTML = '';
        }
    });
}

function mostrarError(mensaje) {
    errorW.innerHTML = ''; 
    let p = document.createElement("p");
    p.classList.add('p1')
    p.textContent = mensaje;
    errorW.appendChild(p);
}

Verificar();