import React, { startTransition } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Rating,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { IProduct } from "../../Hook/product/Iproduct";
import { useAuth } from "../../context/AuthContext";
import { useAddCart, useDeleteCart } from "../../Hook/cart/useCart";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
interface ProductCardProps {
  product: IProduct;
  cartTracker?: { [key: string]: string } | undefined;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, cartTracker }) => {
  const { user } = useAuth();
  const {
    mutate: deleteCart,
    status: isRemoving,
    isError,
    error,
  } = useDeleteCart();
  const {
    mutate: addCart,
    status: isAdding,
    isError: isAddErr,
    error: AddErr,
  } = useAddCart();
  const navigate = useNavigate();

  function getWords(sentence: string, numWords: number): string {
    const words = sentence.split(" ");
    return words.slice(0, numWords).join(" ");
  }

  const handleAddToCart = () => {
    if (!user) {
      startTransition(() => {

        navigate("/login");
      });
      return;
    }
    addCart({ product: product._id });
  };

  const handleRemoveFromCart = () => {
    if (cartTracker && product && cartTracker[product._id!]) {
      const cartId = cartTracker[product._id!];
      deleteCart(cartId);
    }
  };

  return (
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
      }}
    >
      <Box sx={{ height: { xs: 200, sm: 250, md: 300 }, position: "relative" }}>
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
        <Link to={`/product/${product._id}/${product.category}`}>
          <CardMedia
            component="img"
            image={product.image}
            alt={product.name}
            sx={{
              height: "100%",
              width: "100%",
              objectFit: "contain",
              backgroundColor: "#f0f0f0",
            }}
          />
        </Link>
      </Box>

      <CardContent
        sx={{
          flexGrow: 1,
          background: "linear-gradient(147deg, #4d4855 0%, #000000 74%)",
          padding: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "semibold" }}>
          {getWords(product.name || "", 3)}
        </Typography>

        <Typography variant="body2" sx={{ marginBottom: 1 }}>
          {getWords(product.description || "", 20)}
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

        {/* Error handling */}
        {isError && (
          <Alert severity="error">
            Failed to load product: {error && error.msg}
          </Alert>
        )}
        {isAddErr && (
          <Alert severity="error">
            Failed to add product: {AddErr?.msg || ""}
          </Alert>
        )}
        {product.quantity && product.quantity <= 0 ? (
          <Typography sx={{ color: "red" }}>Out of stock</Typography>
        ) : (
          <>
            {user?.role.toLowerCase() !== "admin" && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 2,
                }}
              >
                {cartTracker && product && cartTracker[product._id!] ? (
                  <Button
                    size="small"
                    onClick={handleRemoveFromCart}
                    sx={{
                      width: "45%",
                      backgroundColor: "red",
                      color: "white",
                      borderRadius: "5%",
                      position: "relative",
                    }}
                    disabled={isRemoving === "pending"} // Disable button while removing
                  >
                    {isRemoving === "pending" ? (
                      <CircularProgress size={20} sx={{ color: "white" }} />
                    ) : (
                      "Remove to Cart"
                    )}
                  </Button>
                ) : (
                  <Button
                    size="small"
                    onClick={handleAddToCart}
                    sx={{
                      width: "45%",
                      backgroundColor: "blue",
                      color: "white",
                      borderRadius: "5%",
                      position: "relative",
                    }}
                    disabled={isAdding === "pending"}
                  >
                    {isAdding === "pending" ? (
                      <CircularProgress size={20} sx={{ color: "white" }} />
                    ) : (
                      "Add to Cart"
                    )}
                  </Button>
                )}
              </Box>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;
