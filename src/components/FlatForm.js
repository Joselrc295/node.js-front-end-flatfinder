import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Switch,
  TextField,
  Typography,
  Alert,
  Grid,
  FormControlLabel,
  CircularProgress
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Api from "../services/api";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});


export default function FlatForm({ type, id,setOwnerId}) {
  const [showAlert, setShowAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [flatLoaded, setFlatLoaded] = useState(false);
  const currentDate = new Date().toJSON().slice(0, 10);
  const [selectedFile, setSelectedFile] = useState(null);
  const [flat, setFlat] = useState({
    city: "",
    streetName: "",
    streetNumber: "",
    areaSize: "",
    hasAc: false,
    yearBuilt: "",
    rentPrice: "",
    dateAvailable: currentDate,
    ownerID : "",

  });

  const navigate = useNavigate();
  const api = new Api();
  const city = useRef("");
  const streetName = useRef("");
  const streetNumber = useRef("");
  const areaSize = useRef("");
  const hasAc = useRef(false);
  const yearBuilt = useRef("");
  const rentPrice = useRef("");
  const dateAvailable = useRef("");
  const user = localStorage.getItem("user_logged");

  const showAlertMessage = (severity, message) => {
    setAlertSeverity(severity);
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 4000);
  };

  const capitalizeFirstLetter = (word) => {
    if (!word) {
      return "";
    }
    const firstLetter = word.charAt(0).toUpperCase();
    const restOfWord = word.slice(1).toLowerCase();
    return firstLetter + restOfWord;
  };

  const validateCity = () => {
    const validate = /^[a-zA-Z\s]+$/;
    if (city.current.value.length < 2 || !validate.test(city.current.value)) {
      showAlertMessage("error", "Please fill correctly the city field, only with letters");
      return false;
    }
    return true;
  };

  const validateStreet = () => {
    const validate = /^[a-zA-Z0-9\s]+$/; 
    if (streetName.current.value.length < 2 || !validate.test(streetName.current.value)) {
      showAlertMessage("error", "Please fill correctly the street field, only with letters and numbers");
      return false;
    }
    return true;
};

  const validateForm = () => {
    if (!validateCity()) return false;
    if (!validateStreet()) return false;
    if (yearBuilt.current.value >= 2024 || yearBuilt.current.value <= 1900) {
      showAlertMessage("error", "Please enter a valid year built (between 1900 and 2023)");
      return false;
    }
    if (!city.current.value || !streetName.current.value || !streetNumber.current.value || !areaSize.current.value || !rentPrice.current.value || !dateAvailable.current.value) {
      showAlertMessage("error", "All fields must be filled out correctly");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    let formData  = new FormData()
      formData.append('city', city.current.value.trim())
      formData.append('streetName', streetName.current.value)
      formData.append('streetNumber', streetNumber.current.value)
      formData.append('areaSize', parseInt(areaSize.current.value))
      formData.append('hasAc', hasAc.current.checked)
      formData.append('yearBuilt', yearBuilt.current.value)
      formData.append('rentPrice', parseInt(rentPrice.current.value))
      formData.append('dateAvailable', dateAvailable.current.value)
      formData.append('image', selectedFile)
    
    ;

    try {
      if (type === "update") {
        await api.patch(`flats/${id}`, formData);
        showAlertMessage("success", "Flat updated successfully.");
      } else if (type === "create") {
        await api.post("flats", formData);
        showAlertMessage("success", "Flat created successfully.");
      }
      setTimeout(() => {
        navigate("/my-flats", { replace: true });
      }, 2000);
    } catch (error) {
      showAlertMessage("error", "An error occurred while submitting the flat.");
    }
  };
  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file)
  };

  const getFlatData = async () => {
    try {
      const result = await api.get(`flats/${id}`);
      setFlat(result.data.data);
      setFlatLoaded(true);
      setOwnerId(result.data.data.ownerID);
    } catch (error) {
      showAlertMessage("error", "Failed to load flat data.");
    }
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
        maxWidth: "800px",
        margin: "2.5% auto",
        padding: "24px",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      }}
    >
      {flatLoaded ? (
        <>
          {type === "create" && (
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontWeight: "bold",
                color: "#333",
                marginBottom: "24px",
                textAlign: "center",
              }}
            >
              Create Your Flat
            </Typography>
          )}
          {type !== 'create' &&
              <img className="w-[80%] mb-[2.5%] mx-[10%]" src={
                flat.image
                  ? `http://localhost:3001${flat.image.replace(/\\/g, "/")}`
                  : "/path/to/default-avatar.jpg"
               }  alt=""/>
          }
          {showAlert && (
            <Alert severity={alertSeverity} sx={{ marginBottom: "24px" }}>
              {alertMessage}
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
                    inputRef={hasAc}
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
                defaultValue={flat.dateAvailable
                  ? new Date(flat.dateAvailable).toISOString().slice(0, 10)
                  : ""}
                
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
          {type !== "view" && 
          <Grid  className="mx-[38%] mt-[20px]">
              <Button
              
              color="secondary"
              component="label"
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              {selectedFile && <p>File selected: {selectedFile.name}</p>}
              <VisuallyHiddenInput id='image' type="file" accept="image/*" onChange={handleFileChange} />
            </Button>
          </Grid>
          }
          {type !== "view" && (
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              fullWidth
              sx={{ marginTop: "24px" }}
            >
              Submit
            </Button>
          
          )}
        </>
      ) : (
        <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
      )}
    </Box>
  );
}
