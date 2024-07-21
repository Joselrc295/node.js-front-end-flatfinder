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

export default function FlatForm({ type, id }) {
  const [showAlert, setShowAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
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

    let flatForSubmit = {
      city: city.current.value.trim(),
      streetName: streetName.current.value,
      streetNumber: streetNumber.current.value,
      areaSize: parseInt(areaSize.current.value),
      hasAc: hasAc.current.checked,
      yearBuilt: yearBuilt.current.value,
      rentPrice: parseInt(rentPrice.current.value),
      dateAvailable: dateAvailable.current.value,
      user,
    };

    try {
      if (type === "update") {
        await api.patch(`flats/${id}`, flatForSubmit);
        showAlertMessage("success", "Flat updated successfully.");
      } else if (type === "create") {
        await api.post("flats", flatForSubmit);
        showAlertMessage("success", "Flat created successfully.");
      }
      setTimeout(() => {
        navigate("/my-flats", { replace: true });
      }, 2000);
    } catch (error) {
      showAlertMessage("error", "An error occurred while submitting the flat.");
    }
  };

  const getFlatData = async () => {
    try {
      const result = await api.get(`flats/${id}`);
      setFlat(result.data.data);
      setFlatLoaded(true);
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
          {type !== "view" && (
            <Button
              type="submit"
              variant="contained"
              color="primary"
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
