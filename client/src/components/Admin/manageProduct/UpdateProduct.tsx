import React, { startTransition, useEffect, useReducer } from "react";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { useGetCategories } from "../../../Hook/category/useCategory";
import { useUpdateProduct } from "../../../Hook/product/useProduct";
import { IProduct } from "../../../Hook/product/Iproduct";
import { useLocation, useNavigate } from "react-router-dom";
import TableWrapper from "../../../utils/TableWrapper";

const initialState: IProduct = {
  name: "",
  description: "",
  price: 0,
  category: "",
  quantity: 0,
  image: "",
  shipping: false,
  rating: 0,
};

const reducer = (state: IProduct, action: { type: string; payload: any }) => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.payload.field]: action.payload.value };
    case "SET_INITIAL_VALUES":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const UpdateProduct: React.FC = () => {
  const [formState, dispatch] = useReducer(reducer, initialState);
  const loc = useLocation();
  const { p } = loc.state;
  const { data } = useGetCategories();
  const { mutate: updateP, status, error } = useUpdateProduct();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch({ type: "SET_INITIAL_VALUES", payload: p });
  }, [p]);

  const handleChange =
    (field: string) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | { name?: string; value: unknown }
      >
    ) => {
      dispatch({
        type: "SET_FIELD",
        payload: { field, value: event.target.value },
      });
    };

  // Special handleChange for Select component
  const handleSelectChange =
    (field: string) => (event: SelectChangeEvent<string>) => {
      dispatch({
        type: "SET_FIELD",
        payload: { field, value: event.target.value },
      });
    };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    let Pdata = formState;
    updateP({ Pdata });
  };

  useEffect(() => {
    if (status === "success") {
      startTransition(() => {

        navigate(-1);
      });
    }
  }, [status]);
  if (status === "pending") {
    return <CircularProgress />;
  }
  if (status === "error") {
    return <Alert severity="error">Failed to load product: {error.msg}</Alert>;
  }
  return (
    <TableWrapper tableName="Update Product" title="Update Product">
      <Box
        sx={{
          borderRadius: 2,
          backgroundColor: "white",

        }}
      >
        
        <form onSubmit={handleSubmit}>
          <Box display="flex" justifyContent="space-between" gap={2}>
            <TextField
              fullWidth
              label="Product Name"
              variant="outlined"
              margin="normal"
              value={formState.name}
              onChange={handleChange("name")}
              required
              InputProps={{ style: { height: "40px" } }} // Adjust input height
            />
            <TextField
              fullWidth
              label="Image URL"
              variant="outlined"
              margin="normal"
              value={formState.image}
              onChange={handleChange("image")}
              required
              InputProps={{ style: { height: "40px" } }} // Adjust input height
            />
          </Box>

          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            margin="normal"
            value={formState.description}
            onChange={handleChange("description")}
            required
            InputProps={{ style: { height: "40px" } }} // Adjust input height
          />

          <Box display="flex" justifyContent="space-between" gap={2}>
            <TextField
              fullWidth
              label="Price"
              type="number"
              variant="outlined"
              margin="normal"
              value={formState.price}
              onChange={handleChange("price")}
              required
              InputProps={{ style: { height: "40px" } }} // Adjust input height
            />
            <FormControl fullWidth variant="outlined" margin="normal" required>
              <InputLabel>Category</InputLabel>
              <Select
                value={formState.category}
                onChange={handleSelectChange("category")}
                label="Category"
                inputProps={{
                  style: {
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                  }, // Ensure height matches other inputs
                }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 48 * 4.5 + 8, // Limit dropdown height
                      width: 250,
                    },
                  },
                }}
              >
                {data?.categories?.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box display="flex" justifyContent="space-between" gap={2}>
            <TextField
              fullWidth
              label="Quantity"
              type="number"
              variant="outlined"
              margin="normal"
              value={formState.quantity}
              onChange={handleChange("quantity")}
              required
              InputProps={{ style: { height: "40px" } }} // Adjust input height
            />
            <TextField
              fullWidth
              label="Rating"
              type="number"
              variant="outlined"
              margin="normal"
              value={formState.rating}
              onChange={handleChange("rating")}
              required
              InputProps={{ style: { height: "40px" } }} // Adjust input height
            />
          </Box>

          <FormControl fullWidth variant="outlined" margin="normal" required>
            <InputLabel>Shipping</InputLabel>
            <Select
              value={formState.shipping ? "Yes" : "No"}
              onChange={(event) =>
                dispatch({
                  type: "SET_FIELD",
                  payload: {
                    field: "shipping",
                    value: event.target.value === "Yes",
                  },
                })
              }
              inputProps={{
                style: {
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                },
              }} // Ensure height matches other inputs
            >
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </Select>
          </FormControl>

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Update Product
          </Button>
        </form>
      </Box>
  </TableWrapper>
  );
};

export default UpdateProduct;
