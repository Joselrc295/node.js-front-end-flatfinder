import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import { Box } from "@mui/system";
import Button from "@mui/material/Button";
import { useState } from "react";
import { useEffect } from "react";
import Api from "../services/api";

import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "0.1rem",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: "12px 16px",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
    
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const TableFlats = ({ type ,  user, setUser}) => {
  const api = new Api()

  const [flats, setFlats] = useState([]);
  const [city, setCity] = useState("");
  const [rentPrice, setRentPrice] = useState(0);
  const [areaSize, setAreaSize] = useState(0);
  const [flag, setFlag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAscending, setIsAscending] = useState(true);
  const [favorite , setFavorite] = useState([])
  const [debouncedValue, setDebouncedValue] = useState('');
  
  
  const capitalizeFirstLetter = (word) =>{
    if (!word){
      return ''
    }
    const firstLetter = word.charAt(0).toUpperCase();
    const restOfWord = word.slice(1).toLowerCase();
    return firstLetter + restOfWord;
  }
  

  const getData = async () => {
    setLoading(true);

    if (type === "my-flats") {
      let allFlats = []
      let filter = `filter[status]=${true}`
      const response = await api.get('flats/my/?' + filter)
      console.log(response)
      allFlats = response.data.data
      setFlats(allFlats);
    }
    if (type === "favorite-flats") {
      let allFlats = [] ;
      const response = await api.get('favorites') ;
      const dataFavorites =  response.data.data
      dataFavorites.forEach((element)=>{
          allFlats.push(element.flatID)
      })
     
      setFlats(allFlats);
    }
    if (type === "all-flats") {
      let allFlats = [] ;
      let filter = `filter[status]=${true}`
      if(city){
      if(filter){
        filter += '&'
      }
      filter += `filter[city]=${city}`
    }
    if(rentPrice){
      if(filter){
        filter +='&'
      }
      filter+= `filter[rentPriceMin]=${rentPrice.split('-')[0]}&filter[rentPriceMax]=${rentPrice.split('-')[1]}`
      console.log(filter)
    }
    if(areaSize){
      if(filter){
        filter += '&'
      }
      filter+= `filter[areaSizeMin]=${areaSize.split('-')[0]}&filter[areaSizeMax]=${areaSize.split('-')[1]}`
    }
      const response = await api.get('flats/?' + filter);
      allFlats = response.data.data
      console.log(response.data.data)
      const responseFavorites = await api.get('favorites/home') ;
      const dataFavorites =  responseFavorites.data.data;
      setFavorite(dataFavorites)
      
    setFlats(allFlats);
    }
    setLoading(false);
  };
  const addFavorite = async (id) => {
    console.log(id);
    const data = {
      flatID: id,
    };
    await api.post('favorites', data);
    setFlag(!flag);
  };
  const removeFavorite = async (id) => {
    console.log(id)
    await api.delete(`favorites/${id}`)
    
    setFlag(!flag);
  };
  const removeFlatAdmin = async (id) =>{
    await api.delete(`flats/admin/${id}`)
    setFlag(!flag);
  }
  const removeFlat = async (id) =>{
    await api.delete(`flats/${id}`)
    setFlag(!flag);
  }
  
  const handleSort = () =>{
    const sortedData = [...flats]
    sortedData.sort((a , b) =>{
      const  cityA = a.city.toLowerCase()
      const  cityB = b.city.toLowerCase()
      if(isAscending){
        return  cityA.localeCompare(cityB)
      }else{
        return cityB.localeCompare(cityA);
      }
    })
    setFlats(sortedData)
    setIsAscending(!isAscending);
  }

  const handleAreaSort = () =>{
    const sortedData = [...flats]
    sortedData.sort((a , b)=>{
      const areaSizeA = a.areaSize
      const areaSizeB = b.areaSize
      if(isAscending){
        return areaSizeA - areaSizeB
      }else{
        return areaSizeB - areaSizeA
      }
    })
    setFlats(sortedData) ; 
    setIsAscending(!isAscending)
  }

  const handlePriceSort = () =>{
    const sortedData = [...flats]
    sortedData.sort((a , b)=>{
      const priceA = a.rentPrice
      const priceB = b.rentPrice
      if(isAscending){
        return priceA - priceB
      }else{
        return priceB - priceA
      }
    })
    setFlats(sortedData) ; 
    setIsAscending(!isAscending)
  }
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(city);
    }, 500); // 500ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [city]);

  useEffect(() => {
    getData();
  }, [city, areaSize,rentPrice, flag]);


  console.log(flats)

  return (
    <>
      {type === "all-flats" && (
        <Box
          textAlign={"center"}
          sx={{ width: "60%", marginLeft: "20%", marginTop: "50px" }}
          component={"form"}
          boxShadow={3}
          p={4}
          borderRadius={4}
        >
          <TextField
            label="City"
            variant="outlined"
            value={city}
            onChange={(e) =>{
              const inputValue = e.target.value
              const capitalized = capitalizeFirstLetter(inputValue)
              setCity(capitalized)}}
            fullWidth
            sx={{ marginBottom: "20px" }}
          />
          <TextField
            select
            label={"Area Size Range"}
            variant="outlined"
            SelectProps={{ native: true }}
            value={areaSize}
            onChange={(e) => setAreaSize(e.target.value)}
            fullWidth
            sx={{ marginBottom: "20px" }}
          >
            <option key={"none"} value={""}></option>
            <option key={"100-200"} value={"100-200"}>
              {" "}
              100 - 200
            </option>
            <option key={"201-300"} value={"201-300"}>
              {" "}
              201 - 300{" "}
            </option>
            <option key={"301-400"} value={"301-400"}>
              {" "}
              301 - 400{" "}
            </option>
            <option key={"401-500"} value={"401-500"}>
              {" "}
              401 - 500{" "}
            </option>
            <option key={"501-600"} value={"501-600"}>
              {" "}
              501 - 600{" "}
            </option>
            <option key={"601-700"} value={"601-700"}>
              {" "}
              601 - 700{" "}
            </option>
            <option key={"701-800"} value={"701-800"}>
              {" "}
              701 - 800{" "}
            </option>
            <option key={"801-900"} value={"801-900"}>
              {" "}
              801 - 900{" "}
            </option>
            <option key={"901-1000"} value={"901-1000"}>
              {" "}
              901 - 1000{" "}
            </option>
            <option key={"1001-max"} value={"1001-999999"}>
              {" "}
              + 1001{" "}
            </option>
          </TextField>
          <TextField
            select
            label={"Rent Price Range"}
            variant="outlined"
            SelectProps={{ native: true }}
            value={rentPrice}
            onChange={(e) => setRentPrice(e.target.value)}
            fullWidth
            sx={{ marginBottom: "20px" }}
          >
            <option key={"none"} value={""}></option>
            <option key={"100-200"} value={"100-200"}>
              {" "}
              100 - 200
            </option>
            <option key={"201-300"} value={"201-300"}>
              {" "}
              201 - 300{" "}
            </option>
            <option key={"301-400"} value={"301-400"}>
              {" "}
              301 - 400{" "}
            </option>
            <option key={"401-500"} value={"401-500"}>
              {" "}
              401 - 500{" "}
            </option>
            <option key={"501-600"} value={"501-600"}>
              {" "}
              501 - 600{" "}
            </option>
            <option key={"601-700"} value={"601-700"}>
              {" "}
              601 - 700{" "}
            </option>
            <option key={"701-800"} value={"701-800"}>
              {" "}
              701 - 800{" "}
            </option>
            <option key={"801-900"} value={"801-900"}>
              {" "}
              801 - 900{" "}
            </option>
            <option key={"901-1000"} value={"901-1000"}>
              {" "}
              901 - 1000{" "}
            </option>
            <option key={"1001-max"} value={"1001-999999"}>
              {" "}
              + 1001{" "}
            </option>
          </TextField>
        </Box>
      )}{" "}
      <br />
      <br />
      <br />
      {flats.length === 0 && !loading ? ( // Agrega la condición de carga para evitar que la alerta aparezca antes de cargar los datos
        <Alert severity="error" sx={{ margin: "20px auto", width: "60%" }}>
          There is not any match, try again.
        </Alert>
      ) : loading ? ( // Muestra el CircularProgress mientras se cargan los datos
        <div className="flex justify-center content-center">
          <CircularProgress />
        </div>
      ) :(
      <div className="flex justify-center content-center">
        <TableContainer 
        className="flex justify-between"
        sx={{
          width: "90%",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          overflowX: "auto",
          
        }}>

        <Table >
          <TableHead  >
            <TableRow>
            <StyledTableCell align="center">Owner</StyledTableCell>
            <StyledTableCell align="center">Email</StyledTableCell>
              <StyledTableCell style={{ cursor: "pointer" }} onClick={handleSort} align="center"> &lt;City&gt; </StyledTableCell>
              <StyledTableCell align="center">Street</StyledTableCell>
              <StyledTableCell align="center">Street Number</StyledTableCell>
              <StyledTableCell style={{ cursor: "pointer" }} onClick={handleAreaSort} align="center">&lt;Area Size&gt;</StyledTableCell>
              <StyledTableCell align="center">Has AC</StyledTableCell>
              <StyledTableCell align="center">Year Built</StyledTableCell>
              <StyledTableCell style={{ cursor: "pointer" }} onClick={handlePriceSort} align="center">&lt;Rent Price&gt;</StyledTableCell>
              <StyledTableCell align="center">Date Available</StyledTableCell>
              {type==="favorite-flats" && type ==="my-flats" && type !=="favorite-flats" ?(<StyledTableCell align="center">View</StyledTableCell>):(<StyledTableCell align="center">Favorites</StyledTableCell>) }
              {type==="favorite-flats"&& type ==="my-flats" && type !=="favorite-flats"?(<StyledTableCell align="center">Edit</StyledTableCell>):(<StyledTableCell align="center">View</StyledTableCell>) }
              {type === 'my-flats' && <StyledTableCell align="center">Delete</StyledTableCell> }
              {type === 'all-flats' && user.role === 'admin' &&  <StyledTableCell align="center">Delete</StyledTableCell>}
            </TableRow>
          </TableHead>
          <TableBody >
            {flats.map((row, index) => {

              const fav = favorite.filter(item => item.flatID == row._id )
              if(fav.length){
                row.favorite = true
              }else{
                row.favorite = false
              }
              return (
              <StyledTableRow key={index}>
                <StyledTableCell component="th" scope="row">
                {row.flatCreator}
                </StyledTableCell>
                <StyledTableCell component="th" scope="row">
                {row.flatCreatorEmail}
                </StyledTableCell>
                <StyledTableCell  className="truncate max-w-xs" component="th" scope="row">
                  {row.city}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {row.streetName}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {row.streetNumber}
                </StyledTableCell>
                <StyledTableCell align="center">{row.areaSize}</StyledTableCell>
                <StyledTableCell align="center">
                  {row.hasAC ? "Yes" : "No"}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {row.yearBuilt}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {row.rentPrice}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {row.dateAvailable}
                </StyledTableCell>
                {type === "all-flats" && (
                  <StyledTableCell align="center">
                    {!row.favorite && (
                      <Button
                        variant="outlined"
                        onClick={() => addFavorite(row._id)}
                      >
                        Add Favorite
                      </Button>
                    )}
                    {row.favorite && (
                      <Button
                        variant="outlined"
                        onClick={() => removeFavorite(row._id)}
                      >
                        Remove Favorite
                      </Button>
                    )}
                  </StyledTableCell>
                )}
                {type === "favorite-flats" && (
                  <StyledTableCell align="center">
                    {
                      <Button
                        variant="outlined"
                        onClick={() => removeFavorite(row._id)}
                      >
                        Remove Favorite
                      </Button>
                    }
                  </StyledTableCell>
                )}
                <StyledTableCell align="center">
                  <Button variant="contained" href={`/flat/${row._id}`}>
                    View
                  </Button>
                </StyledTableCell>
                  {type === "my-flats" && ( <StyledTableCell>
                    <Button href={`/flat/edit/${row._id}`}>Edit</Button></StyledTableCell>
                  )}
                
                {type === "my-flats" && 
                <StyledTableCell align="center"><Button onClick={() => removeFlat(row._id)}>Delete</Button></StyledTableCell>
                }
                 {type === 'all-flats' && user.role === 'admin' &&  <StyledTableCell align="center"><Button onClick={() => removeFlatAdmin(row._id)}>Delete</Button></StyledTableCell>}
              </StyledTableRow>
            )}
            )}
          </TableBody>
        </Table>
      </TableContainer>
      </div>
      )}
    </>
  );
};

export { TableFlats };
