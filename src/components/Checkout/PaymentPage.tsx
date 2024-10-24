import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Button,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { clearOrderWebCart, getOrderFromWeb } from "../../utils/CartHandler";
import { IndianBanks, IOrderForm } from "../../utils/statuses";
import { useAddOrder } from "../../Hook/order/useOrder";
import { useDeleteUserCart } from "../../Hook/cart/useCart";
import Wrapper from "../Common/Wrapper";
import { startTransition } from "react";

interface IPayment {
  amount: number;
  bank: IndianBanks;
  cardNumber: number;
}
const PaymentPage = () => {
  const OrderData: IOrderForm | undefined = getOrderFromWeb() as
    | IOrderForm
    | undefined;
  const navigate = useNavigate();
  const { mutate: AddOrder } = useAddOrder();
  const { mutate: removeUserCart } = useDeleteUserCart();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IPayment>();

  const onSubmit = (data: IPayment) => {
    if (OrderData) {
      OrderData.cardNumber = data.cardNumber;
      OrderData.bank = data.bank;
      AddOrder(OrderData);
      removeUserCart();
      clearOrderWebCart();
      startTransition(() => {
    
        navigate("/order");
      });
    } else {
      console.error("OrderData is undefined");
    }
  };

  return (
    <Wrapper>
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
                    value={OrderData?.totalPrice || 0}
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
            Make Payment
          </Button>
        </Box>
    </Wrapper>
   
  );
};

export default PaymentPage;
