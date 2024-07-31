import FlatForm from "../components/FlatForm";
import {useParams} from "react-router-dom";
import Header from "../components/Header";
import { getUserLogged } from "../services/users";
import { useEffect } from "react";
import flatsImage from "../Imagenes/flats2.jpeg";

export default function FlatEdit() {
    let  {id } = useParams()
    useEffect(() => {
        const checkUserLogged = async () => {
          const userLogged = await getUserLogged();
          if (!userLogged) {
            window.location.href = "/";
          }
        };
        checkUserLogged();
      }, []);
    return (
        <div>
          
            <Header/>
          <div style={{
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
        }}>
            <h1>Flat-Update</h1>
            <FlatForm type={'update'} id = {id}/>
          </div>
        </div>
    );
}