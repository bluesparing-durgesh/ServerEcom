import React, { startTransition, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Alert,
  Grid,
  IconButton,
  TextField,
  Grid2,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { ICart } from "../../../Hook/cart/ICart";
import { useDeleteCart, useUpdateCart } from "../../../Hook/cart/useCart";
import { Add, Remove, Delete } from "@mui/icons-material";
import { CheckoutProps, OrderItem } from "../../../types";
import { addCartInWeb } from "../../../utils/CartHandler";
interface CartPageProps {
  iCarts: ICart[] | undefined;
}

const CartPage: React.FC<CartPageProps> = ({ iCarts }) => {
  const navigate = useNavigate();
  const { mutate: deleteCart, isError, error } = useDeleteCart();
  const { mutate: editCart } = useUpdateCart();
  const [originalPrice, setOriginalPrice] = useState(0);

  const handleRemoveFromCart = (cartId: string) => {
    deleteCart(cartId);
  };

  const handleCheckout = (total: number) => {
    if (iCarts) {
      const orderdata = iCarts.map((ele) => {
        const { quantity, product } = ele;
        const order: OrderItem = {
          name: product.name!,
          product: product._id!,
          image: product.image!,
          quantity,
          price: product.price!,
        };
        return order;
      });
      const data: CheckoutProps = {
        order: orderdata,
        totalPrice: total,
      };
      addCartInWeb(data);
      startTransition(() => {
   
        navigate("/checkout");
      });
    }
  };

  const calculateOriginalPrice = () => {
    let result = iCarts?.reduce((total, ele) => {
      return total + ele.quantity * ele.product.price!;
    }, 0);
    return result || 0;
  };

  useEffect(() => {
    setOriginalPrice(calculateOriginalPrice());
  }, [iCarts]);

  const discountCalculator = (val: number) => {
    return originalPrice * (val / 100);
  };

  const savingPrice = () => {
    if (originalPrice > 800 && originalPrice <= 1000) {
      return discountCalculator(5);
    } else if (originalPrice > 1000 && originalPrice <= 5000) {
      return discountCalculator(8);
    } else if (originalPrice > 5000) {
      return discountCalculator(10);
    }
    return 0;
  };
  const storePickup = originalPrice > 500 ? 0 : 49;

  const total = originalPrice + storePickup - Math.floor(savingPrice());

  const handleDecrement = (q: number, id: string) => {
    if (q === 1) {
      deleteCart(id);
    } else {
      q--;
      editCart({ id, q });
    }
  };

  const handleIncrement = (q: number, id: string) => {
    q++;
    editCart({ id, q });
  };

  return (
    <Box
      sx={{
        padding: 3,
        background:
          "linear-gradient(112.1deg, rgb(32, 38, 57) 11.4%, rgb(63, 76, 119) 70.2%)",
        minHeight: "70vh",
        color: "white",
      }}
    >
      <Typography
        variant="h4"
        component="h2"
        sx={{ mb: 2, textAlign: "center" }}
      >
        Shopping Cart
      </Typography>

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load cart: {error?.msg || ""}
        </Alert>
      )}

      {iCarts?.length === 0 ? (
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          Your cart is empty.
        </Typography>
      ) : (
        <Grid2 container spacing={2}>
          <Grid2
            size={{ xs: 12, md: 8 }}
            className="hide-scrollbar"
            sx={{ height: "74vh", overflow: "auto" }}
          >
            {iCarts?.map((cartItem) => {
              const p = cartItem.product;
              return (
                <Grid2  size={{ xs: 12, md: 8 }} key={cartItem._id}>
                  <Card
                    variant="outlined"
                    sx={{
                      mb: 1,
                      background:
                        "linear-gradient(112.1deg, rgb(32, 38, 57) 11.4%, rgb(63, 76, 119) 70.2%)",
                      boxShadow: 3,
                      color: "#fff",
                    }}
                  >
                    <Grid2 container spacing={2} sx={{ padding: 2 }}>
                      <Grid2  size={{xs:2,md:4}} >
                        <CardMedia
                          component="img"
                          image={p.image}
                          alt="Product Image"
                          sx={{ height: 120, objectFit: "contain" }}
                        />
                      </Grid2>
                      <Grid2 size={{xs:10,md:8}}>
                        <CardContent>
                          <Typography variant="h6" component="div">
                            {p.name}
                          </Typography>
                          <Typography variant="body1" sx={{ color: "Window" }}>
                            Price: ${p.price}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              mt: 1,
                            }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <IconButton
                                onClick={() =>
                                  handleRemoveFromCart(cartItem._id)
                                }
                              >
                                <Delete color="error" />
                              </IconButton>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <IconButton
                                onClick={() =>
                                  handleDecrement(
                                    cartItem.quantity,
                                    cartItem._id
                                  )
                                }
                              >
                                <Remove sx={{ color: "white" }} />
                              </IconButton>
                              <TextField
                                variant="outlined"
                                size="small"
                                value={cartItem.quantity}
                                sx={{
                                  width: 40,
                                  textAlign: "center",
                                  backgroundColor: "#fff",
                                }}
                                InputProps={{ readOnly: true }}
                              />
                              <IconButton
                                onClick={() =>
                                  handleIncrement(
                                    cartItem.quantity,
                                    cartItem._id
                                  )
                                }
                              >
                                <Add sx={{ color: "white" }} />
                              </IconButton>
                            </Box>
                            <Typography
                              variant="body1"
                              color="text.primary"
                              sx={{ fontWeight: "bold", color: "wheat" }}
                            >
                              ${(p.price! * cartItem.quantity).toFixed(2)}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Grid2>
                    </Grid2>
                  </Card>
                </Grid2>
              );
            })}
            <Link to="/">
            <Button
            variant="outlined"
            color="warning"
            sx={{my:2}}
            >
            Countinue Shopping
            </Button>
            </Link>
          </Grid2>
          <Grid2
            size={{ xs: 12, md: 4 }}
            sx={{
              padding: 2,
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                mt: 4,
                boxShadow: 3,
                padding: 2,
                borderRadius: 2,
              }}
            >
              <Typography variant="h5" component="div" sx={{ mb: 2 }}>
                Order Summary
              </Typography>
              <Typography variant="body1">
                Original Price: ${originalPrice.toFixed(2)}
              </Typography>
              <Typography variant="body1">
                Saving: ${Math.floor(savingPrice())}
              </Typography>
              <Typography variant="body1">
                Delivery Charge: {storePickup > 0 ? storePickup : "Free"}
              </Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Total: ${total.toFixed(2)}
              </Typography>
            </Box>
            <Button
        variant="contained"
        sx={{
          marginTop: 3,
          boxShadow: 3,
          background:
            "linear-gradient(112.1deg, rgb(32, 38, 57) 11.4%, rgb(63, 76, 119) 70.2%)",
          width: "100%",
        }}
        onClick={() => handleCheckout(total)}
      >
        Proceed to Checkout
      </Button>
          </Grid2>
        </Grid2>
      )}

     
    </Box>
  );
};

export default CartPage;
