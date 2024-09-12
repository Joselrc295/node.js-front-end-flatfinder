import { useState, useEffect } from "react";
import { IconButton, Box, TextField, Stack, Pagination, Grid, Card, CardContent, CardMedia, Typography, CardActions } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import Api from "../services/api";
// import { getUserLogged } from "../services/users";

const FlatCards = ({ type, user }) => {
    const api = new Api();
    const [flag, setFlag] = useState(false);
    const [orderBy, setOrderBy] = useState("firstName");
    const [order, setOrder] = useState(1);
    const [flats, setFlats] = useState([]);
    const [city, setCity] = useState("");
    const [rentPrice, setRentPrice] = useState(0);
    const [areaSize, setAreaSize] = useState(0);
    const [favorite, setFavorite] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 3;

    const getData = async () => {
        let filter = `page=${currentPage}&limit=${rowsPerPage}&filter[status]=true`;
        
        if (city) filter += `&filter[city]=${city}`;
        if (rentPrice) filter += `&filter[rentPriceMin]=${rentPrice.split('-')[0]}&filter[rentPriceMax]=${rentPrice.split('-')[1]}`;
        if (areaSize) filter += `&filter[areaSizeMin]=${areaSize.split('-')[0]}&filter[areaSizeMax]=${areaSize.split('-')[1]}`;
        filter += `&orderBy=${orderBy}&order=${order}`;

        try {
            let allFlats = [];
            if (type === "favorite-flats") {
                const response = await api.get('favorites');
                const dataFavorites = response.data.data;
                dataFavorites.forEach(element => allFlats.push(element.flatID));
                setFlats(allFlats);
            }

            if (type === "my-flats") {
                const response = await api.get('flats/my/?filter[status]=true');
                allFlats = response.data.data;
                setFlats(allFlats);
            }

            if (type === "all-flats") {
                const response = await api.get(`flats/?${filter}`);
                allFlats = response.data.data;
                setTotalPages(response.data.totalPages);
                const responseFavorites = await api.get('favorites/home');
                setFavorite(responseFavorites.data.data);
                setFlats(allFlats);
            }
        } catch (error) {
            console.error("Error fetching flats:", error);
        }
    };

    const capitalizeFirstLetter = word => word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : '';

    const addFavorite = async id => {
        await api.post('favorites', { flatID: id });
        setFlag(!flag);
    };

    const removeFavorite = async id => {
        await api.delete(`favorites/${id}`);
        setFlag(!flag);
    };

    const removeFlatAdmin = async id => {
        await api.delete(`flats/admin/${id}`);
        setFlag(!flag);
    };

    const removeFlat = async id => {
        await api.delete(`flats/${id}`);
        setFlag(!flag);
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    useEffect(() => {
        getData();
    }, [flag, city, areaSize, rentPrice, currentPage]);

    return (
        <div className="w-[100%]">
            {type === "all-flats" && (
                <Box
                    textAlign="center"
                    sx={{ width: "60%", margin: "50px auto", display: 'flex', gap: 2 }}
                    component="form"
                    boxShadow={3}
                    p={4}
                    borderRadius={4}
                    className="backdrop-blur-sm bg-white/30 rounded-lg p-7"
                >
                    <TextField
                        label="City"
                        variant="outlined"
                        value={city}
                        onChange={e => setCity(capitalizeFirstLetter(e.target.value))}
                        fullWidth
                    />
                    <TextField
                        select
                        label="Area Size Range"
                        variant="outlined"
                        SelectProps={{ native: true }}
                        value={areaSize}
                        onChange={e => setAreaSize(e.target.value)}
                        fullWidth
                    >
                        <option value=""></option>
                        {[100, 201, 301, 401, 501, 601, 701, 801, 901, 1001].map(size => (
                            <option key={size} value={`${size}-${size + 99}`}>
                                {size} - {size + 99}
                            </option>
                        ))}
                        <option value="1001-999999">+ 1001</option>
                    </TextField>
                    <TextField
                        select
                        label="Rent Price Range"
                        variant="outlined"
                        SelectProps={{ native: true }}
                        value={rentPrice}
                        onChange={e => setRentPrice(e.target.value)}
                        fullWidth
                    >
                        <option value=""></option>
                        {[100, 201, 301, 401, 501, 601, 701, 801, 901, 1001].map(price => (
                            <option key={price} value={`${price}-${price + 99}`}>
                                {price} - {price + 99}
                            </option>
                        ))}
                        <option value="1001-999999">+ 1001</option>
                    </TextField>
                </Box>
            )}
            <Grid container spacing={3} justifyContent="center">
                {flats.map(row => {
                    const isFavorite = favorite.some(item => item.flatID === row._id);
                    return (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={row._id}>
                            <Card sx={{ maxWidth: 345, m: 'auto', bgcolor: 'background.paper' }}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={row.image ? `http://localhost:3001${row.image.replace(/\\/g, "/")}` : "/path/to/default-avatar.jpg"}
                                    alt={row.city}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div" color="primary">
                                        {row.city}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Street: {row.streetName}<br />
                                        Price: {row.rentPrice}<br />
                                        Area size: {row.areaSize}<br />
                                        Street number: {row.streetNumber}
                                    </Typography>
                                    <Typography variant="caption" display="block" gutterBottom>
                                        Owner: {row.flatCreatorEmail}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    {type === "all-flats" && (
                                        <IconButton onClick={() => isFavorite ? removeFavorite(row._id) : addFavorite(row._id)}>
                                            {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon color="primary" />}
                                        </IconButton>
                                    )}
                                    {type === "favorite-flats" && (
                                        <IconButton onClick={() => removeFavorite(row._id)}>
                                            <FavoriteIcon color="error" />
                                        </IconButton>
                                    )}
                                    <IconButton onClick={() => (window.location.href = `flat/${row._id}`)}>
                                        <VisibilityIcon />
                                    </IconButton>
                                    {(type === 'my-flats' || (type === 'all-flats' && user.role === 'admin')) && (
                                        <IconButton onClick={() => (window.location.href = `flat/edit/${row._id}`)}>
                                            <EditIcon />
                                        </IconButton>
                                    )}
                                    {(type === 'my-flats' || (type === 'all-flats' && user.role === 'admin')) && (
                                        <IconButton onClick={() => removeFlat(row._id)}>
                                            <DeleteIcon color="error" />
                                        </IconButton>
                                    )}
                                </CardActions>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
            <Stack spacing={2} className="my-4 align-middle">
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="secondary"
                />
            </Stack>
        </div>
    );
};

export { FlatCards };
