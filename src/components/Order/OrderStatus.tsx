
import OrderSetper from "./OrderSetper";
import { useParams } from "react-router-dom";
import Wrapper from "../Common/Wrapper";

const OrderStatus = () => {
  const { orderId } = useParams();
  return (
    <Wrapper>
      {orderId ? <OrderSetper orderId={orderId} /> : <>missing orderId</>}
    </Wrapper>
  );
};

export default OrderStatus;
