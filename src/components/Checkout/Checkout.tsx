import { CheckoutProps } from "../../utils/statuses";
import { getCartFromWeb } from "../../utils/CartHandler";

import Wrapper from "../Common/Wrapper";
import OrderForm from "./OrderForm";

const Checkout = () => {
  const orderItems: CheckoutProps | undefined = getCartFromWeb() as
    | CheckoutProps
    | undefined;
  return (
    <Wrapper>
      <OrderForm orderData={orderItems} />
    </Wrapper>
  );
};

export default Checkout;
