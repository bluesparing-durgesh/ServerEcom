import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { IOrder } from "../../Hook/order/IOrder";
import { PaymentMethod } from "../../types";
import {  useNavigate } from "react-router-dom";
import { startTransition } from "react";

interface OrderCardProps {
  order: IOrder;
}
const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const navigate = useNavigate();

  const handleNaigation = () => {
    startTransition(() => {
     
      navigate(`/order-status/${order._id}`, { state: { order } });
    });
  };
  return (
    <div onClick={handleNaigation} style={{ textDecoration: "none" }}>
      <Card
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          mb: 2,
          boxShadow: 3,
          background:
            "linear-gradient(112.1deg, rgb(32, 38, 57) 11.4%, rgb(63, 76, 119) 70.2%)",
          color: "white",
          p: 2,
        }}
      >
        <CardMedia
          component="img"
          sx={{
            width: { xs: "100%", sm: 150 },
            height: { xs: "auto", sm: 150 },
            objectFit: "contain",
          }}
          image={order.image}
          alt={order.name}
        />
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography variant="h6" component="div" sx={{ color: "white" }}>
            {order.name}
          </Typography>
          <Typography variant="body2" sx={{ color: "white" }}>
            Quantity: {order.quantity}
          </Typography>
          <Typography variant="body2" sx={{ color: "white" }}>
            Total Price: ${order.totalPrice.toFixed(2)}
          </Typography>
          <Typography variant="body2" sx={{ color: "white" }}>
            Payment Method:{" "}
            {order.paymentMethod === PaymentMethod.CASH_ON_DELIVERY
              ? "Cash on Delivery"
              : "Online"}
          </Typography>
          <Typography variant="body2" color={order.isPaid ? "green" : "red"}>
            {order.isPaid ? "Paid" : "Not Paid"}
          </Typography>
          <Typography variant="body2" color="white">
            Delivery Status: {order.isDelivered}
          </Typography>
          <Typography variant="body2" color="white">
            Ordered At: {new Date(order.createdAt).toLocaleDateString()}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderCard;
