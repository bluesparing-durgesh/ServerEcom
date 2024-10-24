import { useLocation, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import { IndianBanks } from "../../utils/statuses";
import {  startTransition, useEffect } from "react";
import { useRefundOrder } from "../../Hook/order/useOrder";
import { UpdateOrderProps } from "../../Hook/order/IOrder";
import Wrapper from "../Common/Wrapper";

interface IPayment {
  amount: number;
  bank: IndianBanks;
  cardNumber: number;
}

const RefundingPayment = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IPayment>();
  const navigate = useNavigate();
  const { amount, orderId, userId } = useLocation().state;
  const { mutate, status, error } = useRefundOrder();
  const onSubmit = (data: IPayment) => {
    const payload: UpdateOrderProps = {
      userId,
      orderId,
      amount,
      bank: data.bank,
      cardNumber: data.cardNumber,
    };
    mutate(payload);
  };
  useEffect(() => {
    if (status === "success") {
      startTransition(() => {
 
        navigate(-1);
      });
    }
  }, [status]);
  if (status === "error") {
    return <Alert severity="error">Failed to load product: {error.msg}</Alert>;
  }
  return (
    <Wrapper>
  {status === "pending" ? (
          <>
            <CircularProgress />
          </>
        ) : (
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
              Payment
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Controller
                  name="bank"
                  control={control}
                  defaultValue={IndianBanks.HDFC} // Default value
                  rules={{ required: "Payment method is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Select Bank"
                      variant="outlined"
                      fullWidth
                      error={!!errors.bank}
                      helperText={errors.bank?.message}
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
                      {Object.values(IndianBanks).map((bankName) => (
                        <MenuItem key={bankName} value={bankName}>
                          {bankName}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>

              {/* Postal Code Field */}
              <Grid item xs={12}>
                <Controller
                  name="amount"
                  control={control}
                  defaultValue={0}
                  rules={{ required: "amount   is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Amount"
                      variant="outlined"
                      fullWidth
                      value={amount}
                      error={!!errors.amount}
                      helperText={errors.amount?.message}
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
              <Grid item xs={12}>
                <Controller
                  name="cardNumber"
                  control={control}
                  defaultValue={0}
                  rules={{ required: "Card Number   is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Card Number"
                      variant="outlined"
                      fullWidth
                      error={!!errors.cardNumber}
                      helperText={errors.cardNumber?.message}
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
            </Grid>

            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{ mt: 3 }}
            >
              Refund Payment
            </Button>
          </Box>
        )}
    </Wrapper>
   
  );
};

export default RefundingPayment;
