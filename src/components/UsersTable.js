import * as React from "react";
import Table from "@mui/material/Table";
import { Box } from "@mui/system";
import TextField from "@mui/material/TextField";
import { Slider, Typography } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Api from "../services/api";

// @Params: type: "my-flats" | "all-flats" | "favorite-flats"
export default function UsersTable() {
  // const ref = collection(db, "users");
  // const refFlats = collection(db, "flats");
  const [userType, setUserType] = useState("");
  const [flatsCounter, setFlatsCounter] = useState("");
  const [valueSlider, setValueSlider] = React.useState([18, 120]);
  const [users, setUsers] = useState([]);
  // const [isAscending, setIsAscending] = useState(true);
  // const [flag , setFlag] = useState(false);
  const [orderBy, setOrderBy] = useState("firstName");
const [order, setOrder] = useState(1);

 

  const removeUser = async (_id) => {
    try {
      const api = new Api();
      const response = await api.delete(`users/delete/${_id}`);
      if (response.status === 200) {
        console.log(response.data.message);    
        getData();
      } else {
        console.error("Error deleting user:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const getData = async () => {
    // let filter = `role=${userType}&flatCountMin=${flatsCounter.split('-')[0]}&flatCountMax=${flatsCounter.split('-')[1]}&ageMin=${valueSlider[0]}&ageMax=${valueSlider[1]}`;
   
    let filter =''
     if (userType) {
      if (filter){
        filter+='&'
      }
      filter = `filter[role]=${userType}`
     }
     if (flatsCounter) {
      if (filter){
        filter+='&'
      }
      filter+= `filter[flatCountMin]=${flatsCounter.split('-')[0]}&filter[flatCountMax]=${flatsCounter.split('-')[1]}`
     }
     if (valueSlider) {
      filter += `filter[ageMin]=${valueSlider[0]}&filter[ageMax]=${valueSlider[1]}&`;
    }
    filter += `orderBy=${orderBy}&order=${order}`;
     try {
      const api = new Api();
      const result = await api.get('users/?' + filter);
      setUsers(result.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }

    
}
const handleSort = (column) => {
  setOrderBy(column);
  setOrder(order === 1 ? -1 : 1);
};


  useEffect(() => {
    getData();
  }, [userType, flatsCounter, valueSlider,orderBy, order]);

  return (  
    <div>
    <div className="flex justify-center my-6">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        className="p-6 rounded-2xl shadow-lg bg-white w-full max-w-5xl"
        component={"form"}
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
          <Typography id="input-slider" gutterBottom className="text-left font-semibold text-gray-700">
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
      <TableContainer>
      <Table
          className="min-w-full divide-gray-200"
          aria-label="simple table"
        >
          <TableHead className="bg-gray-50">
            <TableRow>
              <TableCell style={{ cursor: "pointer" }} onClick={() => handleSort('firstName')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              First Name {orderBy === 'firstName' && (order === 1 ? '▲' : '▼')}
              </TableCell>
              <TableCell
              style={{ cursor: "pointer" }}
              onClick={() => handleSort('lastName')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                align="right"
              >
              Last Name {orderBy === 'lastName' && (order === 1 ? '▲' : '▼')}
              </TableCell>
              <TableCell
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                align="right"
              >
                Email
              </TableCell>
              <TableCell
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                align="right"
              >
                Birth Date
              </TableCell>
              <TableCell
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                align="right"
              >
                Role
              </TableCell>
              <TableCell
              style={{ cursor: "pointer" }}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                align="right"
                onClick={() => handleSort('flatCount')}
                
              >
                Flats Count {orderBy === 'flatCount' && (order === 1 ? '▲' : '▼')}
              </TableCell>
              <TableCell
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                align="right"
              >
                Update info
              </TableCell>
              <TableCell
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                align="right"
              >
                Delete
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="bg-white divide-y divide-gray-200">
            {users.map((row) => (
              <TableRow key={row._id}>
                <TableCell className="truncate px-6 py-4 whitespace-nowrap">
                  {row.firstName}
                </TableCell>
                <TableCell className="truncate px-6 py-4 whitespace-nowrap">
                  {row.lastName}
                </TableCell>
                <TableCell className="truncate px-6 py-4 whitespace-nowrap">
                  {row.email}
                </TableCell>
                <TableCell className="truncate px-6 py-4 whitespace-nowrap">
                  {row.birthday}
                </TableCell>
                <TableCell className="truncate px-6 py-4 whitespace-nowrap">
                  {row.role}
                </TableCell>

                <TableCell className="truncate px-6 py-4 whitespace-nowrap">
                  {row.flatCount}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <Button href={`update-profile/${row._id}`} variant="contained">
                    Edit
                  </Button>
                </TableCell>
               <TableCell className="px-6 py-4 whitespace-nowrap">
               <Button onClick={() => removeUser(row._id)}>Delete</Button>
                </TableCell> 
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
      </TableContainer>
    </div>
  );
}
