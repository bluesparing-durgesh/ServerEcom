import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Search as SearchIcon } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Badge, BadgeProps, Grid } from "@mui/material";
import { useAuth } from "../../../context/AuthContext";
import { useGetCartsCount } from "../../../Hook/cart/useCart";
import { useCallback } from "react";
import useDebounce from "../../../Hook/custum/useDebounce";
import { useGetSearchSuggestion } from "../../../Hook/product/useProduct";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "70ch",
      "&:focus": {
        width: "80ch",
      },
    },
  },
}));

const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data } = useGetCartsCount(!!user);
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const debounceVal = useDebounce(searchTerm, 300);
  const {
    data: suggestions,
  } = useGetSearchSuggestion(debounceVal.trim().length > 0 ? debounceVal : "");

  const handleMenu = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  const handleLogOut = useCallback(() => {
    localStorage.clear();
    navigate("/login");
    handleClose();
  }, [navigate, handleClose]);

  return (
    <Box sx={{ flexGrow: 1, position: "sticky", top: 0, zIndex: 10 }}>
      <AppBar
        position="static"
        sx={{ background: "linear-gradient(315deg, #2234ce 0%, #2234ce 74%)" }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Link to="/" style={{ textDecoration: "none" }}>
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

          {/* Search Bar */}
          <Grid
            item
            xs={8}
            sm={6}
            md={6}
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              mx: 2,
            }}
          >
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </Search>
          </Grid>

          {suggestions && debounceVal && (
            <Box
              sx={{
                position: "absolute",
                top: 60,
                left: "20%",
                zIndex: 100,
                background:
                  "linear-gradient(112.1deg, rgb(32, 38, 57) 11.4%, rgb(63, 76, 119) 70.2%)",
                width: "55%",
                height: "50vh",
                px: 2,
                overflow: "auto",
              }}
              className="hide-scrollbar"
            >
              <ul>
                {suggestions.data.map((suggestion) => (
                  <Link
                    to={`/product/${suggestion._id}/${suggestion.category}`}
                    key={suggestion._id}
                    style={{ color: "white", textDecoration: "none" }}
                  >
                    {suggestion.name}
                    <hr/>
                  </Link>
                ))}
              </ul>
            </Box>
          )}

          {/* Cart and Profile */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Link to="/cart">
              <IconButton aria-label="cart" sx={{ mx: 2 }}>
                <StyledBadge badgeContent={data?.count || 0} color="primary">
                  <ShoppingCartIcon />
                </StyledBadge>
              </IconButton>
            </Link>

            <IconButton onClick={handleMenu} sx={{ p: 0 }}>
              <Avatar alt="User Avatar" src="/static/images/avatar/1.jpg" />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleLogOut}>Logout</MenuItem>
              <Link to="/order">
                <MenuItem sx={{ textDecoration: "none", color: "black" }}>
                  Order
                </MenuItem>
              </Link>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));

export default React.memo(Header);
