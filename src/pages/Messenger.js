import Messages from "../components/Messages";
import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';

export default function Messenger() {
  return (
    <Box sx={{ backgroundColor: '#e0e0e0', minHeight: '100vh', py: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Container maxWidth="md">
        <Paper elevation={4} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ 
            backgroundColor: '#1a73e8', 
            color: 'white', 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ChatIcon sx={{ fontSize: 40, mr: 2 }} />
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
              Messenger
            </Typography>
          </Box>
          <Box sx={{ height: 'calc(100vh - 200px)', p: 3, backgroundColor: '#fafafa' }}>
            <Messages />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
