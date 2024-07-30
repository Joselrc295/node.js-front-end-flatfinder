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
          let filter = `page=${currentPage}&limit=5&filter[status]=${true}`
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
    {flats.map((row, index)=>{
        const fav = favorite.filter(item => item.flatID == row._id)
        if(fav.length){
            row.favorite = true
        }else{
            row.favorite = false
        }
        console.log(row)
    return(
        <div className="lg:mx-[30%] flex bg-black border border-gray-200 rounded-lg shadow dark:bg-gray-800  dark:border-gray-700 lg:w-[40%] m-[5%] w-[90%] ">
          {type === "favorite-flats" && 
          <IconButton color="secondary" onClick={() => removeFavorite(row._id)} className="h-[10px] m-0 ml-[-10px] relative">
              <FavoriteIcon/>
          </IconButton>
         }
          
          {row.favorite && 
          <IconButton color="secondary" onClick={() => removeFavorite(row._id)} className="h-[10px] m-0 ml-[-10px] relative">
              <FavoriteIcon/>
          </IconButton>
         }
          {type === "all-flats" && !row.favorite &&
          <IconButton color="secondary" onClick={() => addFavorite(row._id)} className="h-[10px] m-0 ml-[-10px] relative">
              <FavoriteBorderIcon/>
          </IconButton>
         }
            <img className="rounded-t-lg w-[50%] ml-[-31px]" 
            src={
                row.image
                  ? `http://localhost:3001${row.image.replace(/\\/g, "/")}`
                  : "/path/to/default-avatar.jpg"
              }
            alt="" />
        <div className="w-[50%]">
        <div className="flex  md:ml-[180px] relative mt-[-10px] lg:ml-[-10.8px] sm:ml-[10px]">
        <IconButton color='secondary'  href={`/flat/${row._id}`}>
            <VisibilityIcon/>
        </IconButton>
      { type === 'my-flats' &&
        <IconButton color='secondary' href={`/flat/edit/${row._id}`}>
            <EditIcon/>
        </IconButton>
      }
      { type === 'all-flats' && user.role === 'admin'&&
        <IconButton color='secondary' href={`/flat/edit/${row._id}`}>
            <EditIcon/>
        </IconButton>
      }
      { type === 'all-flats' && user.role === 'admin' &&
      <IconButton color='secondary' onClick={() => removeFlatAdmin(row._id)}>
          <DeleteIcon/>
      </IconButton>
      }
      { type ==='my-flats' &&
      <IconButton color='secondary' onClick={() => removeFlat(row._id)}>
          <DeleteIcon/>
      </IconButton>
      }
      </div>
          <h5 className="mt-[-10px] text-center m-0 text-2xl font-bold text-violet-600 dark:text-white">{row.city}</h5>
          <p class="text-center font-normal text-white dark:text-gray-400 truncate">Street: {row.streetName}<br/> Price: {row.rentPrice}<br/> Area size: {row.areaSize} <br/> Street number: {row.streetNumber}</p>
          <p className="text-white mb-0 mx-[2.5%] sm:text-xs sm:mr-[30px] truncate" >Owner: {row.flatCreatorEmail}</p>
        </div>
    </div>
    )
    })}
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