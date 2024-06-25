import React from 'react';
import { Table, TableContainer, TableBody, TableRow, TableCell, Paper } from '@mui/material';

const VehicleInfoTable = ({data}) => {
  // Sample data for demonstration

  var count = 0;
  data.forEach(element => {
    element.id = ++count; 
  });
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {data.map((vehicle) => (
            <TableRow key={vehicle.id}>
              <TableCell>{vehicle.category}</TableCell>
              <TableCell>{vehicle.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default VehicleInfoTable;
