export let obj ={
    Create(key,value){
        localStorage.setItem(key,value);
    },
    Delete(key){
        localStorage.removeItem(key);
    },
    Recuperar(key){
        return localStorage.getItem(key);
    },
    DeleteAll(){
        localStorage.clear();
    }
}
