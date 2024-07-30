import { TableFlats } from "../components/Tables"
import Header from "../components/Header"
import { getUserLogged } from "../services/users";
import { useEffect } from "react";
import flatsImage from "../Imagenes/flats2.jpeg";
import { FlatCards } from "../components/FlatCards";

    
const FavoriteFlats = () =>{
    useEffect(() => {
        const checkUserLogged = async () => {
          const userLogged = await getUserLogged();
          if (!userLogged) {
            window.location.href = "/";
          }
        };
        checkUserLogged();
      }, []);
    return(
    <>
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
    <FlatCards type= {'favorite-flats'}/>
    </div>
    </>
    )
}

export {FavoriteFlats} ; 