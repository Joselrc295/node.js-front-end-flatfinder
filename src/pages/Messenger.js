import Messages from "../components/Messages";
import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';


export default function Messenger(){
    return (
        <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Box className="lg:pt-32" sx={{ 
              backgroundColor: '#1976d2', 
              color: 'white', 
              p: 2, 
              display: 'flex', 
              alignItems: 'center'
            }}>
              <ChatIcon sx={{ fontSize: 32, mr: 2 }} />
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                Messenger
              </Typography>
            </Box>
            <Box sx={{ height: 'calc(100vh - 200px)', p: 2 }}>
              <Messages />
            </Box>
          </Paper>
        </Container>
      </Box>
    );
}