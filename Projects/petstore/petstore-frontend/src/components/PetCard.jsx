import React from "react";
import { Card, CardContent, Typography, Avatar } from "@mui/material";

const getPetImage = (pet) => {
  const species = pet?.species?.toLowerCase();
  const breed = pet?.breed?.toLowerCase();

  if (breed?.includes("chihuahua")) return "/images/chihuahua.jpg";
  if (breed?.includes("german")) return "/images/germanShep.webp";

  switch (species) {
    case "cat":
      return "/images/cat.jpg";
    case "bird":
      return "/images/bird.jpg";
    case "fish":
      return "/images/fish.jpg";
    default:
      return "/images/dog.jpg";
  }
};

export default function PetCard({ pet }) {
  return (
    <Card sx={{ borderRadius: 4, boxShadow: 3, p: 2, backgroundColor: "#FFF8E7" }}>
      <CardContent sx={{ textAlign: "center" }}>
        <Avatar
          src={getPetImage(pet)}
          alt={pet.name}
          sx={{
            width: 80,
            height: 80,
            mx: "auto",
            mb: 2,
            border: "3px solid #F7B733",
          }}
        />

        <Typography variant="h6">{pet.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {pet.species} — {pet.breed}
        </Typography>
        <Typography variant="caption">Age: {pet.age}</Typography>
      </CardContent>
    </Card>
  );
}
