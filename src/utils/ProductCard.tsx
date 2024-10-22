import * as React from "react";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  IconButton,
  Modal,
  Box,
  Rating,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import UpdateProduct from "../components/Admin/manageProduct/UpdateProduct";
import { useDeleteProduct } from "../Hook/product/useProduct";
import { IProduct } from "../Hook/product/Iproduct";

interface ProductCardProps {
  product: IProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [open, setOpen] = React.useState(false);
  const [isUpdateClick, setIsUpdateClick] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const {
    mutate: deleteP,
    isError: isDeleteError,
    error: deleteError,
  } = useDeleteProduct();
  const handleUpdateClick = () => {
    setIsUpdateClick(true);
    handleOpen();
  };

  const handleDelete = () => {
    if (product._id) {
      deleteP(product._id);
    }
  };

  if (isDeleteError) {
    return (
      <Alert severity="error">Failed to load product: {deleteError.msg}</Alert>
    );
  }
  return (
    <>
      <Card
        sx={{
          width: "100%",
          maxWidth: { xs: 300, sm: 350, md: 400 },
          height: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxShadow: 3,
          borderRadius: 4,
          position: "relative",
          color: "white",
          overflow: "hidden",
          cursor: "pointer",
          transition: "transform 0.2s",
          "&:hover": {
            transform: "scale(1.05)",
          },
        }}
      >
        <Box
          sx={{ height: { xs: 200, sm: 250, md: 300 }, position: "relative" }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 2,
              right: 0,
              background: "linear-gradient(315deg, #2234ae 0%, #191714 74%)",
              padding: "5px 10px",
              borderRadius: "8px",
              fontWeight: "bold",
              zIndex: 1,
            }}
          >
            ${product.price}
          </Box>
          <CardMedia
            component="img"
            image={product.image}
            alt={product.name}
            sx={{
              height: "100%",
              width: "100%",
              objectFit: "cover",
              backgroundColor: "#f0f0f0",
            }}
          />
        </Box>

        <CardContent
          sx={{
            flexGrow: 1,
            background: "linear-gradient(147deg, #4d4855 0%, #000000 74%)",
            padding: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "semibold" }}>
            {product.name}
          </Typography>

          <Typography variant="body2" sx={{ marginBottom: 1 }}>
            {product.description}
          </Typography>

          <Rating
            name="half-rating-read"
            defaultValue={2.5}
            value={product.rating}
            size="small"
            precision={0.5}
            readOnly
            icon={<StarIcon style={{ color: "#007FFF" }} />}
            emptyIcon={<StarBorderIcon style={{ color: "#fff" }} />}
          />

          <CardActions
            sx={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: "16px",
            }}
          >
            <Button
              variant="outlined"
              size="small"
              color="secondary"
              startIcon={<EditIcon />}
              onClick={handleUpdateClick}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(0, 123, 255, 0.1)",
                },
              }}
            >
              Edit
            </Button>

            <IconButton
              aria-label="delete"
              color="error"
              onClick={handleDelete}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(255, 0, 0, 0.1)",
                },
              }}
            >
              <DeleteIcon />
            </IconButton>
          </CardActions>

        
     
        </CardContent>
      </Card>

      {/* Modal for Update Product */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <>{isUpdateClick && <UpdateProduct p={product!} />}</>
      </Modal>
    </>
  );
};

export default ProductCard;
