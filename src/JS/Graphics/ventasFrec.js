let Productos = [];
let Cantidad = [];
let total = [];
const input1 = document.getElementById('input1');
const input2 = document.getElementById('input2');

class Apis{
    constructor(){
        this.charData1 = null;
        this.charData2 = []
    }
    
    API1(){
        fetch('http://localhost:3000/facturacion/reportes/ventas-generales/Api')
            .then(response => response.json())
            .then(data => {
                data.forEach(element => {
                    Productos.push(element.Producto);
                });
                
                let totalProdcutos = Productos.reduce((acumulador, value) =>{
                    acumulador[value] = (acumulador[value] || 0) + 1;
                    return acumulador;
                }, {});
                
                for(let i = 0; i < Productos.length; i++){
                    Cantidad.push(totalProdcutos[Productos[i]]);
                }
                
                let chartDom = document.getElementById('containergraph');
                let myChart = echarts.init(chartDom);
                let option;

                this.charData1 =  Object.keys(totalProdcutos).map(producto => ({
                    name: producto,
                    value: totalProdcutos[producto]
                }));

                
                option = {
                    title: {
                        text: 'Productos mas vendidos',
                        subtext: 'Productos',
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left'
                    },
                    series: [
                        {
                            name: 'Access From',
                            type: 'pie',
                            radius: '50%',
                            data: this.charData1,
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                  ]
                };
                option && myChart.setOption(option);
                setTimeout(() =>{
                    this.enviarGraficoAlServidor(myChart)

                }, 10000)
            });
    }

    API2(){
        fetch('http://localhost:3000/facturacion/reportes/ventas-generales/ApiClient')
            .then(response => response.json())
            .then(data => {
                let info = [];
                data.forEach(element =>{
                    info.push(element.Contacto);
                })

                let totalProdcutos = info.reduce((acumulador, value) =>{
                    acumulador[value] = (acumulador[value] || 0) + 1;
                    return acumulador;
                }, {});

                let chartDom2 = document.getElementById('main');
                let myChart2 = echarts.init(chartDom2);
                let option2;

                let objeto = Object.keys(totalProdcutos).map(producto => ({
                    name: producto,
                    value: totalProdcutos[producto]
                }));
            
                option2 = {
                    title: {
                        text: 'Clientes mas frecuentes',
                        subtext: 'Clientes',
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left'
                    },
                    series: [
                        {
                            name: 'Access From',
                            type: 'pie',
                            radius: '50%',
                            data: objeto,
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };

                option2 && myChart2.setOption(option2);
                
                let myChart = echarts.getInstanceByDom(myChart2);

                setTimeout(() =>{
                    this.enviarGraficoAlServidor(myChart2)

                }, 10000)
            });
            
    }

    enviarGraficoAlServidor(myChart){
    
        // Obtener la imagen en base64
        let imgData = myChart.getDataURL({
            type: 'png',
            pixelRatio: 2,
            backgroundColor: '#fff'
        });
        
        let blob = this.base64ToBlob(imgData);
        // Convertir base64 a Blob
        let formData = new FormData();
        formData.append('file', blob, 'grafico.png'); // Agregamos el archivo con un nombre
        // Enviar la imagen al backend con Fetch
        fetch('http://localhost:3000/facturacion/reportes/ventas-generales/get', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if(!response.ok){
                throw new Error("Error " + response.status + " al llamar al API: " + response.statusText);
            }
            
            return response.json();
            
        })
        .then(response => console.log('Imagen enviada:', response))
        .catch(error => console.error('Error al enviar la imagen:', error));
    
    }

    base64ToBlob(base64) {
        let byteCharacters = atob(base64.split(',')[1]);
        let byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        let byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: 'image/png' });
    }
    

}

const div = document.querySelector('#load');
const main = document.querySelector('main');
div.innerHTML = `
    <div class="flex flex-col justify-center align-middle overflow-x-hidden absolute rounded-lg p-6 lg:overflow-visible mt-[200px]" id="">
        <svg class="w-16 h-16 animate-spin text-gray-900/50" viewBox="0 0 64 64" fill="none"
            xmlns="http://www.w3.org/2000/svg" width="24" height="24">
            <path
            d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
            stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"></path>
            <path
            d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
            stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" class="text-gray-900">
            </path>
        </svg>
        <p class="text-sm text-center -ml-[35px] font-semibold text-aqua2Pers mt-2">Cargando los reportes...</p>
    </div>
`;
main.classList.add('overflow-hidden', 'xl:h-screen');
setTimeout(() => {
    const load = document.getElementById('load')
    load.remove();
    main.classList.remove('overflow-hidden', 'xl:h-screen');
    
}, 10000);

function AddClientFrom(){
    const btn = document.getElementById('add');
    const closeModal = document.getElementById('Close');
    const modal = document.getElementById('crud-modal');
    
    if(btn){
        btn.addEventListener("click", () =>{
            if(modal.classList.contains('flex')){
                modal.classList.remove('flex');
                modal.classList.add('hidden');
                background.classList.remove('block');
            }else{
                modal.classList.remove('hidden');
                modal.classList.add('flex');
                background.classList.add('block', 'z-10');
    
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

}
const Main = new Apis();
Main.API1();
Main.API2();
AddClientFrom();
    
