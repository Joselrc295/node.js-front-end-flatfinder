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
import { useRef } from "react";
import { db } from "../Firebase";
import { collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Api from "../services/api";
import flatsImage from "../Imagenes/flats2.jpeg";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Flat finder
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
  const usersRef = collection(db, "users");
  const navigate = useNavigate();
  const [isProgress, setIsProgress] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

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
        localStorage.setItem(
          "user_data_logged",
          JSON.stringify(result.data.data)
        );
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 2000); // Redirigir al dashboard después de 2 segundos
      } else {
        console.log("login failed");
        showAlertMessage("error", "Incorrect email or password");
      }
    } catch (error) {
      console.log(error);
      showAlertMessage(
        "error",
        error.response?.data?.message || "An error occurred during login"
      );
    } finally {
      setIsProgress(false);
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
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
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
                  <Alert
                    severity={alertSeverity}
                    onClose={() => setShowAlert(false)}
                  >
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
              >
                Log In
              </Button>
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
