document.addEventListener('DOMContentLoaded', () => {
    const noticiasContainer = document.getElementById('add-noticias');

    if (!noticiasContainer) {
        console.error('El contenedor con ID "add-noticias" no existe en el DOM.');
        return;
    }

const crearCartaNoticia = (noticia) => {
    const card = document.createElement('div');
    card.className = `
        max-w-sm m-2 bg-white border border-gray-200 rounded-2xl shadow-md 
        dark:bg-gray-800 dark:border-gray-700 overflow-hidden flex flex-col
        transition-transform hover:scale-[1.02] duration-200 ease-in-out
    `;

    card.innerHTML = `
        <a href="${noticia.Link}">
            <div class="w-full h-[160px] overflow-hidden">
                <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
                    src="/Noticias-images/${noticia.Nombre_imagen}" alt="${noticia.Titulo}">
            </div>
        </a>
        <div class="p-4 flex flex-col justify-between flex-1">
            <div class="mb-3">
                <a href="${noticia.Link}">
                    <h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white line-clamp-2">
                        ${noticia.Titulo}
                    </h5>
                </a>
                <p class="mt-2 text-sm text-gray-700 dark:text-gray-400 line-clamp-3">
                    ${noticia.Contenido}
                </p>
            </div>
            <a href="${noticia.Link}" target="_blank" 
                class="mt-auto inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg 
                dark:bg-aquaPers dark:focus:ring-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 
                transition-colors duration-200 hover:brightness-110">
                Ver noticia
                <svg class="rtl:rotate-180 w-4 h-4 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" 
                    fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M1 5h12m0 0L9 1m4 4L9 9"/>
                </svg>
            </a>
        </div>
    `;

    return card;
};


    // Obtener noticias desde el backend
    fetch('http://localhost:3000/App/aas/Admin/api/v1/notification-api')
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data)) {
                let fila = null;

                for (let i = 0; i < data.length; i++) {
                    const noticia = data[i];

                    // Crear un nuevo contenedor de fila cada 3 noticias
                    if (i % 3 === 0) {
                        fila = document.createElement('div');
                        fila.className = 'flex flex-wrap mb-4';
                        noticiasContainer.appendChild(fila);
                    }

                    const carta = crearCartaNoticia(noticia);
                    fila.appendChild(carta);
                }
            } else {
                console.error('Los datos recibidos no son un array:', data);
            }
        })
        .catch((error) => {
            console.error('Error al obtener las noticias:', error);
        });
});

let swiper = new Swiper(".mySwiper", {
    spaceBetween: 30,
    centeredSlides: true,
    autoplay: {
        delay: 5500,
        disableOnInteraction: false,
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
});