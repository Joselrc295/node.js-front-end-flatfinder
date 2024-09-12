import Header from "../components/Header";
// import UsersCards from "../components/UsersCards";
import { getUserLogged } from "../services/users";
import { useEffect } from "react";
// import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import flatsImage from "../Imagenes/flats2.jpeg";
import UsersTable from "../components/UsersTable";

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
        <div className="flex justify-center my-4">
          <button className="button" onClick={() => navigate("/Users2")}>
            View Users as Cards
            <div className="hoverEffect">
              <div></div>
            </div>
          </button>
        </div>
        <UsersTable />
      </div>
    </div>
  );
}
