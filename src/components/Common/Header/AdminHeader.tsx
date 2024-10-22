import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import Typography from "@mui/material/Typography";

import { Link, useNavigate } from "react-router-dom";

import { useCallback } from "react";
import { Button, IconButton, Tooltip } from "@mui/material";

const AdminHeader = () => {
  const navigate = useNavigate();

  const handleLogOut = useCallback(() => {
    localStorage.clear();
    navigate("/login");
  }, [navigate]);

  return (
    <Box sx={{ flexGrow: 1, position: "sticky", top: 0, zIndex: 10 }}>
      <AppBar
        position="static"
        sx={{ background: "linear-gradient(315deg, #2234ce 0%, #2234ce 74%)" }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Link to="/admin/dashboard" style={{ textDecoration: "none" }}>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                display: { xs: "none", sm: "block", borderRadius: "20px" },
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 50 50"
                width="50"
                height="50"
              >
                <defs>
                  <linearGradient
                    id="grad1"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" />
                    <stop offset="100%" />
                  </linearGradient>
                </defs>
                <circle
                  cx="25"
                  cy="25"
                  r="24"
                  fill="url(#grad1)"
                  stroke="#fff"
                  strokeWidth="1"
                />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  fontFamily="Arial, Helvetica, sans-serif"
                  fontSize="18"
                  fill="white"
                  fontWeight="bold"
                  dy=".3em"
                >
                  DK
                </text>
              </svg>
            </Typography>
          </Link>
<Tooltip title='Logout' arrow>

          <IconButton onClick={handleLogOut}>
            <LogoutOutlinedIcon sx={{color:"white"}} /> 
            
          </IconButton>
</Tooltip>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default React.memo(AdminHeader);
