function AddClientFrom(){
    const btn = document.getElementById('add');
    const closeModal = document.getElementById('Close');
    const modal = document.getElementById('crud-modal');
    
    if(btn){
        btn.addEventListener("click", () =>{
            if(modal.classList.contains('flex')){
                modal.classList.remove('flex');
                modal.classList.add('hidden');
            }else{
                modal.classList.remove('hidden');
                modal.classList.add('flex');
    
            }
        });
    
    }
    if(closeModal){
        closeModal.addEventListener('click', () =>{
            modal.classList.remove('flex');
            modal.classList.add('hidden');
            background.classList.remove('block');
        });
    }

}

function verificar(){
    const PIN = document.getElementById('PIN');
    const password = document.getElementById('password');
    const error = document.getElementById('container');
    const btn = document.getElementById('btn');

    btn.addEventListener('click', (e) =>{
        e.preventDefault();

        if(PIN.value.length < 5 || password.value.length < 5){
            return error.innerHTML = 'Los datos son incorrectos';
        }

        e.submit();
    })
}

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

Dropdowns();
Dropdown2();
verificar();
AddClientFrom();