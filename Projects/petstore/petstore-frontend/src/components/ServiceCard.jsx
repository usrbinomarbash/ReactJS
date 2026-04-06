import React from "react";
import { Card, CardContent, CardMedia, Typography, Box, Chip } from "@mui/material";
import { AccessTime } from "@mui/icons-material";

export default function ServiceCard({ service, showImage = true }) {
  const petConfig = {
    dog: { emoji: "🐕", color: "#FF9800", bgColor: "#FFF3E0" },
    cat: { emoji: "🐱", color: "#9C27B0", bgColor: "#F3E5F5" },
    bird: { emoji: "🦜", color: "#4CAF50", bgColor: "#E8F5E9" },
    fish: { emoji: "🐠", color: "#2196F3", bgColor: "#E3F2FD" },
  };

  // Get appropriate image for a service based on its name
  const getServiceImage = (serviceName) => {
    const name = serviceName?.toLowerCase() || "";
    if (name.includes("groom") || name.includes("haircut") || name.includes("styling") || name.includes("fur")) {
      return "/images/services/grooming.webp";
    }
    if (name.includes("wash") || name.includes("bath") || name.includes("shower")) {
      return "/images/services/groomingwashing.jpg";
    }
    if (name.includes("nail") || name.includes("claw") || name.includes("paw")) {
      return "/images/services/dogcatnailtrimmer.png";
    }
    if (name.includes("aquarium") || name.includes("tank") || name.includes("fish")) {
      return "/images/services/aquariumcleaning.png";
    }
    if (name.includes("feather") || name.includes("wing") || name.includes("bird")) {
      return "/images/services/feathertrimming.jpeg";
    }
    if (name.includes("cage")) {
      return "/images/services/cagecleaning.jpg";
    }
    return null;
  };

  const petType = service.petType || service.pet_type || "dog";
  const config = petConfig[petType.toLowerCase()] || petConfig.dog;
  const serviceImage = showImage ? getServiceImage(service.name) : null;
  const duration = service.durationMin || service.duration_min;

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 3,
        boxShadow: 3,
        overflow: "hidden",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: 6,
        },
      }}
    >

      {serviceImage ? (
        <CardMedia
          component="img"
          height="160"
          image={serviceImage}
          alt={service.name}
          sx={{ objectFit: "cover" }}
        />
      ) : (
        <Box
          sx={{
            bgcolor: config.bgColor,
            py: 4,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderBottom: `3px solid ${config.color}`,
          }}
        >
          <Typography sx={{ fontSize: 70 }}>{config.emoji}</Typography>
        </Box>
      )}

      <CardContent sx={{ p: 2.5 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
          {service.name}
        </Typography>

        <Chip
          label={petType.charAt(0).toUpperCase() + petType.slice(1)}
          size="small"
          sx={{
            bgcolor: config.bgColor,
            color: config.color,
            fontWeight: "bold",
            mb: 2,
          }}
        />

        {service.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {service.description}
          </Typography>
        )}

        {duration && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <AccessTime sx={{ fontSize: 18, color: "text.secondary" }} />
            <Typography variant="body2" color="text.secondary">
              {duration} minutes
            </Typography>
          </Box>
        )}

        <Typography variant="h5" sx={{ fontWeight: "bold", color: config.color }}>
          {service.price} MAD
        </Typography>
      </CardContent>
    </Card>
  );
}