import Header from "../components/Header";
import UsersCards from "../components/UsersCards";
import { getUserLogged } from "../services/users";
import { useEffect } from "react";
import flatsImage from "../Imagenes/flats2.jpeg";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Users() {
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
  return (
    <div>
      <div style={{ position: "relative", zIndex: 1301 }}>
        <Header />
      </div>
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
        <div
          style={{
            zIndex: 1,
          }}
        >
          <div className="flex justify-center my-4">
            <button className="button" onClick={() => navigate("/users")}>
              View Users in a table
              <div className="hoverEffect">
                <div></div>
              </div>
            </button>
          </div>
          <UsersCards />
        </div>
      </div>
    </div>
  );
}
