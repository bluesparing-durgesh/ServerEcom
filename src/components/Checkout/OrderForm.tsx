import React, { startTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  MenuItem,
  Grid,
  Box,
  Typography,
} from "@mui/material";
import { CheckoutProps, IOrderForm, PaymentMethod } from "../../types";
import { useNavigate } from "react-router-dom";
import { addOrderInWeb } from "../../utils/CartHandler";
import { useAddOrder } from "../../Hook/order/useOrder";
import { useDeleteUserCart } from "../../Hook/cart/useCart";
interface IOrderFromProps {
  orderData?: CheckoutProps | undefined;
}
const OrderForm: React.FC<IOrderFromProps> = ({ orderData }) => {
  const navigate = useNavigate();
  const { mutate: AddOrder } = useAddOrder();
  const { mutate: removeUserCart } = useDeleteUserCart();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IOrderForm>();

  const onSubmit = (data: IOrderForm) => {
    data.orderItems = orderData?.order;
    data.totalPrice = orderData?.totalPrice;
    if (data.paymentMethod === PaymentMethod.ONLINE) {
      addOrderInWeb(data);
      startTransition(() => {
        
        navigate("/payment");
      });
    } else {
      AddOrder(data);
      removeUserCart();
      startTransition(() => {
 
        navigate("/order");
      });
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        padding: 3,
        maxWidth: 600,
        margin: "0 auto",
        boxShadow: 3,
        borderRadius: 2,
        mt: 3,
        color: "white",
      }}
    >
      <Typography
        variant="h5"
        component="h2"
        sx={{ mb: 3, textAlign: "center", color: "white" }}
      >
        Shipping & Payment
      </Typography>

      <Grid container spacing={2}>
        {/* Address Field */}
        <Grid item xs={12}>
          <Controller
            name="shippingAddress.address"
            control={control}
            defaultValue=""
            rules={{ required: "Address is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Address"
                variant="outlined"
                fullWidth
                error={!!errors.shippingAddress?.address}
                helperText={errors.shippingAddress?.address?.message}
                InputLabelProps={{ style: { color: "white" } }} // Label color
                InputProps={{ style: { color: "white" } }} // Input text color
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "white", // Outline color
                    },
                    "&:hover fieldset": {
                      borderColor: "lightgray", // Hover outline color
                    },
                  },
                }}
              />
            )}
          />
        </Grid>

        {/* City Field */}
        <Grid item xs={12}>
          <Controller
            name="shippingAddress.city"
            control={control}
            defaultValue=""
            rules={{ required: "City is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="City"
                variant="outlined"
                fullWidth
                error={!!errors.shippingAddress?.city}
                helperText={errors.shippingAddress?.city?.message}
                InputLabelProps={{ style: { color: "white" } }}
                InputProps={{ style: { color: "white" } }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "white",
                    },
                    "&:hover fieldset": {
                      borderColor: "lightgray",
                    },
                  },
                }}
              />
            )}
          />
        </Grid>

        {/* Postal Code Field */}
        <Grid item xs={12}>
          <Controller
            name="shippingAddress.postalCode"
            control={control}
            defaultValue=""
            rules={{ required: "Postal Code is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Postal Code"
                variant="outlined"
                fullWidth
                error={!!errors.shippingAddress?.postalCode}
                helperText={errors.shippingAddress?.postalCode?.message}
                InputLabelProps={{ style: { color: "white" } }}
                InputProps={{ style: { color: "white" } }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "white",
                    },
                    "&:hover fieldset": {
                      borderColor: "lightgray",
                    },
                  },
                }}
              />
            )}
          />
        </Grid>

        {/* Country Field */}
        <Grid item xs={12}>
          <Controller
            name="shippingAddress.country"
            control={control}
            defaultValue=""
            rules={{ required: "Country is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Country"
                variant="outlined"
                fullWidth
                error={!!errors.shippingAddress?.country}
                helperText={errors.shippingAddress?.country?.message}
                InputLabelProps={{ style: { color: "white" } }}
                InputProps={{ style: { color: "white" } }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "white",
                    },
                    "&:hover fieldset": {
                      borderColor: "lightgray",
                    },
                  },
                }}
              />
            )}
          />
        </Grid>

        {/* Payment Method Field */}
        <Grid item xs={12}>
          <Controller
            name="paymentMethod"
            control={control}
            defaultValue={PaymentMethod.ONLINE} // Default value
            rules={{ required: "Payment method is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Payment Method"
                variant="outlined"
                fullWidth
                error={!!errors.paymentMethod}
                helperText={errors.paymentMethod?.message}
                InputLabelProps={{ style: { color: "white" } }}
                InputProps={{ style: { color: "white" } }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "white",
                    },
                    "&:hover fieldset": {
                      borderColor: "lightgray",
                    },
                  },
                }}
              >
                <MenuItem value={PaymentMethod.ONLINE}>Online</MenuItem>
                <MenuItem value={PaymentMethod.CASH_ON_DELIVERY}>
                  Cash on Delivery
                </MenuItem>
              </TextField>
            )}
          />
        </Grid>
      </Grid>

      <Button
        variant="contained"
        color="primary"
        type="submit"
        fullWidth
        sx={{ mt: 3 }}
      >
        Place Order
      </Button>
    </Box>
  );
};

export default OrderForm;
