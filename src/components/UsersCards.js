import * as React from "react";
import { Box } from "@mui/system";
import TextField from "@mui/material/TextField";
import { Slider, Typography } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import Button from "@mui/material/Button";
import Api from "../services/api";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import "../../src/services/style.css"; // Asegúrate de importar tu archivo de estilos

export default function UsersCards() {
  const [userType, setUserType] = useState("");
  const [flatsCounter, setFlatsCounter] = useState("");
  const [valueSlider, setValueSlider] = useState([18, 120]);
  const [users, setUsers] = useState([]);
  const [orderBy, setOrderBy] = useState("firstName");
  const [order, setOrder] = useState(1);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 6;
  const dropdownRefs = useRef([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  const showAlert = (message, severity) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };
  const removeUser = async (_id) => {
    try {
      const api = new Api();
      const response = await api.delete(`users/delete/${_id}`);
      if (response.status === 200) {
        console.log(response.data.message);
        getData();
        showAlert("User deleted successfully", "success");
      } else {
        console.error("Error deleting user:", response.data.message);
        showAlert("Error deleting user", "error");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      showAlert("Error deleting user", "error");
    }
  };

  const getData = async () => {
    let filter = "";
    if (userType) {
      if (filter) {
        filter += "&";
      }
      filter = `filter[role]=${userType}`;
    }
    if (flatsCounter) {
      if (filter) {
        filter += "&";
      }
      filter += `filter[flatCountMin]=${
        flatsCounter.split("-")[0]
      }&filter[flatCountMax]=${flatsCounter.split("-")[1]}`;
    }
    if (valueSlider) {
      filter += "&";
    }
    filter += `filter[ageMin]=${valueSlider[0]}&filter[ageMax]=${valueSlider[1]}&`;

    if (filter) filter += "&";
    filter += `orderBy=${orderBy}&order=${order}`;

    if (filter) filter += "&";
    filter += `page=${page}&limit=${rowsPerPage}`;

    try {
      const api = new Api();
      const result = await api.get("users/?" + filter);
      setUsers(result.data.data);
      setTotalPages(result.data.totalPages);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSort = (column) => {
    setOrderBy(column);
    setOrder(order === 1 ? -1 : 1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    console.log(value)
  };

  useEffect(() => {
    getData();
  }, [userType, flatsCounter, valueSlider, orderBy, order, page]);

  const [dropdownOpen, setDropdownOpen] = useState(null);

  const toggleDropdown = (index) => {
    if (dropdownOpen === index) {
      setDropdownOpen(null);
    } else {
      setDropdownOpen(index);
    }
  };

  const handleClickOutside = (event) => {
    if (
      dropdownRefs.current &&
      !dropdownRefs.current.some((ref) => ref && ref.contains(event.target))
    ) {
      setDropdownOpen(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alertSeverity}
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
      <div className="flex justify-center my-6">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          className=" shadow-lg w-full max-w-5xl backdrop-blur-sm bg-white/30 rounded-lg p-7"
        
          component={"form"}
          sx={{
            marginTop: 8,
            display: "flex",
            alignItems: "center",
            backgroundColor: "white/30", // Fondo transparente
            padding: 4, // Agregar padding si es necesario
            borderRadius: 1,
          }}
        >
          <TextField
            select
            label={"User Type"}
            variant="outlined"
            SelectProps={{ native: true }}
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            className="mx-2 w-1/4"
          >
            <option key={"none"} value={""}></option>
            <option key={"admin"} value={"admin"}>
              Admin
            </option>
            <option key={"landlord"} value={"landlord"}>
              Landlord
            </option>
            <option key={"renter"} value={"renter"}>
              Renter
            </option>
          </TextField>

          <TextField
            select
            label={"Flats Count"}
            variant="outlined"
            SelectProps={{ native: true }}
            value={flatsCounter}
            onChange={(e) => setFlatsCounter(e.target.value)}
            className="mx-2 w-1/4"
          >
            <option key={"none"} value={""}></option>
            <option key={"0-5"} value={"0-5"}>
              0-5
            </option>
            <option key={"6-10"} value={"6-10"}>
              6-10
            </option>
            <option key={"11-30"} value={"11-30"}>
              11-30
            </option>
            <option key={"30-61"} value={"30-61"}>
              30-61
            </option>
            <option key={"61+"} value={"61-999999"}>
              61+
            </option>
          </TextField>

          <div className="w-1/2 mx-2">
            <Typography
              id="input-slider"
              gutterBottom
              className="text-left font-semibold text-gray-700"
            >
              Age
            </Typography>
            <Slider
              max={120}
              min={18}
              step={5}
              value={valueSlider}
              onChange={(e, newValue) => setValueSlider(newValue)}
              getAriaLabel={() => "Age Range"}
              valueLabelDisplay="auto"
              className="mx-4"
            />
          </div>
        </Box>
      </div>
      <div className="mt-40 flex flex-wrap justify-center gap-6">
        {users.map((user, index) => (
          <div key={user._id} className="card">
            <div
              className="avatar-container"
              ref={(el) => (dropdownRefs.current[index] = el)}
            >
              <img
                className="avatar"
                src={
                  user.avatar
                    ? `http://localhost:3001${user.avatar.replace(/\\/g, "/")}`
                    : "/path/to/default-avatar.jpg"
                }
                alt="User Avatar"
              />
            </div>
            <div className="flex flex-col items-center pb-10 w-full">
              <h5 className="heading">
                {user.firstName} {user.lastName}
              </h5>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user.role}
              </p>
              <div className="button-group mt-4">
                <button
                  className="edit-button"
                  onClick={() =>
                    (window.location.href = `update-profile/${user._id}`)
                  }
                >
                  <svg className="edit-svgIcon" viewBox="0 0 512 512">
                    <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                  </svg>
                </button>
                <button
                  className="Btn"
                  onClick={(e) => {
                    e.preventDefault();
                    removeUser(user._id);
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
              </div>
            </div>
          </div>
        ))}
      </div>
      <Stack spacing={2} className="my-4">
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="secondary"
          classes={{
            ul: 'pagination'
          }}
        />
      </Stack>
    </div>
  );
}
