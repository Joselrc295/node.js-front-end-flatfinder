import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { InputAdornment, IconButton } from "@mui/material";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import { doc, updateDoc, addDoc, getDoc, collection } from "firebase/firestore";
import { db } from "../Firebase";
import Api from "../services/api";

export default function FormRegister({ type, onSuccessRedirect, userId }) {
  console.log(type, userId);
  const [showPassword, setShowPassword] = useState(false);
  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };
  const navigate = useNavigate();
  const [alertSeverity, setAlertSeverity] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [allFieldsFilled, setAllFieldsFilled] = useState(true); // Estado para controlar si todos los campos están llenos
  // const userLogged = (localStorage.getItem("user_logged"));
  const userLoggedData = JSON.parse(localStorage.getItem("user_data_logged"));
  let updatedLogged = false;

  const showAlertMessage = (severity, message) => {
    setAlertSeverity(severity);
    setAlertMessage(message);
    setShowAlert(true);
  };

  const currentDate = new Date().toISOString().slice(0, 10);
  const [userLoaded, setUserLoaded] = useState(false);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    birthday: "",
    role: "",
  });

  const firstNameRef = useRef("");
  const lastNameRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const birthdayRef = useRef(currentDate);
  const roleRef = useRef("");
  const confirmPasswordRef = useRef("");

  let ref = null;
  if (userId === null && type !== "create") {
    updatedLogged = true;
  }
  if (userId && type !== "create") {
    ref = doc(db, "users", userId);
  }

  const refCreate = collection(db, "users");

  const today = new Date();
  const minBirthDate = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0]; //
  const maxBirthDate = new Date(
    today.getFullYear() - 120,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0]; // Fecha máxima para tener 120 años

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("submit");
    // Validar cada campo individualmente
    const firstNameValidation = validate(
      firstNameRef.current.value,
      "firstName"
    );
    const lastNameValidation = validate(lastNameRef.current.value, "lastName");
    const emailValidation = validate(emailRef.current.value, "email");
    console.log(firstNameValidation);
    console.log(lastNameValidation);
    console.log(emailValidation);

    // Verificar si alguna validación falló
    if (
      firstNameValidation !== "" ||
      lastNameValidation !== "" ||
      emailValidation !== ""
    ) {
      // Mostrar la alerta si algún campo no pasa la validación
      showAlertMessage("error", "Please fill in all fields correctly.");
      return;
    }

    if (type === "create") {
      if (
        firstNameRef.current.value.length < 2 ||
        lastNameRef.current.value.length < 2
      ) {
        showAlertMessage("error", "Please more than two letters");
        setAllFieldsFilled(false);
        return;
      } else {
        setAllFieldsFilled(true);
      }
      if (
        firstNameRef.current.value === "" ||
        lastNameRef.current.value === "" ||
        emailRef.current.value === "" ||
        passwordRef.current.value === "" ||
        confirmPassword === "" ||
        birthdayRef.current.value === "" ||
        roleRef.current.value === ""
      ) {
        console.log("estoy aaa");
        showAlertMessage("error", "Please fill in all required fields.");
        setAllFieldsFilled(false);
        return;
      }
      if (passwordRef.current.value !== confirmPassword) {
        // Compara las contraseñas
        showAlertMessage("error", "The passwords do not match.");
        return;
      }
      let user = {
        firstName: firstNameRef.current.value,
        lastName: lastNameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value,
        birthday: birthdayRef.current.value,
        role: roleRef.current.value,
      };

      user = { ...user, password: passwordRef.current.value };
      // const docRef = await addDoc(refCreate, user);
      const api = new Api();
      const result = await api.post("users/register", user);
      const message = result.data.message;
      const data = result.data.data;
      const token = result.data.token;
      if (message === "User created successfully" && token) {
        localStorage.setItem("user_logged", token);
        localStorage.setItem("user_data_logged", JSON.stringify(data));
        showAlertMessage("success", "User created successfully.");
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 2000);
      }
      // const useDocRef =result.data.data._id;
      //   localStorage.setItem("user_logged", (useDocRef));
      //   showAlertMessage("success", "User created successfully.");
      //   setTimeout(() => {
      //    navigate("/dashboard", { replace: true });
      //  }, 2000);
      // }
    }
    if (type === "update") {
      const userUpdate = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        birthday: user.birthday,
        role: user.role,
      };

      try {
        const api = new Api();
        let result = null;
        let message = null;
        if (userId) {
          result = await api.patch(
            `users/update-profile/${userId}`,
            userUpdate
          );
          message = result.data.message;
          if (message === "user updated") {
            showAlertMessage("success", "Profile updated successfully.");
            setTimeout(() => {
              navigate("/users", { replace: true });
            }, 2000);
          }
        } else {
          result = await api.patch(`users/update-profile/`, userUpdate);
          console.log(result);
          localStorage.setItem(
            "user_data_logged",
            JSON.stringify(result.data.data)
          );
          message = result.data.message;
          if (message === "user updated") {
            showAlertMessage("success", "Profile updated successfully.");
            setTimeout(() => {
              navigate("/profile", { replace: true });
            }, 2000);
          }
        }
      } catch (error) {
        console.error("Error updating user:", error);
      }
    }
  };

  let nameButton = "Create";

  if (type === "update") {
    nameButton = "Update";
  }
  if (type === "create") {
    nameButton = "Sign Up";
  }

  const getUserData = async () => {
    if (type === "view") {
      const userLoggedData = JSON.parse(
        localStorage.getItem("user_data_logged")
      );
      console.log("this is " + userLoggedData);
      if (userLoggedData) {
        setUser(userLoggedData);
        setUserLoaded(true);
      } else {
        console.log(
          "No hay datos de usuario logueado en el almacenamiento local"
        );
      }
    } else {
      try {
        const api = new Api();

        if (userId == null) {
          const result = JSON.parse(localStorage.getItem("user_data_logged"));
          setUser(result);
          setUserLoaded(true);
        } else {
          const result = await api.get(`users/${userId}`);
          console.log("estoy aqui", result);

          const dataUser = result.data.data;
          const message = result.data.status;
          if (message === "success") {
            setUser(dataUser);
            setUserLoaded(true);
          } else {
            console.log("No se pudieron obtener los datos del usuario");
          }
        }
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      }
    }
  };

  const processData = async () => {
    if (type === "view" || type === "update") {
      await getUserData();
    } else {
      setUserLoaded(true);
    }
  };
  useEffect(() => {
    processData();
  }, []);

  //validation sign up
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleFirstNameChange = (event) => {
    setFirstNameError(validate(event.target.value, "firstName"));
    setUser((prevState) => ({
      ...prevState,
      firstName: event.target.value,
    }));
  };

  const handleLastNameChange = (event) => {
    setLastNameError(validate(event.target.value, "lastName"));
    setUser((prevState) => ({
      ...prevState,
      lastName: event.target.value,
    }));
  };

  const handleEmailChange = (event) => {
    setEmailError(validate(event.target.value, "email"));
    setUser((prevState) => ({
      ...prevState,
      email: event.target.value,
    }));
  };

  const handlePasswordChange = (event) => {
    setPasswordError(validate(event.target.value, "password"));
    setUser((prevState) => ({
      ...prevState,
      password: event.target.value,
    }));
  };
  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const validate = (value, type) => {
    if (type === "firstName") {
      if (!/^[a-zA-Z\s]+$/.test(value)) {
        return "First name must be a string without numbers at least two letters.";
      }
    }

    if (type === "lastName") {
      if (!/^[a-zA-Z\s]+$/.test(value)) {
        return "Last name must be a string without numbers at least two letters.";
      }
    }

    if (type === "email") {
      if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value)) {
        return "Email must be a valid email address.";
      }
    }

    if (type === "password") {
      if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(value)) {
        return "Password must have at least one number, one lowercase letter, one uppercase letter, and be at least 6 characters long.";
      }
      if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(value)) {
        return "Password must have at least one special character.";
      }
    }

    return "";
  };
  return (
    <>
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{
          marginTop: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "white/30", // Fondo transparente
          color: "white", // Texto blanco
          padding: 4, // Agregar padding si es necesario
          borderRadius: 1,
        }}
        className="backdrop-blur-sm bg-white/30 rounded-lg"
      >
        {showAlert && (
          <Stack sx={{ width: "100%" }} spacing={2} mb={2}>
            <Alert severity={alertSeverity} onClose={() => setShowAlert(false)}>
              {alertMessage}
            </Alert>
          </Stack>
        )}
        {userLoaded ? (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  disabled={type === "view"}
                  autoComplete="given-name"
                  defaultValue={user.firstName}
                  name="firstName"
                  className="text-white"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  inputRef={firstNameRef}
                  error={firstNameError !== ""}
                  helperText={firstNameError}
                  onChange={handleFirstNameChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  disabled={type === "view"}
                  defaultValue={user.lastName}
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  inputRef={lastNameRef}
                  error={lastNameError !== ""}
                  helperText={lastNameError}
                  onChange={handleLastNameChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  disabled={type === "view"}
                  required
                  defaultValue={user.email}
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  inputRef={emailRef}
                  type="email"
                  error={emailError !== ""}
                  helperText={emailError}
                  onChange={handleEmailChange}
                />
              </Grid>
              <Grid item xs={12}>
                {type === "create" && (
                  <TextField
                    disabled={type === "view"}
                    defaultValue={user.password}
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    autoComplete="new-password"
                    inputRef={passwordRef}
                    error={passwordError !== ""}
                    helperText={passwordError}
                    onChange={handlePasswordChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handlePasswordToggle}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              </Grid>
              {type === "create" && (
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    inputRef={confirmPasswordRef}
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange} // Utiliza la función para manejar el cambio en la confirmación de contraseña
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handlePasswordToggle}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                {/* <p className="text-blue-500">Birthday</p> */}
                <TextField
                  required
                  fullWidth
                  disabled={type === "view"}
                  defaultValue={
                    user.birthday
                      ? new Date(user.birthday).toISOString().slice(0, 10)
                      : ""
                  }
                  name="birthday"
                  inputProps={{ min: maxBirthDate, max: minBirthDate }}
                  label={type === "update" || "create" ? null : "Birthday"}
                  type={type === "view" ? "text" : "date"}
                  id="birthday"
                  autoComplete="birthday"
                  inputRef={birthdayRef}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Role</InputLabel>
                  <Select
                    required
                    disabled={type === "view"}
                    labelId="role"
                    id="role"
                    // value={userType}
                    label="role"
                    // onChange={handleChange}
                    inputRef={roleRef}
                    value={user.role}
                    onChange={(e) => setUser({ ...user, role: e.target.value })}
                  >
                    <MenuItem value={"landlord"}>Landlord</MenuItem>
                    <MenuItem value={"renter"}>Renter</MenuItem>
                    {(type === "update" || type === "view") && (
                      <MenuItem value={"admin"}>Admin</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            {type !== "view" && (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {nameButton}
              </Button>
            )}
            <Grid container justifyContent="flex-end">
              <Grid item>
                {type === "create" && (
                  <Link className="text-[#afceec]" href="/" variant="body2">
                    Already have an account? Sign in
                  </Link>
                )}
              </Grid>
            </Grid>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </Box>
    </>
  );
}
