import CartPage from "./CartPage";
import { useAuth } from "../../../context/AuthContext";
import { useGetCarts } from "../../../Hook/cart/useCart";
import Wrapper from "../Wrapper";

const CartContainer = () => {
  const { user } = useAuth();
  const { data: carts } = useGetCarts(!!user);
  return (
    <Wrapper>
      <CartPage iCarts={carts?.cartEntries} />
    </Wrapper>
  );
};

export default CartContainer;
