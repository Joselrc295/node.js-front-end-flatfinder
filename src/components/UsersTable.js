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
import { collection } from "firebase/firestore";
import { db } from "../Firebase";
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
     if(valueSlider){
      if (filter){
        filter+='&'
      }
      filter+= `filter[ageMin]=${valueSlider[0]}&filter[ageMax]=${valueSlider[1]}`
     }
    const api = new Api();
    const result = await api.get('users/?'+filter)
    setUsers(result.data.data)
  //   try {
  //     const result = await api.get("users");
  //     console.log(result);
  //     setUsers(result.data.data);

  //   } catch (error) {
  //     console.error("Error fetching data: ", error);
  //   }
}

  useEffect(() => {
    getData();
  }, [userType, flatsCounter, valueSlider]);

  return (  
    <div>
    <div  className="flex justify-center">
    <Box
     border={0}
      textAlign={"center"}
      className="p-4 rounded-2xl my-3 shadow-md"
      component={"form"}
     
    >
      <TextField
        select
        label={"User Type"}
        variant="outlined"
        SelectProps={{ native: true }}
        value={userType}
        onChange={(e) => setUserType(e.target.value)}
        className="my-4 mx-4 "
      >
        <option key={"none"} value={""}></option>
        <option key={"100-200"} value={"admin"}>
          Admin
        </option>
        <option key={"200-300"} value={"landlord"}>
          Landlord
        </option>
        <option key={"300-400"} value={"renter"}>
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
        className="my-4"
      >
        <option key={"none"} value={""}></option>
        <option key={"100-200"} value={"0-5"}>
          0-5
        </option>
        <option key={"200-300"} value={"6-10"}>
          6-10
        </option>
        <option key={"300-400"} value={"11-30"}>
          11-30
        </option>
        <option key={"400-500"} value={"30-61"}>
          30 - 61
        </option>
        <option key={"61-max"} value={"61-999999"}>
          61+
        </option>
      </TextField>

      <div className="w-56 my-6 mx-auto">
        <Typography id="input-slider" gutterBottom>
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
            className="flex-grow"
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
              <TableCell style={{ cursor: "pointer" }}/* onClick={nameSort}*/ className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              &lt; First Name&gt;
              </TableCell>
              <TableCell
              style={{ cursor: "pointer" }}
                //onClick={lastNameSort}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                align="right"
              >
               &lt; Last Name&gt;
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
                //onClick={flatSort}
                
              >
               &lt; Flats Count&gt;
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
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  {row.firstName}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  {row.lastName}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  {row.email}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  {row.birthday}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  {row.role}
                </TableCell>

                <TableCell className="px-6 py-4 whitespace-nowrap">
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
