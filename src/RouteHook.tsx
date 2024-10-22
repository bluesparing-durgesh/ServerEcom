import { lazy, Suspense } from "react";

import Product from "./components/Common/Product";
import { CircularProgress } from "@mui/material";
import DashBoard from "./components/Admin/DashBoard";
import ViewProduct from "./components/Admin/manageProduct/ViewProduct";
import ViewCate from "./components/Admin/manageCategory/ViewCate";
import ManageUsers from "./components/Admin/ManagaeUser/ViewUser";
import ManageOrder from "./components/Admin/ManageOrder";
import AddProductExcel from "./components/Admin/manageProduct/AddProductExcel";
import AdminWrapper from "./components/Admin/AdminWrapper";

// Lazy load the components
const Signup = lazy(() => import("./components/Auth/Signup"));
const Login = lazy(() => import("./components/Auth/Login"));
const ProductDetails = lazy(() => import("./components/Common/ProductDetails"));
const CartContainer = lazy(
  () => import("./components/Common/Cart/CartContainer")
);
const Checkout = lazy(() => import("./components/Checkout/Checkout"));
const PaymentPage = lazy(() => import("./components/Checkout/PaymentPage"));
const OrderedList = lazy(() => import("./components/Order/OrderedList"));
const OrderStatus = lazy(() => import("./components/Order/OrderStatus"));
const AddProduct = lazy(
  () => import("./components/Admin/manageProduct/AddProduct")
);
const UpdateProduct = lazy(
  () => import("./components/Admin/manageProduct/UpdateProduct")
);
const RefundingPayment = lazy(
  () => import("./components/Checkout/RefundingPayment")
);
const UpdatePayMent = lazy(() => import("./components/Checkout/UpdatePayMent"));

const routeData = [
  {
    path: "/",
    element: <Product />,
  },
  {
    path: "signup",
    element: (
      <Suspense
        fallback={
          <div>
            <CircularProgress />
          </div>
        }
      >
        <Signup />
      </Suspense>
    ),
  },
  {
    path: "admin",
    element: <AdminWrapper />,
    children: [
      {
        path: "dashboard",
        element: <DashBoard />,
      },
      {
        path: "product",
        element: <ViewProduct />,
      },
      {
        path: "category",
        element: <ViewCate />,
      },
      {
        path: "user",
        element: <ManageUsers />,
      },
      {
        path: "order",
        element: <ManageOrder />,
      },
      {
        path: "upload-excel",
        element: <AddProductExcel />,
      },
      {
        path: "add-product",
        element: <AddProduct />,
      },
      {
        path: "edit-product",
        element: <UpdateProduct />,
      },
    ],
  },
  {
    path: "/login",
    element: (
      <Suspense
        fallback={
          <div>
            <CircularProgress />
          </div>
        }
      >
        <Login />
      </Suspense>
    ),
  },
  {
    path: "/product/:id/:cid",
    element: (
      <Suspense
        fallback={
          <div>
            <CircularProgress />
          </div>
        }
      >
        <ProductDetails />
      </Suspense>
    ),
  },
  {
    path: "/cart",
    element: (
      <Suspense
        fallback={
          <div>
            <CircularProgress />
          </div>
        }
      >
        <CartContainer />
      </Suspense>
    ),
  },
  {
    path: "/checkout",
    element: (
      <Suspense
        fallback={
          <div>
            <CircularProgress />
          </div>
        }
      >
        <Checkout />
      </Suspense>
    ),
  },
  {
    path: "/payment",
    element: (
      <Suspense
        fallback={
          <div>
            <CircularProgress />
          </div>
        }
      >
        <PaymentPage />
      </Suspense>
    ),
  },
  {
    path: "/refund",
    element: (
      <Suspense
        fallback={
          <div>
            <CircularProgress />
          </div>
        }
      >
        <RefundingPayment />
      </Suspense>
    ),
  },
  {
    path: "/update-payment",
    element: (
      <Suspense
        fallback={
          <div>
            <CircularProgress />
          </div>
        }
      >
        <UpdatePayMent />
      </Suspense>
    ),
  },
  {
    path: "/order",
    element: (
      <Suspense
        fallback={
          <div>
            <CircularProgress />
          </div>
        }
      >
        <OrderedList />
      </Suspense>
    ),
  },
  {
    path: "/order-status/:orderId",
    element: (
      <Suspense
        fallback={
          <div>
            <CircularProgress />
          </div>
        }
      >
        <OrderStatus />
      </Suspense>
    ),
  },
  {
    path: "/add-product",
    element: (
      <Suspense
        fallback={
          <div>
            <CircularProgress />
          </div>
        }
      >
        <AddProduct />
      </Suspense>
    ),
  },
  {
    path: "/edit-product",
    element: (
      <Suspense
        fallback={
          <div>
            <CircularProgress />
          </div>
        }
      >
        <UpdateProduct />
      </Suspense>
    ),
  },
];

export default routeData;
