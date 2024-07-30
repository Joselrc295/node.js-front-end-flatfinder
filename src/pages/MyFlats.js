import Header from "../components/Header"
import { TableFlats } from "../components/Tables"
import { getUserLogged } from "../services/users";
import { useEffect } from "react";
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import { FlatCards } from "../components/FlatCards";
import flatsImage from "../Imagenes/flats2.jpeg";

const MyFlats = () =>{
    const navigate = useNavigate();
    
    useEffect(() => {
        const checkUserLogged = async () => {
          const userLogged = await getUserLogged();
          if (!userLogged) {
            window.location.href = "/";
          }
        };
        checkUserLogged();
      }, []);

      const buttonClick = () => {
        navigate('/add-new-flat');
      };
      
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
    <FlatCards type={'my-flats'}/>
    <br></br>
    <br></br>
    <div className="flex justify-center my-1">
            <button className="button" onClick={() => navigate("/add-new-flat")}>
              Add new Flat
              <div className="hoverEffect">
                <div></div>
              </div>
            </button>
          </div>
   </div>
    
    </>)
}



export {MyFlats}