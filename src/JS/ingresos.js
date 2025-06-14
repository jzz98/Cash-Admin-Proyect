const bars = document.querySelector('.fa-bars');
const aside = document.querySelector('aside');

function Dropdowns(){
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

function Dropdown2(){
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
function SideBar(){
    bars.addEventListener('click',()=>{
        if(aside.classList.contains('flex')){
            aside.classList.add('hidden');
            aside.classList.remove('flex');
            document.body.classList.remove('overflow-hidden');

        }else{
            aside.classList.add('flex');
            document.body.classList.add('overflow-hidden');
            aside.classList.remove('hidden');
        }
    });
}

function cancelar(){
    const btn = document.getElementById('cancelar');
    const inputs = ['input1', 'input2', 'input3', 'input4']; // Corrección: Usar strings con los IDs reales

    btn.addEventListener('click', () => {
        for (let i = 0; i < inputs.length; i++) {
            const input = document.getElementById(inputs[i]); // Corrección: Obtener el elemento correctamente
            if (input && input.value.length > 0) {
                input.value = '';
            }
        }
    });
}

function ProcessForm(){
    if (window.location.pathname.endsWith('/facturacion/ingresos/registrar-ingresos') && window.location.search.includes('success')) {
        Qual.successdb("¡Bien hecho!","Factura creada correctamente");
    }
    if (window.location.pathname.endsWith('/facturacion/ingresos/registrar-ingresos') && window.location.search.includes('error')) {
        Qual.errordb("Oh no !","Hubo un error, revisa tu solicitud");    
    }
}


fetch('http://localhost:3000/facturacion/ingresos/registrar-ingresos/v1/api/ver-usuario')
    .then(response => response.json())
    .then(data => {
        const btn = document.getElementById('btn');
        const form = document.getElementById('form');
        const div = document.getElementById('alert');
        
        btn.addEventListener('click', (e) =>{
            e.preventDefault();
            console.log(data);
            if(data.usuario || data.mensaje ){
                Qual.errordb("Oh no !","No has iniciado sesion en tu cuenta de banco, seras redirigido en 5 segundos");    
                return setTimeout(() => {
                    window.location.href = '/facturacion/bancos/iniciar-sesion';
                }, 5000);
            }
            
            if(data.ID){
                form.submit();
            }
        })
    })


window.addEventListener('load', () => {
    Dropdown2();    
    Dropdowns();
    SideBar();
    cancelar();
    ProcessForm();
});
