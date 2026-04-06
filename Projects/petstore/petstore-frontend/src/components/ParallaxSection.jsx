import React from 'react';
import { Parallax }from 'react-parallax';
import {Box, Typography} from "@mui/material";

export default function ParallaxSection({image,title, height="400px"}) {
  return (
    <Parallax bgImage={image} strength={400}>
      <Box
        sx={{
          height,
          display:"flex",
          justifyContent: "center",
          alignItems: "center",
          background: "rgba(0,0,0,0.4)",
          color: "white",
        }}
        >
          <Typography 
          variant="h3"
          sx={
            {
              fontWeight: "bold",
              textShadow: "2px 2px 5px rgba(0,0,0,0.6)",
              textAlign: "center"
            }
          }>
            {title}
          </Typography>
        </Box>
    </Parallax>
  );
}
