class Obj {
    constructor() {
        this.bars = document.querySelector('.fa-bars');
        this.aside = document.querySelector('aside');
    }

    Dropdowns() {
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

    Dropdown2() {
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
    SideBar() {
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
    user() {
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

    Notificaciones() {
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
}

document.addEventListener('DOMContentLoaded', () => {
    const main = new Obj();
    main.Dropdowns();
    main.SideBar();
    main.user();
    main.Notificaciones();
})
