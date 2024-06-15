import {doc, getDoc} from "firebase/firestore";
import {db} from "../../src/Firebase";

export async function getUserLogged() {
    // const userId = getUserId();
    // if (userId) {
    //     const ref = doc(db, "users", userId);
    //     const dataUser = await getDoc(ref);
    //     return  {...dataUser.data()};

    // }
    return JSON.parse(localStorage.getItem("user_data_logged"))||false;
    
}

export  function getUserId() {
    return (localStorage.getItem('user_logged')) || false;
}