import FlatForm from "../components/FlatForm";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { getUserLogged } from "../services/users";
import { useEffect } from "react";
import flatsImage from "../Imagenes/flats2.jpeg";

export default function FlatEdit() {
  let { id } = useParams();

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
          zIndex: -2,
        }}
      >
        <div
          style={{ position: "relative", zIndex: 1301, alignSelf: "stretch" }}
        >
          <Header />
        </div>
        <div className="bg-white bg-opacity-80 rounded-lg px-2 py-1 shadow-lg max-w-xl w-full mt-3">
          <h1 className="text-4xl font-bold text-center mb-4">Flat Update</h1>
          <FlatForm type={"update"} id={id} />
        </div>
      </div>
    </div>
  );
}
