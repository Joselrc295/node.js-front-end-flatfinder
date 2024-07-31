import { useState } from "react";
import { useEffect } from "react";
import {IconButton} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility';
import Api from "../services/api";
import EditIcon from '@mui/icons-material/Edit';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import DeleteIcon from '@mui/icons-material/Delete';
import Grid from '@mui/material/Grid'






const FlatCards = ({type , user}) =>{
    const api = new Api()
    const [flag, setFlag] = useState(false);
    const [orderBy, setOrderBy] = useState("firstName");
    const [order, setOrder] = useState(1);
    const [flats, setFlats] = useState([]);
    const [city, setCity] = useState("");
    const [rentPrice, setRentPrice] = useState(0);
    const [areaSize, setAreaSize] = useState(0);
    const [favorite , setFavorite] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);


    const getData = async () =>{
      if (type === "favorite-flats") {
        let allFlats = [] ;
        const response = await api.get('favorites') ;
        const dataFavorites =  response.data.data
        dataFavorites.forEach((element)=>{
            allFlats.push(element.flatID)
        })
       
        setFlats(allFlats);
      }
      if (type === "my-flats") {
        let allFlats = []
        let filter = `filter[status]=${true}`
        const response = await api.get('flats/my/?' + filter)
        console.log(response)
        allFlats = response.data.data
        setFlats(allFlats);
      }
      if (type === "all-flats") {
          let allFlats = [] ;
          let filter = `page=${currentPage}&limit=6&filter[status]=${true}`
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
        filter += `&orderBy=${orderBy}&order=${order}`
          const response = await api.get('flats/?' + filter);
            allFlats = response.data.data
            let count = response.data.totalPages
            console.log(count)
            const responseFavorites = await api.get('favorites/home') ;
            const dataFavorites =  responseFavorites.data.data;
            setTotalPages(count);
            setFavorite(dataFavorites)
            
            
      
          setFlats(allFlats);
          }
    }
    const capitalizeFirstLetter = (word) =>{
      if (!word){
        return ''
      }
      const firstLetter = word.charAt(0).toUpperCase();
      const restOfWord = word.slice(1).toLowerCase();
      return firstLetter + restOfWord;
    }
    
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
    const handlePageChange = (event, value) => {
      setCurrentPage(value);
    };
    useEffect(() => {
        getData();
      },[flag, city, areaSize,rentPrice, currentPage])

    return(
    <div className="w-[100%]">
    {type === "all-flats" &&
      <Box textAlign={"center"}
          sx={{ width: "60%", marginLeft: "20%", marginTop: "50px", display: 'flex' }}
          component={"form"}
          boxShadow={3}
          p={4}
          borderRadius={4}>
        <TextField
            label="City"
            variant="outlined"
            value={city}
            onChange={(e) =>{
              const inputValue = e.target.value
              const capitalized = capitalizeFirstLetter(inputValue)
              setCity(capitalized)}}
            fullWidth
          />
        <TextField
            select
            label={"Area Size Range"}
            variant="outlined"
            SelectProps={{ native: true }}
            value={areaSize}
            onChange={(e) => setAreaSize(e.target.value)}
            fullWidth
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
    }
    <Grid container spacing={0}>
    {flats.map((row, index)=>{
        const fav = favorite.filter(item => item.flatID == row._id)
        if(fav.length){
            row.favorite = true
        }else{
            row.favorite = false
        }
        console.log(row)
    return(
      <Grid   item xs={12} sm={6} key={row._id}>
        <div className="flex bg-black border border-gray-200 rounded-lg shadow dark:bg-gray-800  dark:border-gray-700 lg:w-[80%] m-[5%] w-[90%] ">
          {type === "favorite-flats" && 
          <button
        className="remove-button"
        onClick={() => removeFavorite(row._id)}
      ><FavoriteIcon sx={{color: "white"}}/>
      </button>
         }
          
          {row.favorite && 
          <button
          className="remove-button"
          onClick={() => removeFavorite(row._id)}
        ><FavoriteIcon sx={{color: "white"}}/>
        </button>
         }
          {type === "all-flats" && !row.favorite &&
          <button
          className="add-button"
          onClick={() => addFavorite(row._id)}
        ><FavoriteBorderIcon sx={{color: "white"}}/>
        </button>
         }
            <img className="rounded-t-lg w-[50%] ml-[-40px]" 
            src={
                row.image
                  ? `http://localhost:3001${row.image.replace(/\\/g, "/")}`
                  : "/path/to/default-avatar.jpg"
              }
            alt="" />
        <div className="w-[50%]">
          <h5 className="mt-[10px] text-center m-0 text-2xl font-bold text-violet-600 dark:text-white">{row.city}</h5>
          <p class="text-center font-normal text-white dark:text-gray-400 truncate">Street: {row.streetName}<br/> Price: {row.rentPrice}<br/> Area size: {row.areaSize} <br/> Street number: {row.streetNumber}</p>
          <p className="text-white mb-0 mx-[2.5%] sm:text-xs sm:mr-[30px] truncate" >Owner: {row.flatCreatorEmail}</p>
          <div className="flex  md:ml-[180px] relative lg:ml-[-8px] sm:ml-[10px]">
          <button
        className="view-button"
        onClick={() =>
          (window.location.href = `flat/${row._id}`)
        }
      ><VisibilityIcon sx={{color: "white"}}/>
      </button>
      { type === 'my-flats' &&
        <button
        className="edit-button"
        onClick={() =>
          (window.location.href = `flat/edit/${row._id}`)
        }
      >
        <svg className="edit-svgIcon" viewBox="0 0 512 512">
          <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
        </svg>
      </button>
      }
      { type === 'all-flats' && user.role === 'admin'&&
        <button
        className="edit-button"
        onClick={() =>
          (window.location.href = `flat/edit/${row._id}`)
        }
      >
        <svg className="edit-svgIcon" viewBox="0 0 512 512">
          <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
        </svg>
      </button>
      }
      { type === 'all-flats' && user.role === 'admin' &&
      <button
      className="Btn"
      onClick={(e) => {
        e.preventDefault();
        removeFlatAdmin(row._id);
      }}
    >
      <div className="sign">
        <svg
          viewBox="0 0 16 16"
          className="bi bi-trash3-fill"
          fill="currentColor"
          height="18"
          width="18"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"></path>
        </svg>
      </div>
      <div className="text">Delete</div>
    </button>
      }
      { type ==='my-flats' &&
       <button
       className="Btn"
       onClick={(e) => {
         e.preventDefault();
         removeFlat(row._id);
       }}
     >
       <div className="sign">
         <svg
           viewBox="0 0 16 16"
           className="bi bi-trash3-fill"
           fill="currentColor"
           height="18"
           width="18"
           xmlns="http://www.w3.org/2000/svg"
         >
           <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"></path>
         </svg>
       </div>
       <div className="text">Delete</div>
     </button>
      }
      </div>
        </div>
    </div>
    </Grid>)
    })}
    </Grid>
    
    <Stack spacing={2} className="my-4 align-middle">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="secondary"
          classes={{
            ul: 'pagination'
          }}
        />
      
      </Stack>
    
    </div>
)
}

export { FlatCards }