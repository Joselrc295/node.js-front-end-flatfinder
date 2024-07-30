import Header from "../components/Header";
import { TableFlats } from "../components/Tables";
import checkUserLogged from "../services/actions";
import { getUserLogged } from "../services/users";
import { useState } from "react";
import { useEffect } from "react";
import { FlatCards } from "../components/FlatCards";
import flatsImage from "../Imagenes/flats2.jpeg";



export default function Home(){
    checkUserLogged()
    const [user , setUser] = useState()
    const processData = async () => {
        await getUserData();
      };
    
      const getUserData = async () => {
        const responseUser = await getUserLogged();
        setUser(responseUser);
      };
      useEffect(() => {
        processData();
      }, []);
    return (
      <div>
        <Header/>
        <div
        style={{
          backgroundImage: `url(${flatsImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingTop: "20px",
          zIndex: -2,
        }}
        >
        <FlatCards type="all-flats" user={user}/>
        </div>
        </div>
    )   
}