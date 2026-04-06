import React from "react";
import { Card, CardContent, Typography, Chip } from "@mui/material";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import CategoryBadge from './CategoryBadge'; // ← make sure this path is correct

export default function ProductCard({ product }) {

    const getCategoryColor = (category) => {
    const colors = {
      "Cats":       "purple",
      "Dogs":       "warning",     
      "Fish":       "info",        
      "Bird":       "success",     
      "Cat Food":   "purple",
      "Dog Food":   "warning",
      "Fish Food":  "info",
      "Bird Food":  "success",
      "Health":     "error",
      "Grooming":   "secondary",
      "Toys":       "warning",
      "Accessories":"default",
      "Cat Litter": "default",
    };
    return colors[category] || "default";
  };

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3, p: 2, backgroundColor: "#E3F2FD", height: "100%" }}>
      <CardContent>
        <ShoppingBagIcon sx={{ color: "#1976D2", fontSize: 35 }} />
        
        <Typography variant="h6" sx={{ mt: 1, fontWeight: "bold" }}>
          {product.name}
        </Typography>

        <Typography variant="body1" sx={{ color: "#1565C0", fontWeight: "bold" }}>
          {product.price} MAD
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Stock: {product.stock_quantity || product.stock}
        </Typography>

        <Chip
          label={
            <>
              {product.category.includes("Cat") && "Cat "}
              {product.category.includes("Dog") && "Dog "}
              {product.category.includes("Fish") && "Fish "}
              {product.category.includes("Bird") && "Bird "}
              {product.category}
            </>
          }
          size="small"
          color={getCategoryColor(product.category)}
          sx={{ 
            mt: 1.5, 
            fontWeight: "bold",
            height: 28
          }}
        />
      </CardContent>
    </Card>
  );
}