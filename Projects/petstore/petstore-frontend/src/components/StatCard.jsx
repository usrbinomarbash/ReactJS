import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

export default function StatCard({ title, count, color }) {
  return (
    <Card sx={{ borderRadius: 3, textAlign: "center", backgroundColor: color, color: "white" }}>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>{count}</Typography>
      </CardContent>
    </Card>
  );
}
