import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FormRegister from '../components/FormRegister';
import Button from '@mui/material/Button';
import { useNavigate, useParams } from 'react-router-dom';
import ResponsiveAppBar from '../components/Header';
import { getUserLogged } from "../services/users";
import { useEffect } from "react";
import flatsImage from "../Imagenes/flats2.jpeg";

const defaultTheme = createTheme();

export default function Profile() {
    useEffect(() => {
        const checkUserLogged = async () => {
            const userLogged = await getUserLogged();
            if (!userLogged) {
                window.location.href = "/";
            }
        };
        checkUserLogged();
    }, []);

    let { userId } = useParams();
    if (userId === undefined) {
        userId = null;
    }
    const navigate = useNavigate();

    const handleUpdateProfile = () => {
        navigate('/update-profile');
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 1301 }}>
                <ResponsiveAppBar />
            </div>
            <div
                style={{
                    backgroundImage: `url(${flatsImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    flexGrow: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: '64px' // Ajusta este valor según la altura de tu header
                }}
            >
                <ThemeProvider theme={defaultTheme}>
                    <Container component="main" maxWidth="xs">
                        <CssBaseline />
                        <Box
                            sx={{
                                marginTop: 8,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Avatar sx={{ m: 1 }} className="bg-gradient-to-r from-[#1f0e42] to-[#7946d0]">
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Profile
                            </Typography>
                            <FormRegister type={'view'} userId={userId} />
                            <br />
                            <Button className="bg-gradient-to-r from-[#1f0e42] to-[#7946d0]" onClick={handleUpdateProfile} variant="contained">
                                Update Profile
                            </Button>
                        </Box>
                    </Container>
                </ThemeProvider>
            </div>
        </div>
    );
}
