import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";

interface FooterProps {
  year: number;
}

const Footer: React.FC<FooterProps> = ({ year }) => {
  return (
    <Box
      sx={{
        background:
        "linear-gradient(112.1deg, rgb(32, 38, 57) 11.4%, rgb(63, 76, 119) 70.2%)",
        color: "white",
        padding: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="body1" sx={{ mb: { xs: 2, md: 0 } }}>
          Designed and Developed by Durgesh Kumar
        </Typography>
        <Typography variant="body1" sx={{ mb: { xs: 2, md: 0 } }}>
          Copyright © {year} Dk
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <IconButton
            component="a"
            href="https://github.com/Durgesh2008/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: "white" }}
          >
            <GitHubIcon />
          </IconButton>
          <IconButton
            component="a"
            href="https://www.linkedin.com/in/durgesh-kumar-203a47275/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: "white" }}
          >
            <LinkedInIcon />
          </IconButton>
          <IconButton
            component="a"
            href="https://portfoliodurgesh2000.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: "white" }}
          >
            <InfoRoundedIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
