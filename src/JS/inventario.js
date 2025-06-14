const cantidad = document.querySelectorAll('#Cantidad');
const categorias = document.getElementById('Categoria');
const precio = document.getElementById('Precio');
const w1 = document.getElementById('cnatidad-w');
const w2 = document.getElementById('categorias-w');
const w3 = document.getElementById('precio-w');

let sumaCantiad = 0;
let cantidadArray = [];
let categoriasArray = [];
let precioArray = [];
let precioTotal = 0;

let responseApi = [];
// Apis 
fetch('http://localhost:3000/facturacion/inventario/api')
    .then(response => response.json())
    .then(responseData => {
        responseData.forEach(element => {
            responseApi.push(element.Producto)
            let valor = parseFloat(element.Cantidad);
            let categoriasLength = element.Categorias;
            let precioTotal = element.Precio;

            precioArray.push(precioTotal);
            categoriasArray.push(categoriasLength);
            cantidadArray.push(valor)
        });
        for(let i = 0; i < cantidadArray.length; i++){
            const numero = cantidadArray[i];
            sumaCantiad += numero;
        }

        for(let i = 0; i < precioArray.length; i++){
            const numero = precioArray[i];
            precioTotal += numero;
        }
    })
    .catch(error => {
        window.location.href = 'error'
    });

// Api ingresos
fetch('http://localhost:3000/facturacion/inventario/api/getproductos')
    .then(response => response.json())
    .then(data => {
        
        let arr = [];
        let less = [];
        for(let i = 0; i < data.length; i++){
            arr.push(data[i].Producto);
        }

        arr.forEach(element => {
            for(let i = 0; i < responseApi.length; i++){
                if(responseApi[i] == element){
                    less.push(responseApi[i]);
                }
            }
        });

        w1.innerHTML = (sumaCantiad - less.length);
        w2.innerHTML = categoriasArray.length;
        w3.innerHTML = (precioTotal * less.length);
    })


function Validar(){
    const input1 = document.getElementById('input1');
    const input2 = document.getElementById('input2');
    const input3 = document.getElementById('input4');
    const form = document.getElementById('form');

    form.addEventListener('submit', (event) =>{
        event.preventDefault();
        if(input1.value.length < 2 || input2.value.length < 1 || input3.value.length < 1){
            return Qual.errordb("Oh no !","Los campos no son validos, deben contener mas caracteres");    
        }

        form.submit();
    });


}

const bars = document.querySelector('.fa-bars');
const aside = document.querySelector('aside');
function Dropdowns() {
    const btn = document.getElementById('btning');
    const tab = document.getElementById('ingresos');

    btn.addEventListener('click', () => {
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
    const btn = document.getElementById('btnCom');
    const tab = document.getElementById('compras');
    btn.addEventListener('click', () => {
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
    this.bars.addEventListener('click', () => {
        if (this.aside.classList.contains('flex')) {
            this.aside.classList.add('hidden');
            this.aside.classList.remove('flex');
            document.body.classList.remove('overflow-hidden');
        } else {
            this.aside.classList.add('flex');
            document.body.classList.add('overflow-hidden');
            this.aside.classList.remove('hidden');
        }
    });
}

function user() {
    const button = document.getElementById('logusr');
    const card = document.getElementById('user-settings');

    button.addEventListener('click', () => {
        if (card.classList.contains('hidden')) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
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

Notificaciones();
user()
Dropdown2();
Dropdowns();
SideBar();
Validar();