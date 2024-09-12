import Header from "../components/Header";
// import { TableFlats } from "../components/Tables";
import checkUserLogged from "../services/actions";
import { getUserLogged } from "../services/users";
import { useState } from "react";
import { useEffect } from "react";
import { FlatCards } from "../components/FlatCards";
import flatsImage from "../Imagenes/flats2.jpeg"

export default function Home() {
    checkUserLogged();
    const [user, setUser] = useState();

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
            <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                <FlatCards type="all-flats" user={user} />
            </div>
        </div>
    );
}
