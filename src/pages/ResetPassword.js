// src/pages/ResetPassword.js

import React, { useState } from 'react';
import { Box, Button, TextField, Stack, Alert, Container, Typography, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Api from '../services/api';
import { useNavigate } from 'react-router-dom';
import flatsImage from "../Imagenes/flats2.jpeg";

const ResetPassword = () => {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const navigate = useNavigate();

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setAlertSeverity('error');
      setAlertMessage('Passwords do not match');
      setShowAlert(true);
      return;
    }
    try {
      const api = new Api();
      await api.post('users/reset-password', { token, password });
      setAlertSeverity('success');
      setAlertMessage('Password reset successfully');
      setTimeout(() => {
        navigate('/');
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
      }}>
        <Container component="main" maxWidth="xs">
      <Box
      className="backdrop-blur-sm bg-white/30 rounded-lg p-7"
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: "white/30",
        }}
      >
        <Typography component="h1" variant="h5">
          Reset Password
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
              id="token"
              label="Reset Token"
              name="token"
              onChange={(e) => setToken(e.target.value)}
            />
            <TextField
              required
              fullWidth
              name="password"
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)}
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
            <TextField
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            <Button type="submit" fullWidth variant="contained" className="bg-gradient-to-r from-[#1f0e42] to-[#7946d0]">
              Reset Password
            </Button>
          </Stack>
        </Box>
      </Box>
    </Container>
    </div>
  );
};

export default ResetPassword;
