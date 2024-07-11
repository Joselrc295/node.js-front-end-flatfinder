// src/pages/ForgotPassword.js

import React, { useState } from 'react';
import { Box, Button, TextField, Stack, Alert, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Api from '../services/api';
import flatsImage from "../Imagenes/flats2.jpeg";
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const api = new Api();
      await api.post('users/forgot-password', { email });
      setAlertSeverity('success');
      setAlertMessage('Email sent successfully');
      setTimeout(() => {
        navigate('/reset-password');
      }, 2000);
    } catch (error) {
      setAlertSeverity('error');
      setAlertMessage(error.response?.data?.message || 'Something went wrong');
    } finally {
      setShowAlert(true);
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
        <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: "white/30",
          
        }}
        className="backdrop-blur-sm bg-white/30 rounded-lg p-7"
      >
        <Typography component="h1" variant="h5">
          Forgot Password
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <Stack spacing={2}>
            {showAlert && (
              <Alert severity={alertSeverity} onClose={() => setShowAlert(false)}>
                {alertMessage}
              </Alert>
            )}
            <TextField
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" fullWidth variant="contained" color="primary">
              Send Reset Token
            </Button>
          </Stack>
        </Box>
      </Box>
    </Container>
    </div>
  );
};

export default ForgotPassword;
