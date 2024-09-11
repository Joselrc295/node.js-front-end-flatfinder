import Header from "../components/Header";
import { useEffect } from "react";
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import { FlatCards } from "../components/FlatCards";
import flatsImage from "../Imagenes/flats2.jpeg";
import { getUserLogged } from "../services/users"; 

const MyFlats = () => {
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

  return (
    <>
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
        <div style={{ position: "relative", zIndex: 1301, alignSelf: "stretch" }}>
          <Header />
        </div>
        <div style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          padding: "20px 0",
        }}>
          <FlatCards type={'my-flats'} />
        </div>
        <div style={{ position: "relative", zIndex: 1301, paddingBottom: "20px" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={buttonClick}
            sx={{ boxShadow: 3 }}
          >
            Add New Flat
          </Button>
        </div>
      </div>
    </>
  );
}

export { MyFlats };
