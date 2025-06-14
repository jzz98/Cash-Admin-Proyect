const btn = document.getElementById('btnCliente');
const modal = document.getElementById('crud-modal');
const closeModal = document.getElementById('Close');
const background = document.getElementById('bg');
const btnform = document.getElementById('btnform');
const btnStatic = document.getElementById('btnC');
const staticModal = document.getElementById('static-modal');
const close2 = document.getElementById('close2');

const bars = document.querySelector('.fa-bars');
const aside = document.querySelector('aside');


function Dropdowns() {
    const btnIng = document.getElementById('btning');
    const tab = document.getElementById('ingresos');

    btnIng.addEventListener('click', () => {
        if (!tab.classList.contains('hidden')) {
            tab.classList.remove('flex');
            tab.classList.add('hidden');
        } else {
            tab.classList.remove('hidden');
            tab.classList.add('flex');
        }
    });
}

function Dropdown2() {
    const btnCom = document.getElementById('btnCom');
    const tab = document.getElementById('compras');
    btnCom.addEventListener('click', () => {
        if (!tab.classList.contains('hidden')) {
            tab.classList.remove('flex');
            tab.classList.add('hidden');
        } else {
            tab.classList.remove('hidden');
            tab.classList.add('flex');
        }
    });
}

function SideBar() {
    bars.addEventListener('click', () => {
        if (aside.classList.contains('flex')) {
            aside.classList.add('hidden');
            aside.classList.remove('flex');
            document.body.classList.remove('overflow-hidden');
        } else {
            aside.classList.add('flex');
            document.body.classList.add('overflow-hidden');
            aside.classList.remove('hidden');
        }
    });
}


function Notificaciones() {
    const btn = document.getElementById('notifications');
    const Dropdown = document.getElementById('dropdown');
    const lista = document.getElementById('list');

    btn.addEventListener('click', () => {
        if(Dropdown.classList.contains('hidden')){
            Dropdown.classList.remove('hidden');
        }else{
            Dropdown.classList.add('hidden');
        }
        fetch("http://localhost:3000/facturacion/noticias/api/v3/get")
            .then(response => response.json())
            .then(data => {
                data.forEach(element => {
                    lista.innerHTML += `
                    <li>
                        <a href="/facturacion/noticias" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Noticia nueva!!</a>
                    </li>
                    `
                });
            });
    });
}


function AddClientFrom(){
    if(btn){
        btn.addEventListener("click", () =>{
            if(modal.classList.contains('flex')){
                modal.classList.remove('flex');
                modal.classList.add('hidden');
                background.classList.remove('block');
                background.classList.add('hidden');
            }else{
                modal.classList.remove('hidden');
                modal.classList.add('flex');
                background.classList.add('block');
                background.classList.remove('hidden');
    
            }
        });
    
    }
    if(closeModal){
        closeModal.addEventListener('click', () =>{
            modal.classList.remove('flex');
            modal.classList.add('hidden');
            background.classList.remove('block');
            background.classList.add('hidden');
        });
    }

    if(btnStatic){
        btnStatic.addEventListener("click", () =>{
            if(staticModal.classList.contains('flex')){
                staticModal.classList.remove('flex');
                staticModal.classList.add('hidden');
                background.classList.remove('block');
                background.classList.add('hidden');
            }else{
                staticModal.classList.remove('hidden');
                staticModal.classList.add('flex');
                background.classList.add('block');
                background.classList.remove('hidden');
    
            }
        });
    }

    if(close2){
        close2.addEventListener('click', () =>{
            staticModal.classList.remove('flex');
            staticModal.classList.add('hidden');
            background.classList.remove('block');
            background.classList.add('hidden');
        });
    }
}

function Verificar() {
    const nombre = document.getElementById('nombre');
    const apellido = document.getElementById('Apellido');
    const rnc = document.getElementById('rnc');
    const numero = document.getElementById('Telefono');
    const correo = document.getElementById('correo');
    const Descripción = document.getElementById('description');
    const error = document.getElementById('error');
    const form = document.getElementById('formulario');

    error.innerHTML = '';

    form.addEventListener('submit', (event) => {
        event.preventDefault(); 

        let isValid = true;

        if (nombre.value.length < 2 || apellido.value.length < 2) {
            error.innerHTML = 'El nombre o apellido no es válido';
            isValid = false;
        } else if (rnc.value.length < 11) {
            error.innerHTML = 'RNC no válido';
            isValid = false;
        } else if (numero.value.length < 11) {
            error.innerHTML = 'Número telefónico no válido';
            isValid = false;
        } else if (correo.value.length < 5 || !correo.value.endsWith('@gmail.com')) {
            error.innerHTML = 'Email inválido';
            isValid = false;
        }

        if (isValid) {
            form.submit(); 
        }
    });
}

const inputSearch = document.getElementById('simple-search-2');
const boxSearch = document.getElementById('search-list');

inputSearch.addEventListener('click', () => {
    if (boxSearch.classList.contains('hidden')) {
        boxSearch.classList.remove('hidden');
        boxSearch.classList.add('flex');
        boxSearch.classList.add('flex-col');
    } else {
        boxSearch.classList.remove('flex');
        boxSearch.classList.add('hidden');
    }
});

document.addEventListener("click", (event) => {
    if (!boxSearch.contains(event.target) && event.target !== inputSearch) {
        boxSearch.classList.add('hidden');
    }
});

inputSearch.addEventListener('keyup', BuscarClientes);

function BuscarClientes() {
    const filter = inputSearch.value.toUpperCase();
    const li = boxSearch.getElementsByTagName("li");
    const input = document.querySelector('.input-email'); // Asegurar que existe

    for (let i = 0; i < li.length; i++) {
        // Buscar el nombre y el email dentro del <li>
        let nombre = li[i].querySelector("p.text-sm.font-medium")?.textContent.trim() || "";
        let email = li[i].querySelector("p.text-sm.text-gray-500")?.textContent.trim() || "";

        let textValue = email // Buscar en ambos y eliminar espacios extra

        // Filtrar resultados
        li[i].style.display = textValue.toUpperCase().includes(filter) ? "" : "none";

        // Agregar evento de clic solo si el elemento es visible
        if (li[i].style.display === "") {
            li[i].addEventListener('click', function () {
                inputSearch.value = textValue.trim(); // Al hacer clic, copiar el nombre sin espacios extra
            });
        }
    }
}

const form = document.getElementById('form-api');
const email = document.getElementById('simple-search-2');
const mensaje = document.getElementById('message');
const archivo = document.getElementById('file_input');

// form.addEventListener('submit', async (event) =>{
//     event.preventDefault();
//     const url = 'https://mail-sender-api1.p.rapidapi.com/';
//     const options = {
//     method: 'POST',
//     headers: {
//         'x-rapidapi-key': 'b45627c454msh7d461ca7f2e51b2p1d258djsn7ad82948dcc8',
//         'x-rapidapi-host': 'mail-sender-api1.p.rapidapi.com',
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(
//         {
//             sendto: 'jostinezequiel09@gmail.com',
//             name: 'Cash Admin Helper Team',
//             replyTo: 'mailadmim3@gmail.com',
//             ishtml: 'false',
//             title: `Mensaje para: Ti`,
//             body: 'Put Your Body here Html / Text,  Testing Mail API'
//         }
//     )
//     };

//     try {
//         const response = await fetch(url, options);
//         const result = await response.text();
//         console.log(result);
//         alert('Correo enviado correctamente'); // Notifica al usuario
//     } catch (error) {
//         console.error(error);
//         alert('Hubo un error al enviar el correo'); // Notifica al usuario
//     }
// })

function user() {
    const button = document.getElementById('logusr');
    const carduser = document.getElementById('user-settings');

    button.addEventListener('click', () => {
        if (carduser.classList.contains('hidden')) {
            carduser.classList.remove('hidden');
        } else {
            carduser.classList.add('hidden');
        }
    });
}



window.addEventListener('load', () =>{
    AddClientFrom();
    Verificar();
    BuscarClientes();
    Dropdowns();
    SideBar();
    user();
    Notificaciones();

})