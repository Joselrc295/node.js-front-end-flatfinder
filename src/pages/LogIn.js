import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"; // Importa Firebase Auth
import Api from "../services/api";
import flatsImage from "../Imagenes/flats2.jpeg";

// Definición del componente Copyright
function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Flat Finder
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function LogIn() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();
  const [isProgress, setIsProgress] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("user_logged");
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const showAlertMessage = (severity, message) => {
    setAlertSeverity(severity);
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 2000); // Mostrar alerta durante 2 segundos
  };

  const login = async (e) => {
    e.preventDefault();
    setIsProgress(true);

    const api = new Api();

    try {
      const email = emailRef.current.value;
      const password = passwordRef.current.value;

      const result = await api.post("users/login", { email, password });

      if (result.data.status === "success") {
        console.log("login successful");
        showAlertMessage("success", "Login successful");
        localStorage.setItem("user_logged", result.data.token);
        localStorage.setItem("user_data_logged", JSON.stringify(result.data.data));
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 2000); // Redirigir al dashboard después de 2 segundos
      } else {
        console.log("login failed");
        showAlertMessage("error", "Incorrect email or password");
      }
    } catch (error) {
      console.log(error);
      showAlertMessage("error", error.response?.data?.message || "An error occurred during login");
    } finally {
      setIsProgress(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Aquí llamarías a tu backend para registrar/validar el usuario
      const api = new Api();
      const response = await api.post("users/google-login", {
        email: user.email,
        firstName: user.displayName.split(" ")[0],
        lastName: user.displayName.split(" ")[1] || "",
        avatar: user.photoURL
      });

      if (response.data.status === "success") {
        console.log("login successful");
        showAlertMessage("success", "Login successful");
        localStorage.setItem("user_logged", response.data.token);
        localStorage.setItem("user_data_logged", JSON.stringify(response.data.data));
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 2000);
      } else {
        console.log("login failed");
        showAlertMessage("error", "Google sign-in failed");
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      showAlertMessage("error", "An error occurred during Google sign-in");
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${flatsImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "white/30", // Fondo transparente
              padding: 4, // Agregar padding si es necesario
              borderRadius: 1,
            }}
          >
            <Avatar sx={{ m: 1 }} className="bg-gradient-to-r from-[#1f0e42] to-[#7946d0]">
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Flat Finder
            </Typography>
            <Box
              component="form"
              onSubmit={login}
              noValidate
              sx={{ mt: 1 }}
              className="backdrop-blur-sm bg-white/30 rounded-lg p-7"
            >
              {showAlert && (
                <Stack sx={{ width: "100%" }} spacing={2} mb={2}>
                  <Alert severity={alertSeverity} onClose={() => setShowAlert(false)}>
                    {alertMessage}
                  </Alert>
                </Stack>
              )}
              <TextField
                type="email"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                inputRef={emailRef}
              />
              <TextField
                type="password"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                id="password"
                autoComplete="current-password"
                inputRef={passwordRef}
              />
              <Grid container>
                <Grid item>
                  <Link className="text-[#fbfdff]" href="/forgot-password" variant="body2">
                    {"Forgot your password?"}
                  </Link>
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isProgress}
                className="bg-gradient-to-r from-[#1f0e42] to-[#7946d0]"
              >
                Log In
              </Button>
              <button
                className="signin"
                onClick={handleGoogleSignIn}
              >
                <svg
                  viewBox="0 0 256 262"
                  preserveAspectRatio="xMidYMid"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                    fill="#4285F4"
                  ></path>
                  <path
                    d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                    fill="#34A853"
                  ></path>
                  <path
                    d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                    fill="#FBBC05"
                  ></path>
                  <path
                    d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                    fill="#EB4335"
                  ></path>
                </svg>
                Sign in with Google
              </button>
              <Grid container>
                <Grid item>
                  <Link className="text-[#fbfdff]" href="/sign-up" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
      </ThemeProvider>
    </div>
  );
}
