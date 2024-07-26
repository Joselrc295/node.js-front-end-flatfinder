import { Routes, Route } from "react-router-dom";
import "./App.css";
import LogIn from "./pages/LogIn";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import { NewFlat } from "./pages/NewFlat";
import UpdateProfile from "./pages/UpdateProfile";
import Profile from "./pages/Profile";
import Users from "./pages/Users";
import { MyFlats } from "./pages/MyFlats";
import { FavoriteFlats } from "./pages/FavoriteFlats";
import Flat from "./pages/Flat";
import FlatEdit from "./pages/FlatEdit";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Guardian from "./Guardian/Guardian";
import Users2 from "./pages/Users2"

function App() {
  return (
    <Routes>
      <Route path={"/"} element={<LogIn />} />
      <Route path={"/sign-up"} element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
     <Route
     path="/*"
     element={
      <Guardian>
        <Routes>
          <Route path={"/dashboard"} element={<Home />} />
          <Route path={"/profile"} element={<Profile />} />
          <Route path={"/profile/:userId"} element={<Profile />} />
          <Route path={"/update-profile"} element={<UpdateProfile />} />
          <Route path={"/update-profile/:userId"} element={<UpdateProfile />} />
          <Route path={"/users"} element={<Users />} />
          <Route path={"/my-flats"} element={<MyFlats />} />
          <Route path={"/favorite-flats"} element={<FavoriteFlats />} />
          <Route path={"/flat/:id"} element={<Flat />} />
          <Route path={"/flat/edit/:id"} element={<FlatEdit />} />
          <Route path={"/add-new-flat"} element={<NewFlat />} />
          <Route path={"/Users2"} element={<Users2 />} />
        </Routes>
      </Guardian>
     }>
     </Route>
    </Routes>
  );
}

export default App;
