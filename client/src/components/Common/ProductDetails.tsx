import {
  Box,
  Typography,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  Avatar,
  Rating,
  CircularProgress,
  Grid2,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import MessageIcon from "@mui/icons-material/Message";
import { startTransition, useEffect, useState } from "react";
import { useFilterProduct } from "../../Hook/product/useProduct";
import { useNavigate, useParams } from "react-router-dom";
import { IProduct } from "../../Hook/product/Iproduct";
import Header from "./Header/Header";
import { useGetCategory } from "../../Hook/category/useCategory";
import {
  useAddCart,
  useDeleteCart,
  useGetCarts,
} from "../../Hook/cart/useCart";
import { useAuth } from "../../context/AuthContext";

import ReviewList from "./Review/ReviewList";
import Footer from "./Footer";

export default function ProductDetails() {
  const { id, cid } = useParams();
  const [pid, setPid] = useState(id);
  const { data: filteredProducts } = useFilterProduct(cid!);
  const [product, setProduct] = useState<IProduct | null>(null);
  const [like, setLike] = useState(false);
  const { data } = useGetCategory(cid!);
  const { user } = useAuth();
  const { data: carts } = useGetCarts(!!user);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      if (user.role.toLowerCase() === "admin") {
        startTransition(() => {
         
          navigate("/admin/dashboard");
        });
      }
    }
  }, []);

  const {
    mutate: addCart,
    status: isAdding,
  } = useAddCart();
  const { mutate: deleteCart, status: isRemoving } = useDeleteCart();
  function isProductInCart(): boolean {
    if (product && carts?.cartEntries) {
      return carts.cartEntries.some(
        (entry) => entry.product._id === product._id
      );
    }
    return false;
  }
  useEffect(() => {
    if (filteredProducts) {
      const p = filteredProducts?.products.find((item) => item._id === pid);
      if (p) {
        setProduct(p);
      }
    }
  }, [filteredProducts, pid]);

  const handleCilck = (id: string) => {
    setPid(id);
  };
  const handleAddToCart = () => {
    if (product && product._id) {
      addCart({ product: product._id });
    }
  };

  const handleRemoveFromCart = () => {
    if (product && product._id) {
      deleteCart(product?._id);
    }
  };

  return (
    <>
      <Header />
      <div
        style={{
          padding: "24px 16px",
          background: "linear-gradient(315deg, #2234ae 0%, #191714 74%)",
          borderRadius: "12px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          color: "white",
        }}
      >
        <Grid2
          container
          spacing={2}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
          }}
        >
          {/* Product Image */}
          <Grid2 size={{xs:12,sm:6,md:4}}>
            <Box
              component="img"
              sx={{
                width: "80%",
                objectFit: "contain",
                padding: 2,
              }}
              alt={product?.name || "ecommerce product"}
              src={product?.image || "/default-image.jpg"} 
              loading="lazy"
            />
          </Grid2>

          {/* Product Details */}
          <Grid2 size={{xs:12,sm:6,md:4}}>
            <Box>
              <Typography variant="overline" display="block" gutterBottom>
                {data?.data.name || "Category"}
              </Typography>
              <Typography variant="h4" gutterBottom>
                {product?.name || "Product Name"}
              </Typography>

              {/* Rating Section */}
              <Box display="flex" alignItems="center" mb={2}>
                <Rating value={Math.round(product?.rating || 0)} readOnly />
                <Box ml={3} display="flex" alignItems="center">
                  <IconButton>
                    <FacebookIcon color="primary" />
                  </IconButton>
                  <IconButton>
                    <TwitterIcon color="primary" />
                  </IconButton>
                  <IconButton>
                    <MessageIcon color="primary" />
                  </IconButton>
                </Box>
              </Box>

              <Typography variant="body1" paragraph>
                {product?.description || "Product description goes here..."}
              </Typography>

              {/* Color and Size Section */}
              <Box display="flex" alignItems="center" mb={2}>
                <Typography variant="body1" mr={3}>
                  Color
                </Typography>
                <Box display="flex">
                  <Avatar sx={{ bgcolor: "grey.300", width: 24, height: 24 }} />
                  <Avatar
                    sx={{ bgcolor: "grey.700", width: 24, height: 24, ml: 1 }}
                  />
                  <Avatar
                    sx={{ bgcolor: "red.500", width: 24, height: 24, ml: 1 }}
                  />
                </Box>
              </Box>

              <Box display="flex" alignItems="center" mb={2}>
                <Typography variant="body1" mr={3}>
                  Size
                </Typography>
                <FormControl color="secondary" variant="outlined" size="small">
                  <Select defaultValue="M">
                    <MenuItem value="SM">SM</MenuItem>
                    <MenuItem value="M">M</MenuItem>
                    <MenuItem value="L">L</MenuItem>
                    <MenuItem value="XL">XL</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {product && product.quantity! <= 0 ? (
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
                      {isProductInCart() ? (
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
                            <CircularProgress
                              size={20}
                              sx={{ color: "white" }}
                            />
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
                            <CircularProgress
                              size={20}
                              sx={{ color: "white" }}
                            />
                          ) : (
                            "Add to Cart"
                          )}
                        </Button>
                      )}
                    </Box>
                  )}
                </>
              )}

              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="h5" fontWeight="bold">
                  ${product?.price || "0.00"}
                </Typography>

                {/* Like Button */}
                <IconButton onClick={() => setLike(!like)}>
                  {like ? (
                    <FavoriteIcon color="error" />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </IconButton>
              </Box>
            </Box>
          </Grid2>
        </Grid2>

        {/* Related Products */}
        <Box mt={5}>
          <Typography variant="h6" gutterBottom>
            Related Products
          </Typography>
          <Grid2 container spacing={2}>
            {filteredProducts?.products
              .filter((ele) => ele._id !== pid)
              .map((product) => {
                return (
                  <Grid2  key={product._id} size={{xs:12,sm:6,md:4}}>
                    <Box
                      sx={{
                        border: "1px solid grey",
                        padding: 2,
                        borderRadius: 2,
                        textAlign: "center",
                        cursor: "pointer",
                        "&:hover": {
                          boxShadow: 4,
                        },
                      }}
                      onClick={() => handleCilck(product._id!)}
                    >
                      <Typography variant="body1">{product.name}</Typography>
                      <Typography variant="body2">${product.price}</Typography>
                    </Box>
                  </Grid2>
                );
              })}
          </Grid2>
        </Box>
        {
          product?._id && <ReviewList pid={product?._id!} />
        }
        
        <Footer year={new Date().getFullYear()} />
      </div>
    </>
  );
}
