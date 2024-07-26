import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import MenuTransitions from "./MenuTransition";
import { getUserLogged } from "../services/users";
import ApartmentIcon from "@mui/icons-material/Apartment";
import { Link } from "react-router-dom";

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
      <AppBar position="sticky" className="bg-white shadow-md" >
        <Toolbar className="flex justify-between items-center p-4">
          <div className="flex items-center space-x-3">
            <Link to="/dashboard">
              <ApartmentIcon sx={{ fontSize: 40, color: 'text.primary' }} />
            </Link>
            <Link to="/dashboard" className="text-2xl font-semibold text-gray-900">
              Flat Finder
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
