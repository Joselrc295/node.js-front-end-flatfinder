import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import MenuTransitions from "./MenuTransition";
import { getUserLogged } from "../services/users";
import { Link } from "react-router-dom";
import "../../src/services/style.css";

export default function Header() {
  const userId = localStorage.getItem("user_logged") || false;
  const [user, setUser] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);

  const processData = async () => {
    await getUserData();
  };

  const getUserData = async () => {
    const responseUser = await getUserLogged();
    console.log(responseUser);
    setUser(responseUser);
  };

  useEffect(() => {
    processData();
  }, []);

  return (
    <div>
      <AppBar position="sticky" className="backdrop-blur-sm bg-white/30 shadow-md">
        <Toolbar className="flex justify-between items-center p-4">
          <div className="flex items-center space-x-3">
            <Link to="/dashboard">
              <button className="unique-button" data-text="Flat Finder">
                <span className="actual-text">&nbsp;Flat Finder&nbsp;</span>
                <span aria-hidden="true" className="unique-hover-text">&nbsp;Flat Finder&nbsp;</span>
              </button>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <MenuTransitions user={user} setUser={setUser} />
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
