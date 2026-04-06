// CustomerTable.jsx
import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
} from "@mui/material";

export default function CustomerTable({ customers }) {
  return (
    <Paper sx={{ p: 2, borderRadius: 3 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        👥 Customer List
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Full Name</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Address</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {customers.map((c) => (
            <TableRow key={c.customer_id}>
              <TableCell>{c.full_name}</TableCell>
              <TableCell>{c.phone}</TableCell>
              <TableCell>{c.address}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
