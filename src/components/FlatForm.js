import Box from "@mui/material/Box";
import { Button, Switch, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from '@mui/material/Alert'
import Api from "../services/api";
import {  
  Grid, 
  FormControlLabel, 
  CircularProgress,  
} from '@mui/material';


export default function FlatForm({ type, id}) {
  const [alertSeverity, setAlertSeverity] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const showAlertMessage = (severity, message) => {
    setAlertSeverity(severity);
    setAlertMessage(message);
    setShowAlert(true);
  };
  const api = new Api()
  console.log(id)
  const [flatLoaded, setFlatLoaded] = useState(false);
  const currentDate = new Date().toJSON().slice(0, 10);
  const [flat, setFlat] = useState({
    city: "",
    streetName: "",
    streetNumber: "",
    areaSize: "",
    hasAc: false,
    yearBuilt: "",
    rentPrice: "",
    dateAvailable: currentDate,
  });


  const navigate = useNavigate();
  const date = new Date().toJSON().slice(0, 10);
  const city = useRef("");
  const streetName = useRef("");
  const streetNumber = useRef("");
  const areaSize = useRef("");
  const hasAC = useRef(false);
  const yearBuilt = useRef("");
  const rentPrice = useRef("");
  const dateAvailable = useRef("");
  let refFlat = null;
 
  const user =(localStorage.getItem("user_logged"));
  
 
 
  const capitalizeFirstLetter = (word) =>{
    if (!word){
      return ''
    }
    const firstLetter = word.charAt(0).toUpperCase();
    const restOfWord = word.slice(1).toLowerCase();
    return firstLetter + restOfWord;
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    


    const onlyLetters = () => {
      if (
        city.current.value.length < 2 ||
        streetName.current.value < 2 ||
        streetName.current.value < 2
      ) {
        return false;
      } else {
        return true;
      }
    };
    

    const forCity = () => {
      const validate = /^[a-zA-Z\s]+$/; // updated regular expression
      if (
        validate.test(city.current.value)
      ) {
        return true;
      } else {
        return false;
      }
    };
    const forStreet = () => {
      const validate = /^[a-zA-Z\s.,'0-9]+$/; // updated regular expression
      if (
        validate.test(streetName.current.value)
      ) {
        return true;
      } else {
        return false;
      }
    };


    const onlyNumbers = () => {
      const validate = /^[0-9]+$/;
      if (
        validate.test(areaSize.current.value) &&
        validate.test(rentPrice.current.value) &&
        validate.test(yearBuilt.current.value)
      ) {
        return true;
      } else {
        return false;
      }
    };
    
    let flatForSubmit = {
      city: city.current.value.trim(),
      streetName: streetName.current.value,
      streetNumber: streetNumber.current.value,
      areaSize: parseInt(areaSize.current.value),
      hasAC: hasAC.current.checked,
      yearBuilt: yearBuilt.current.value,
      rentPrice: parseInt(rentPrice.current.value),
      dateAvailable: dateAvailable.current.value,
      user:(localStorage.getItem("user_logged")),
    }
    
    console.log(onlyLetters(),forCity() ,forStreet(), onlyNumbers(),  yearBuilt.current.value);
    if (
      onlyLetters() &&
      forCity() &&
      forStreet()&&
      onlyNumbers() &&
      yearBuilt.current.value < 2024 &&
      yearBuilt.current.value > 1900 &&
      city.current.value &&
      streetName.current.value &&
      streetNumber.current.value &&
      areaSize.current.value &&
      rentPrice.current.value &&
      dateAvailable.current.value 
    ) {
      if(type === 'update'){
        const  result = await api.patch(`flats/${id}`,  flatForSubmit)
      }
      if(type === 'create'){ 
        
      const result =   await api.post("flats" ,flatForSubmit);}
      setShowAlert(true);
      setTimeout(() => {
        navigate("/my-flats", { replace: false });
      }, 2000);
    } else {
      alert("You need to fill correctly the information");
    }
  };
  const getFlatData = async () => {
  let responseFlat = []
  const result = await api.get(`flats/${id}`)
  responseFlat = result.data.data
  setFlat(responseFlat);
  setFlatLoaded(true);
};
  const processData = async () => {
    if (type === "update" || type === "view") {
      await getFlatData();
    } else {
      setFlatLoaded(true);
    }
    
  };

  useEffect(() => {
    processData();
  }, []);

  return (
    <Box
      onSubmit={handleSubmit}
      component="form"
      sx={{
        maxWidth: '800px',
        margin: '2.5% auto',
        padding: '24px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      }}
    >
      {flatLoaded ? (
        <>
          {type === "create" && (
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontWeight: 'bold',
                color: '#333',
                marginBottom: '24px',
                textAlign: 'center',
              }}
            >
              Create Your Flat
            </Typography>
          )}
          {showAlert && (
            <Alert severity="success" sx={{ marginBottom: '24px' }}>
              You have created a new flat.
            </Alert>
          )}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                disabled={type === "view"}
                label="City"
                value={flat.city}
                inputRef={city}
                variant="outlined"
                fullWidth
                onChange={(e) => {
                  const inputValue = e.target.value;
                  const capitalized = capitalizeFirstLetter(inputValue);
                  setFlat({ ...flat, city: capitalized });
                }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                disabled={type === "view"}
                label="Street name"
                defaultValue={flat.streetName}
                inputRef={streetName}
                variant="outlined"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                disabled={type === "view"}
                label="Street number"
                defaultValue={flat.streetNumber}
                inputRef={streetNumber}
                variant="outlined"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                disabled={type === "view"}
                label="Area size"
                type="number"
                defaultValue={flat.areaSize}
                inputRef={areaSize}
                variant="outlined"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    disabled={type === "view"}
                    defaultChecked={flat.hasAc}
                    inputRef={hasAC}
                  />
                }
                label="Has AC"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                defaultValue={flat.yearBuilt}
                disabled={type === "view"}
                label="Year built"
                type="string"
                inputRef={yearBuilt}
                variant="outlined"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                defaultValue={flat.rentPrice}
                disabled={type === "view"}
                label="Rent price"
                type="number"
                inputRef={rentPrice}
                variant="outlined"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                disabled={type === "view"}
                defaultValue={flat.dateAvailable}
                type="date"
                label="Date available"
                inputRef={dateAvailable}
                variant="outlined"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
          {type !== "view" && (
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: '24px' }}
            >
              Submit
            </Button>
          )}
        </>
      ) : (
        <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />
      )}
    </Box>
  );
}
