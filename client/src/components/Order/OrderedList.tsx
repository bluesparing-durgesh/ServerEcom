import { Alert, CircularProgress, Grid2, Typography } from "@mui/material";
import { useGetUserOrder } from "../../Hook/order/useOrder";
import OrderCard from "./OrderCard";
import Wrapper from "../Common/Wrapper";

const OrderedList = () => {
  const { data, error, isLoading, status } = useGetUserOrder();

  if (isLoading) {
    return (
      <Grid2 size={{ md: 12, xs: 12 }}>
        <CircularProgress />
      </Grid2>
    );
  }
  if (status === "error") {
    return <Alert severity="error">Failed to load product: {error.msg}</Alert>;
  }

  return (
    <Wrapper >
      <Grid2 container spacing={2} mx={2} mt={3} minHeight="100vh">
        {data?.order && data.order.length > 0 ? (
          <>
            {data.order.map((order) => (
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={order._id}>
                <OrderCard order={order} />
              </Grid2>
            ))}
          </>
        ) : (
          <Grid2 size={{ xs: 12, sm: 12, md: 12 }}>
            <Typography variant="body2" sx={{ color: "white" }}>
              No ordered items yet
            </Typography>
          </Grid2>
        )}
      </Grid2>
    </Wrapper>
  );
};

export default OrderedList;
