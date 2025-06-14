const bars = document.querySelector('.fa-bars');
const aside = document.querySelector('aside');
const pg1 = document.getElementById('page1')
const GraphBtn = document.getElementById('btnGraph');
const optionsGraph = document.getElementById('optionGraph');
const timeLap = document.getElementById('lap');
const timeLapBtn = document.getElementById('Btn');

function IndicLocation() {
    if (pg1 && window.location.pathname.endsWith('/Html/personalFact.html')) {
        pg1.classList.add('border-l-2', 'border-aquaPers');
    }
}
function addGraph() {
    // Verificar si los elementos existen antes de agregar los event listeners
    if (GraphBtn) {
        GraphBtn.addEventListener('click', () => {
            if (optionsGraph.classList.contains('hidden')) {
                optionsGraph.classList.add('flex');
                optionsGraph.classList.remove('hidden');
            } else {
                optionsGraph.classList.add('hidden');
                optionsGraph.classList.remove('flex');
            }
        });
    }
    if (timeLapBtn) {
        timeLapBtn.addEventListener('click', () => {
            if (timeLap.classList.contains('hidden')) {
                timeLap.classList.add('flex');
                timeLap.classList.remove('hidden');
            } else {
                timeLap.classList.add('hidden');
                timeLap.classList.remove('flex');
            }
        });
    }
}


function logout() {
    const btn = document.getElementById('btn-logout');

    btn.addEventListener('click', () => {

        Qual.errordb("Has cerrado sesión :c", "¡Hasta luego!");

        setTimeout(() => {
            window.location.href = '/facturacion/facturacion-personal/logout';
        }, 3000);
    });
}

function dropAccount() {
    const btn = document.getElementById('delete-account');

    btn.addEventListener('click', () => {
        Qual.errordb("Has eliminado tu cuena :c", "¡Hasta luego!");

        setTimeout(() => {
            window.location.href = '/facturacion/facturacion-personal/delete';
        }, 3000);
    });
}

function Avatar() {
    const btnavatar = document.getElementById('Cambiar');
    const inputavatar = document.getElementById('file-input');
    const img = document.getElementById('profile-img');


    btnavatar.addEventListener('click', () => {
        if (inputavatar) {
            inputavatar.click(); // Simula el clic en el input de archivo
        }
    });

    inputavatar.addEventListener('change', (event) => {
        const file = event.target.files[0]; // Obtener el archivo seleccionado

        if (file && img) {
            // Validar si el archivo es una imagen
            if (!file.type.startsWith('image/')) {
                alert('Por favor, selecciona un archivo de imagen.');
                return;
            }

            const reader = new FileReader();
            reader.onload = function (e) {
                img.src = e.target.result; // Establecer la imagen seleccionada como fuente de la etiqueta img
                img.classList.remove('hidden'); // Mostrar la imagen si estaba oculta
                avatarImg(file); // Llamar a la función para enviar la imagen al servidor
            };
            reader.readAsDataURL(file); // Leer el archivo como un URL de datos
        }
    });
}

function avatarImg(file) {
    const btn = document.getElementById('btn-submit');
    const formData = new FormData();
    formData.append('image', file); // 'image' debe coincidir con lo que espera el servidor

    fetch('http://localhost:3000/facturacion/facturacion-personal/update/api/v1', {
        method: 'POST',
        body: formData, // Enviar los datos del formulario al servidor
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error " + response.status + " al llamar al API: " + response.statusText);
            }
            return response.json();
        })
        .then(responseData => {
            console.log('Imagen enviada:', responseData);
        })
        .catch(error => {
            console.error('Error al enviar la imagen:', error);
        });
}

function guardarCambios() {
    const btn = document.getElementById('btn-submit');
    const form = document.getElementById("form");
    const password = document.getElementById('new-password');
    const fileInput = document.getElementById('file-input');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');

    btn.addEventListener('click', (e) => {
        e.preventDefault();

        const pass = password.value.trim();
        const imagenSeleccionada = fileInput.files.length > 0;
        const nombreCambiado = nameInput.value !== "";
        const emailCambiado = emailInput.value !== "";

        const quiereCambiarAlgo = imagenSeleccionada || pass || nombreCambiado || emailCambiado;

        if (!quiereCambiarAlgo) {
            Qual.errordb("No hiciste ningún cambio", "¡Inténtalo de nuevo!");
            return;
        }

        if (pass && pass.length < 5) {
            Qual.errordb("La contraseña debe tener al menos 5 caracteres", "¡Inténtalo de nuevo!");
            return;
        }

        if (!pass && (imagenSeleccionada || nombreCambiado || emailCambiado)) {
            // Si no hay nueva contraseña pero hay otros cambios, eliminamos ese input
            password.parentElement.remove(); // Oculta el div con el input también
            form.submit();
            return;
        }

        // Si todo está bien (con contraseña válida)
        Qual.successdb("Cambios guardados correctamente", "¡Perfecto!");
        setTimeout(() => {
            form.submit();
        }, 2000);
    });
}

function controlarCambios() {
    const inputNombre = document.getElementById('name');
    const inputEmail = document.getElementById('email');
    const inputPassNueva = document.getElementById('new-password');
    const inputPassActual = document.getElementById('current-password');

    const cambiarNombre = document.getElementById('cambiar-nombre');
    const cambiarEmail = document.getElementById('cambiar-email');
    const cambiarPassword = document.getElementById('cambiar-password');

    // Mostrar solo campo nombre
    cambiarNombre.addEventListener('click', () => {
        inputNombre.parentElement.style.display = 'block';
        inputEmail.parentElement.style.display = 'none';
        inputPassNueva.parentElement.style.display = 'none';
        inputPassActual.parentElement.style.display = 'none';
    });

    // Mostrar solo campo email
    cambiarEmail.addEventListener('click', () => {
        inputNombre.parentElement.style.display = 'none';
        inputEmail.parentElement.style.display = 'block';
        inputPassNueva.parentElement.style.display = 'none';
        inputPassActual.parentElement.style.display = 'none';
    });

    // Mostrar solo campos de contraseña
    cambiarPassword.addEventListener('click', () => {
        inputNombre.parentElement.style.display = 'none';
        inputEmail.parentElement.style.display = 'none';
        inputPassNueva.parentElement.style.display = 'block';
        inputPassActual.parentElement.style.display = 'block';
    });
}


// Ejecutarlo cuando cargue la página


function userSetting() {
    const carduser = document.getElementById('user-settings');
    const btnsetting = document.getElementById('logusr');

    btnsetting.addEventListener('click', () => {
        if (carduser.classList.contains('hidden')) {
            carduser.classList.remove('hidden');
        } else {
            carduser.classList.add('hidden');
        }
    });

}
const inputSearch = document.getElementById('simple-search');
const boxSearch = document.getElementById('box-search');

inputSearch.addEventListener('keyup', search);

function search() {
    const filter = inputSearch.value.toUpperCase();
    const li = boxSearch.getElementsByTagName("li");

    for (let i = 0; i < li.length; i++) {
        let a = li[i].getElementsByTagName("a")[0];
        let textValue = a.textContent || a.innerText;

        if (textValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

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

function Dropdowns2() {
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

function Dropdown3() {
    const btnCom = document.getElementById('btnCom');
    const tab = document.getElementById('compras');
    
    if (!btnCom || !tab) return; // ← Prevenir error si no existen

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
    const Dropdownbtn = document.getElementById('dropdown');
    const lista = document.getElementById('list');

    btn.addEventListener('click', () => {
        if(Dropdownbtn.classList.contains('hidden')){
            Dropdownbtn.classList.remove('hidden');
        }else{
            Dropdownbtn.classList.add('hidden');
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

userSetting();
Dropdown3()
Dropdowns2()
logout();
SideBar();
IndicLocation();
addGraph();
Notificaciones();
SideBar();
dropAccount();
Avatar();
guardarCambios();
controlarCambios();
