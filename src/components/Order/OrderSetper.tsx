import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import {
  useCancelDelivery,
  useGetDelivery,
} from "../../Hook/delivery/useDelivery";
import React, { FC, startTransition, useEffect, useState } from "react";
import {
  Alert,
  Button,
  CircularProgress,
  Grid2,
  Modal,
  Slide,
} from "@mui/material";
import { DeliveryStatus, PaymentMethod } from "../../types";
import { useGetrOrderById } from "../../Hook/order/useOrder";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUpdateProductRating } from "../../Hook/product/useProduct";
import RatingAndReview from "./RatingAndReview";
import { TransitionProps } from "@mui/material/transitions";
import { useChckReviews } from "../../Hook/review/useReview";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
interface OrderStatusProps {
  orderId: string;
}

const OrderSetper: FC<OrderStatusProps> = ({ orderId }) => {
  const { order } = useLocation().state;
  const { data: delivery, status, error } = useGetDelivery(orderId);
  const { data } = useGetrOrderById(orderId);
  const [isShowCancelBtn, setIsShowCancelBtn] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { mutate } = useUpdateProductRating();
  const { data: existReview } = useChckReviews(order.product);
  const isWithinSevenDays = (startDate: string | null) => {
    const currenttSt = delivery?.data.currentStatus;
    if (startDate === null) {
      return true;
    }
    if (
      currenttSt === DeliveryStatus.Canceled ||
      currenttSt === DeliveryStatus.Refunding ||
      currenttSt === DeliveryStatus.Refunded
    ) {
      return false;
    }
    const currentDate = dayjs();
    const start = dayjs(startDate);
    const difference = currentDate.diff(start, "day");
    return difference <= 7;
  };
  const [activeStep, setActiveStep] = useState(0);
  const {
    mutate: cancelOrder,
    status: cancelStatus,
    error: cancelErr,
  } = useCancelDelivery();

  const handleCancelOrder = () => {
    if (delivery) {
      const IstEle = delivery.data.orderSteps[0];
      const IIndEle = {
        label: "Order Cancel",
        description: "The order has been cancel successfully.",
        samay: dayjs().toISOString(),
      };
      let newOrderSteps = [IstEle, IIndEle];
      cancelOrder({ id: orderId, data: { newOrderSteps } });
    } else {
      console.log("errror");
    }
  };

  const isShowPaymentButton = () => {
    if (!data) {
      return false;
    }
    if (
      data.order.isDelivered === (DeliveryStatus.OUT_OF_DELIVERY as string) &&
      data.order.paymentMethod === (PaymentMethod.CASH_ON_DELIVERY as string) &&
      data.order.isPaid === false
    ) {
      return true;
    }
    return false;
  };

  const handleReviewRating = (rating: number, review: string) => {
    mutate({ id: order.product, rating, review });
    setIsOpen(false);
  };
  const handleRateProduct = () => {
    setIsOpen(true);
  };
  useEffect(() => {
    if (delivery) {
      const l = delivery.data.orderSteps.length;
      if (l > 0) {
        setActiveStep(l - 1);
      }
      setIsShowCancelBtn(
        isWithinSevenDays(
          delivery?.data.deliveredDate ? delivery?.data.deliveredDate : null
        )
      );
    }
  }, [delivery]);

  const isShowReview = () => {
    if (
      !isShowCancelBtn &&
      data &&
      data?.order.isDelivered === (DeliveryStatus.DELIVERED as string) &&
      !existReview?.success
    ) {
      return true;
    }
    return false;
  };
  const updatePayment = () => {
    const amount = data?.order.totalPrice;
    startTransition(() => {
      navigate("/update-payment", { state: { amount, orderId } });
    });
 
  };
  if (status === "pending" || cancelStatus === "pending") {
    <Grid2>
      <CircularProgress />
    </Grid2>;
  }
  if (status === "error") {
    return <Alert severity="error">{error.msg}</Alert>;
  }
  if (cancelStatus === "error") {
    return <Alert severity="error">{cancelErr.msg}</Alert>;
  }
  return (
    <Grid2 container justifyContent="center" minHeight="100vh">
      <Box sx={{ color: "white", mt: 10 }}>
        <Typography variant="h5">ORDER SUMMARY</Typography>
        <hr />
        <Stepper activeStep={activeStep} orientation="vertical">
          {delivery &&
            delivery.data.orderSteps.map((step) => (
              <Step key={step.label}>
                <StepLabel>
                  <Typography sx={{ color: "wheat" }}>{step.label}</Typography>
                </StepLabel>
                <StepContent>
                  <Typography>{step.description}</Typography>
                  <Typography sx={{ color: "yellowgreen", fontSize: 10 }}>
                    ({dayjs(step.samay).format("DD MMMM YYYY, dddd")})
                  </Typography>
                </StepContent>
              </Step>
            ))}

          {isShowPaymentButton() && (
            <Button
              variant="outlined"
              color="success"
              sx={{ my: 1 }}
              onClick={updatePayment} // Pass step ID to handle cancellation
            >
              Make payment
            </Button>
          )}
          {isShowCancelBtn && (
            <Button
              variant="outlined"
              color="error"
              sx={{ my: 1 }}
              onClick={handleCancelOrder} // Pass step ID to handle cancellation
            >
              Cancel Order
            </Button>
          )}

          {isShowReview() && (
            <Button
              variant="outlined"
              color="success"
              sx={{ my: 1 }}
              onClick={handleRateProduct}
            >
              Rate Product
            </Button>
          )}
        </Stepper>
        <hr />
        <Link to="/">
          <Button variant="outlined" color="warning" sx={{ my: 2 }}>
            Countinue Shopping
          </Button>
        </Link>
      </Box>
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <RatingAndReview onSubmit={handleReviewRating} />
      </Modal>
    </Grid2>
  );
};

export default OrderSetper;
