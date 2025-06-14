class Obj{
    constructor(){
        this.sideBar = document.getElementById('fas');
        this.dropDown = document.getElementById('drop');
        this.navBar = document.getElementById('nav');
        this.asideC = document.querySelector('aside');
        this.body = document.querySelector('body');
    }
    Aside(){
        this.sideBar.addEventListener('click', () => {
            if (this.asideC.className === 'v1') {
                this.asideC.className = '';
                this.body.className = ''
            } else {
                this.asideC.className = 'v1';
                this.body.className = 'v2';
            }
        });
    
    }
    Scroll(){
        document.addEventListener('scroll', () =>{
            this.navBar.className = 'nav-bar n';
        });
    }
    DropDownFoot() {
        let list = ['l1', 'l2', 'l3'];
        let listUl = ['Dl1', 'Dl2', 'Dl3'];
        const mediaQuery = window.matchMedia("(min-width: 1200px)");

        for (let i = 0; i < list.length; i++) {
            let elemento = document.querySelector(`.${list[i]}`);
            let ul = document.querySelector(`.${listUl[i]}`);

            elemento.addEventListener('click', () => {
                if(!mediaQuery.matches){
                    if(ul.className === 'r'){
                        ul.className = `Dl${i+1}`;
                    }else{
                        ul.className = 'r';  // Esto asigna una clase específica basada en el índice
                    }
                }
            });
        }
    }
}
const main = new Obj();
main.Aside();
main.Scroll();
main.DropDownFoot();
