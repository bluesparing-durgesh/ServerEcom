import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useGetCategories } from "../Hook/category/useCategory";
import { SelectedCategoryProps } from "./statuses";
import { ICategory } from "../Hook/category/ICategory";

const CategoryDropDown: React.FC<SelectedCategoryProps> = ({
  selectedCategory,
  setSelectedCategory,
}) => {
  const { data, isLoading, error } = useGetCategories();
  const categories: ICategory[] = data?.categories || [];

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedCategory(event.target.value as string);
  };

  useEffect(() => {
    if (data && data.categories) {
      setSelectedCategory("");
    }
  }, [data]);

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel
          id="category-select-label"
          sx={{ color: "white" }} // White text for the label
        >
          Category
        </InputLabel>
        <Select
          labelId="category-select-label"
          id="category-select"
          value={selectedCategory}
          label="Category"
          onChange={handleChange}
          sx={{
            color: "white", // White text for the selected value
            ".MuiOutlinedInput-notchedOutline": {
              borderColor: "white", // White border
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "white", // White border when focused
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "white", // White border on hover
            },
            ".MuiSvgIcon-root": {
              color: "white", // White color for the dropdown arrow
            },
          }}
        >
          {isLoading ? (
            <MenuItem disabled>Loading...</MenuItem>
          ) : error ? (
            <MenuItem disabled>Error loading categories</MenuItem>
          ) : (
            categories.map((category) => (
              <MenuItem
                key={category._id}
                value={category._id}
                sx={{ color: "blue" }} // White text for dropdown items
              >
                {category.name}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>
    </Box>
  );
};

export default CategoryDropDown;
