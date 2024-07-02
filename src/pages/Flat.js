import {useParams} from "react-router-dom";
import Header from "../components/Header";
import FlatForm from "../components/FlatForm";
import Messages from "../components/Messages";
import { getUserLogged } from "../services/users";
import { useEffect } from "react";
import { Box, Container, Grid, Typography } from '@mui/material';



export default function Flat() {
    let { id }  = useParams();
    console.log(id)
    useEffect(() => {
        const checkUserLogged = async () => {
          const userLogged = await getUserLogged();
          if (!userLogged) {
            window.location.href = "/";
          }
        };
        checkUserLogged();
      }, []);

    
  
return (
  <Box sx={{ minHeight: '100vh', backgroundColor: 'white' }}>
    <Header />
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ 
            fontWeight: 'bold', 
            color: '#1a237e',
            textAlign: 'center',
            mb: 3
          }}>
            View Flat
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ 
            backgroundColor: 'white', 
            borderRadius: 2, 
            boxShadow: 3, 
            p: 3,
            height: '100%'
          }}>
            <FlatForm type={'view'} id={id} />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ 
            backgroundColor: 'white', 
            borderRadius: 2, 
            boxShadow: 3, 
            p: 3,
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>

            <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
              <Messages flatId={id} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  </Box>
);
}