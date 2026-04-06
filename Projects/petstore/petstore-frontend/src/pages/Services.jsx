import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Button,
  Container,
} from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";

export default function Services() {
  const [loading, setLoading] = useState(true);

  const petConfig = {
    dog: { emoji: "🐕", color: "#FF9800", bgColor: "#FFF3E0" },
    cat: { emoji: "🐱", color: "#9C27B0", bgColor: "#F3E5F5" },
    bird: { emoji: "🦜", color: "#4CAF50", bgColor: "#E8F5E9" },
    fish: { emoji: "🐠", color: "#2196F3", bgColor: "#E3F2FD" },
  };

  // Service categories with images for showcase
  const serviceShowcase = [
    {
      title: "Pet Grooming",
      description: "Professional fur trimming, brushing, and styling for dogs and cats",
      image: "/images/services/grooming.webp",
      color: "#FF9800",
      petTypes: "Dogs & Cats",
    },
    {
      title: "Pet Washing & Bathing",
      description: "Gentle washing and drying services to keep your pet clean and fresh",
      image: "/images/services/groomingwashing.jpg",
      color: "#2196F3",
      petTypes: "Dogs & Cats",
    },
    {
      title: "Nail Trimming",
      description: "Safe and careful nail clipping for dogs and cats",
      image: "/images/services/dogcatnailtrimmer.png",
      color: "#9C27B0",
      petTypes: "Dogs & Cats",
    },
    {
      title: "Aquarium Cleaning",
      description: "Complete tank maintenance, water treatment, and algae removal",
      image: "/images/services/aquariumcleaning.png",
      color: "#00BCD4",
      petTypes: "Fish",
    },
    {
      title: "Bird Feather Care",
      description: "Gentle feather trimming and wing care for your feathered friends",
      image: "/images/services/feathertrimming.jpeg",
      color: "#4CAF50",
      petTypes: "Birds",
    },
    {
      title: "Cage Cleaning",
      description: "Thorough cage sanitization and maintenance for birds and small pets",
      image: "/images/services/cagecleaning.jpg",
      color: "#607D8B",
      petTypes: "Birds & Small Pets",
    },
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7f8" }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #4ABDAC 0%, #2E8B7B 100%)",
          color: "white",
          py: 8,
          px: 3,
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <PetsIcon sx={{ fontSize: 60, mb: 2, opacity: 0.9 }} />
          <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
            Our Pet Services
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600, mx: "auto" }}>
            Professional care for all your beloved pets. From grooming to health services,
            we've got everything your furry, feathered, or finned friends need.
          </Typography>
        </Container>
      </Box>

      {/* Service Showcase Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", textAlign: "center", mb: 1, color: "#333" }}
        >
          What We Offer
        </Typography>
        <Typography
          variant="body1"
          sx={{ textAlign: "center", mb: 5, color: "#666" }}
        >
          Explore our range of professional pet care services
        </Typography>

        <Grid container spacing={3}>
          {serviceShowcase.map((service, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={service.image}
                    alt={service.title}
                    sx={{ objectFit: "cover" }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "50%",
                      background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
                    }}
                  />
                  <Chip
                    label={service.petTypes}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      bgcolor: "rgba(255,255,255,0.9)",
                      fontWeight: "bold",
                      fontSize: "0.7rem",
                    }}
                  />
                </Box>
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", mb: 1, color: service.color }}
                  >
                    {service.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {service.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>



      {/* Call to Action */}
      <Box
        sx={{
          bgcolor: "#4ABDAC",
          color: "white",
          py: 6,
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
            Ready to Book a Service?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
            Give your pet the care they deserve. Book an appointment today!
          </Typography>
          <Button
            variant="contained"
            size="large"
            href="/bookings"
            sx={{
              bgcolor: "white",
              color: "#4ABDAC",
              px: 4,
              py: 1.5,
              fontWeight: "bold",
              "&:hover": { bgcolor: "#f5f5f5" },
            }}
          >
            Book Now
          </Button>
        </Container>
      </Box>

    </Box>
  );
}