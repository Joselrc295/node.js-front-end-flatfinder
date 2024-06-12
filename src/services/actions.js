export default function checkUserLogged(){
    const userId = (localStorage.getItem('user_logged')|| false);
    if(!userId){
        window.location.href= '/';
    }
}