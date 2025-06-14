const bars = document.querySelector('.fa-bars');
const aside = document.querySelector('aside');

function Menus(){
    let bars = document.querySelector('.fa-bars');
    let Btn = document.querySelector('#btn');
    let lap = document.querySelector('#lap');
    const arr = ['btn2','btn3','btn4','btn5','btn6'];

    bars.addEventListener('click',()=>{
        if(aside.classList.contains('flex')){
            aside.classList.add('hidden');
            aside.classList.remove('flex');
            document.body.classList.remove('overflow-hidden');
        }else
            aside.classList.add('flex');
            document.body.classList.add('overflow-hidden');
            aside.classList.remove('hidden');
        
    });
    Btn.addEventListener('click', () => {
        if (lap.classList.contains('hidden')) {
            lap.classList.add('flex');
            lap.classList.remove('hidden');
        } else {
            lap.classList.add('hidden');
            lap.classList.remove('flex');
        }
    });
    // Recorre todos los elementos del array
    for (let i = 1; i < arr.length+1; i++) {
        let buttons = document.getElementById(`btn${i+1}`);
        
        if (buttons) {
            const texto = buttons.innerText;
            buttons.addEventListener('click', () => {
                Btn.innerHTML = `${texto} <i class="fas fa-caret-down mt-1 ml-1"></i>`;
                if (lap.classList.contains('hidden')) {
                    lap.classList.add('flex');
                    lap.classList.remove('hidden');
                } else {
                    lap.classList.add('hidden');
                    lap.classList.remove('flex');
                }
            });
        }
    }


}

function IndicateLoc(){
    const pg2 = document.getElementById('page2');
    // Agrega un borde al path si se encuentra en la pagina "Fact"
    if (pg2 && window.location.pathname.endsWith('/Html/fact.html')) {
        pg2.classList.add('border-l','border-l-2','border-aquaPers');
    }
}

function SelectLogo(){
    const logoUser = document.querySelector('.logouser');
    const inputfile = document.getElementById('fileinput');
    const output = document.getElementById('output');
    const trash = document.querySelector('#trash1');
    let imagen = document.getElementById('bg');
    // Medidas requeridas de las imagenes
    const REQUIRED_WIDTH = 178;
    const REQUIRED_HEIGHT = 51; 

    // Evento de clikc sobre el input file
    logoUser.addEventListener('click', () => {
        if(inputfile.classList.contains('r1')){
            inputfile.click();
        }   
    });

    // Evento de cambio sobre el input file
    inputfile.addEventListener('change', (event) => {
        // Convierte en un array el file
        const files = Array.from(event.target.files);
        output.innerHTML = ""; // Limpia el contenido previo
        
        // Si no se selecciona un archvio deja un mensaje de error
        if (files.length === 0) {
            output.textContent = "No se seleccionaron archivos.";
            return;
        }
        // Recorrre el archivo seleccionado 
        files.forEach((file) => {
            // Verifica si el archivo es tipo imagen
            if (!file.type.startsWith("image/")) {
                output.innerHTML = `<p>${file.name}: No es una imagen válida.</p>`;
                output.classList.add('text-red-600','text-bold');
                return;
            }
            
            // Inicia una instancia de una imagen
            const img = new Image();
            // Crea una url del archvio para poder trabajarlo
            const url = URL.createObjectURL(file);
        
        // Carga el archvio
        img.onload = () => {
            // Si la imagen cumple con los requerimientos se agregaran las siguientes clases
            if (img.width === REQUIRED_WIDTH && img.height === REQUIRED_HEIGHT) {
                    imagen.style.backgroundImage = `url(${url})`;
                    imagen.classList.add('w-56', 'ml-10');
                    imagen.classList.remove('hidden');
                    logoUser.classList.add('hidden');
                    logoUser.classList.remove('flex');
                    trash.classList.remove('hidden');
                // Si no tiene la clase 'break' y el ícono de la basura no ha sido clickeado antes
            } else {
                output.classList.add('text-red-600','text-bold');
                output.innerHTML += `<p>Dimensiones no válidas (${img.width}x${img.height}).</p>`;
            }
            };
        //Si hay algun error con la imagen
        img.onerror = () => {
            output.innerHTML = `<p>${file.name}: No se pudo cargar la imagen.</p>`;
            output.classList.add('text-red-600','text-bold');
        };
    
            img.src = url;
        });
    });
    
    
    // Evento de eliminar imagen
    trash.addEventListener('click', () => {
        logoUser.classList.add('flex');
        logoUser.classList.remove('hidden');
        imagen.style.backgroundImage = "";
        imagen.classList.add('hidden');
        trash.classList.add('hidden'); // Oculta el ícono de la basura

        // Reinicia el valor del input file
        inputfile.value = ""; // Esto permite seleccionar el mismo archivo nuevamente
    });
}
function NewLine() {
    const btn = document.getElementById('nuevaLineaBtn');
    const trash = document.querySelector('#trash2');
    const warraper = document.querySelector('.NlineaWarraper');

    btn.addEventListener('click', () => {
        trash.classList.remove('hidden');
        const newLineContent = `
            <div class="flex flex-col justify-center my-10 border-t pt-5 xl:flex-col xl:my-20 xl:align-middle">
                <div class="flex flex-col mx-4 xl:justify-center">
                    <span class="text-[12px] font-bold md:text-sm text-gray2Pers">Producto</span>
                    <input required type="text" placeholder="Buscar producto o servicio..." class="pl-2 bg-gray-200 focus-visible:border-aquaPers placeholder:text-[14px] border-[1px] rounded-lg h-5 focus:outline-none md:h-8 hover:border-aquaPers">
                    <span class="text-[12px] font-bold mt-4 md:text-sm text-gray2Pers">Referenica</span>
                    <input required type="text" placeholder="Referencica" class="pl-2 focus-visible:border-aquaPers bg-gray-200 placeholder:text-[14px] border-[1px] rounded-lg h-5 focus:outline-none md:h-8 hover:border-aquaPers">
                    <span class="text-[12px] font-bold mt-4 md:text-sm text-gray2Pers">Precio</span>
                    <input oninput="this.value = this.value.replace(/[^0-9-]/g, '')" inputmode="numeric" name="Precio" required type="text" placeholder="Precio" class="precio pl-2 focus-visible:border-aquaPers bg-gray-200 placeholder:text-[14px] border-[1px] rounded-lg h-5 focus:outline-none md:h-8 hover:border-aquaPers">
                </div>
                <div class="flex flex-col mx-4 xl:justify-center">
                    <span class="text-[12px] font-bold md:text-sm text-gray2Pers">Desc %</span>
                    <input oninput="this.value = this.value.replace(/[^0-9-]/g, '')" inputmode="numeric" name="Descuento" type="text" placeholder="Desc" class="Descuento pl-2 focus-visible:border-aquaPers bg-gray-200 placeholder:text-[14px] border-[1px] rounded-lg h-5 focus:outline-none md:h-8 hover:border-aquaPers">
                    <span class="text-[12px] font-bold mt-4 md:text-sm text-gray2Pers">Impuesto</span>
                    <input required name="Impuestos" type="text" placeholder="Impuesto" class="pl-2 focus-visible:border-aquaPers bg-gray-200 placeholder:text-[14px] border-[1px] rounded-lg h-5 focus:outline-none md:h-8 hover:border-aquaPers">
                </div>
                <div class="flex flex-col mx-4 xl:justify-center">
                    <span class="text-[12px] font-bold md:text-sm text-gray2Pers">Cantidad</span>
                    <input oninput="this.value = this.value.replace(/[^0-9-]/g, '')" inputmode="numeric" id="Cantidad" name="Cantidad" required type="text" placeholder="Cantidad" class="pl-2 focus-visible:border-aquaPers bg-gray-200 placeholder:text-[14px] border-[1px] rounded-lg h-5 focus:outline-none md:h-8 hover:border-aquaPers">
                    <span class="text-[12px] font-bold md:text-sm text-gray2Pers">Descripción</span>
                    <input type="text" name="" placeholder="Descripción" class="bg-gray-200 pl-2 focus-visible:border-aquaPers bg-gray-200 placeholder:text-[14px] border-[1px] rounded-lg h-5 focus:outline-none md:h-8 hover:border-aquaPers">
                </div>
                <div class="flex justify-between pt-2">
                    <div class="mx-4" id="total">
                        <span class="text-[12px] font-bold md:text-sm text-gray2Pers">Total</span>
                        <span class="totalR text-gray2Pers md:text-sm">RD$ 0.00</span>
                    </div> 
                    <div>
                        <button type="button" class="Calcular mr-4 inline-flex items-center px-3 py-1 text-sm font-medium text-center text-white rounded-lg focus:outline-none dark:bg-aquaPers">
                            Calcular
                        </button>
                    </div>
                </div>
            </div>        
        `;

        warraper.insertAdjacentHTML('beforeend', newLineContent);
    });

    trash.addEventListener('click', () => {
        const lastLine = warraper.lastElementChild;

        if (lastLine) {
            lastLine.remove(); // Elimina la última línea agregada
        }

        // Oculta el ícono de la basura si no hay más líneas
        if (warraper.children.length === 0) {
            trash.classList.add('hidden');
        }
    });
}

function IngresosDrop(){
    const btn =  document.getElementById('btning');
    const tab = document.getElementById('ingresos');
    btn.addEventListener('click', ()=>{
        if(!tab.classList.contains('hidden')){
            tab.classList.remove('flex');
            tab.classList.add('hidden');
        }else{
            tab.classList.remove('hidden');
            tab.classList.add('flex');
        }
    });
}

function ComprasDrop(){
    const btn =  document.getElementById('btnCom');
    const tab = document.getElementById('compras');
    btn.addEventListener('click', ()=>{
        if(!tab.classList.contains('hidden')){
            tab.classList.remove('flex');
            tab.classList.add('hidden');
        }else{
            tab.classList.remove('hidden');
            tab.classList.add('flex');
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

function ProcessForm(){
    if (window.location.pathname.endsWith('/facturacion/factura-nueva') && window.location.search.includes('success')) {
        Qual.successd("¡Bien hecho!","Factura creada correctamente");
    }
    if (window.location.pathname.endsWith('/facturacion/factura-nueva') && window.location.search.includes('error')) {
        Qual.error("Oh no !","Hubo un error en tu solicitud");    
    }
}

function Calcular() {
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('Calcular')) {
            // Obtener la línea (div contenedor) del botón clickeado
            const linea = event.target.closest('.flex.flex-col'); // Ajusta el selector según tu estructura
    
            // Obtener los elementos de la línea
            const precio = linea.querySelector('.precio');
            const descuento = linea.querySelector('.Descuento');
            const cantidad = linea.querySelector('#Cantidad');
            const total = linea.querySelector('.totalR');
    
            // Validar que el campo de precio no esté vacío
            if (!precio.value.trim()) {
                alert('El campo Precio no puede estar vacío.');
                return;
            }
    
            // Convertir valores a números
            const precioNum = parseFloat(precio.value) || 0;
            const descuentoNum = parseFloat(descuento.value) || 0;
            const cantidadNum = parseFloat(cantidad.value) || 1; // Si no hay cantidad, asumimos 1
    
            // Calcular el monto del descuento y el precio final
            const montoDescuento = (precioNum * descuentoNum) / 100;
            const precioFinal = (precioNum - montoDescuento) * cantidadNum;
    
            console.log(`Precio final de esta línea: RD$ ${precioFinal.toFixed(2)}`);
            
            // Mostrar el total formateado
            total.textContent = `RD$ ${precioFinal.toFixed(2)}`;
    
            // Llamar a la función para actualizar la suma total
            actualizarSumaTotal();
        }
    });
}

let sumaTotal = 0;
const input = document.getElementById('totalInput');

function actualizarSumaTotal() {
    const totales = document.querySelectorAll('.totalR');
    const totalGeneral = document.querySelector('#totalGeneral');

    totales.forEach((total) => {
        // Extraer el valor numérico del texto (eliminando "RD$" y convirtiendo a número)
        const valorTexto = total.textContent.replace('RD$', '').trim();
        const valor = parseFloat(valorTexto);

        if (!isNaN(valor)) { // Verificar que el valor sea un número válido
            sumaTotal += valor;
        } else {
            console.warn(`Valor no válido encontrado: ${valorTexto}`);
        }
    });


    if (totalGeneral) {
        totalGeneral.innerHTML = `RD$ ${sumaTotal.toFixed(2)}`;
        input.value = sumaTotal;
    }
}

const formulario = document.getElementById('form');
formulario.addEventListener('submit', () =>{
    window.location.href = "/facturacion/generar-pdf";
    setTimeout(() => {
        window.location.href = "/facturacion/factura-nueva?success";
        input.value = 0;
    }, 100); 
});

window.addEventListener('load', () =>{
    input.value = 0;
})

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

const inputtel = document.getElementById('input-tel')

inputtel.addEventListener('input', function (e) {
    let value = e.target.value;

    // Eliminar todo lo que no sea número
    value = value.replace(/[^0-9]/g, '');

    // Insertar guion cada 3 dígitos
    let formatted = '';
    for (let i = 0; i < value.length; i += 3) {
      if (i > 0) formatted += '-';
      formatted += value.substr(i, 3);
    }

    e.target.value = formatted;
});

// api
fetch('http://localhost:3000/facturacion/factura-nueva/api')
    .then(response => response.json())
    .then(data => {
        const list = document.getElementById('simple-search-3');
        if (!list) {
            console.error('El elemento con ID "simple-search-3" no existe en el DOM.');
            return;
        }   
        console.log(data)
        data.forEach(Element => {
            const listcontent = document.createElement('option');
            listcontent.value = Element.Producto; // Establece el valor del <option>
            listcontent.textContent = Element.Producto; // Establece el texto visible del <option>
            list.appendChild(listcontent);
        });
    })
    .catch(error => {
        console.error('Error al obtener los datos de la API:', error);
    });

window.addEventListener('load', () => {
    Calcular();
    NewLine();
    ProcessForm();
    SelectLogo();
    Menus();
    IngresosDrop();
    Dropdown2();
    Dropdowns();
    user();
    SideBar();
    Notificaciones();
    formatWithDashes();
});
