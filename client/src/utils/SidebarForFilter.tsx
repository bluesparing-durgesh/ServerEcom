import * as React from "react";
import {
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Typography,

  Slider,

  Divider,
  Box,
  Drawer,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FilterListIcon from "@mui/icons-material/FilterList";

import Rating from "@mui/material/Rating";
import { IFilterProps } from "./statuses";

const SidebarForFilter: React.FC<IFilterProps> = ({ setSortBy, setRating, setPriceRange, priceRange, sortBy, rating }) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePriceChange = (_: any, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  const handleClearFilters = () => {
    setPriceRange([0, 2000]);
    setRating(0);
    setSortBy("lowToHigh");

  };

  return (
    <React.Fragment>
      <Button
        autoFocus
        variant="outlined"
        size="small"
        color="inherit"
        onClick={handleClickOpen}
        startIcon={<FilterListIcon />}
      >
        Open Filter
      </Button>

      <Drawer anchor="left" open={open} onClose={handleClose}>
        <AppBar sx={{ position: "relative" }}>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>

            <Button autoFocus variant="outlined" size="small" color="inherit" onClick={handleClose}>
              Apply Filters
            </Button>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 3, width: 300 }}>
          {/* Price Slider */}
          <Typography gutterBottom>Price Range</Typography>
          <Slider
            value={priceRange}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            min={0}
            max={2000}
          />
          <Divider sx={{ my: 2 }} />

          <Typography gutterBottom>Rating</Typography>
          <Rating
            name="product-rating"
            value={rating}
            onChange={(_, newValue) => setRating(newValue || 0)}
            precision={1}
          />

          <Divider sx={{ my: 2 }} />
          <Typography sx={{ mb: 2 }} gutterBottom>
            Sort By
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <Button
              size="small"
              variant={sortBy === "lowToHigh" ? "contained" : "outlined"}
              onClick={() => setSortBy("lowToHigh")}
            >
              Low to High
            </Button>
            <Button
              size="small"
              variant={sortBy === "highToLow" ? "contained" : "outlined"}
              onClick={() => setSortBy("highToLow")}
            >
              High to Low
            </Button>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Button
              size="small"
              variant="contained"
              color="error"
              onClick={handleClearFilters}
              sx={{ fontSize: 12 }}
            >
              Clear All Filters
            </Button>
            <Button size="small" variant="contained" color="primary" onClick={handleClose}>
              Show Results
            </Button>
          </Box>
        </Box>
      </Drawer>
    </React.Fragment>
  );
}
export default SidebarForFilter;