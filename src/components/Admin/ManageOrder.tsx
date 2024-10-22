import {
  Alert,
  Avatar,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useGetAllUserOrder } from "../../Hook/order/useOrder";
import TableWrapper from "../../utils/TableWrapper";
import dayjs from "dayjs";
import { IOrder } from "../../Hook/order/IOrder";
import { MaterialReactTable, MRT_ColumnDef } from "material-react-table";
import { DeliveryStatus, PaymentMethod } from "../../types";
import { useUpdateDelivery } from "../../Hook/delivery/useDelivery";
import { IOrderSetpProps } from "../../Hook/delivery/IDelivery";
import { useNavigate } from "react-router-dom";
import { startTransition } from "react";

const ManageOrder = () => {
  const { data, status, error } = useGetAllUserOrder();
  const deliveryStatusOptions = Object.values(DeliveryStatus).map((status) => ({
    label: status,
    value: status,
  }));
  const navigate = useNavigate();
  const {
    mutate: updateOrder,
    status: updateStatus,
    error: updateError,
  } = useUpdateDelivery();

  const setpOrderMaker = (label: string, description: string) => {
    const samay = dayjs().toISOString();
    let obj: IOrderSetpProps = { label, samay, description };
    return obj;
  };

  const generateOrderStep = (step: DeliveryStatus) => {
    const s = step as string;
    switch (s) {
      case DeliveryStatus.SHIPPED:
        return setpOrderMaker(
          DeliveryStatus.SHIPPED,
          "your order shipped successfully"
        );
      case DeliveryStatus.OUT_OF_DELIVERY:
        return setpOrderMaker(
          DeliveryStatus.OUT_OF_DELIVERY,
          "your order out od delivery"
        );
      case DeliveryStatus.DELIVERED:
        return setpOrderMaker(
          DeliveryStatus.DELIVERED,
          "your order delivery successfully"
        );
      case DeliveryStatus.Refunding:
        return setpOrderMaker(
          DeliveryStatus.Refunding,
          "Start Refunding proccess"
        );

      case DeliveryStatus.Refunded:
        return setpOrderMaker(
          DeliveryStatus.Refunding,
          "payment Refunded successfully"
        );
      default:
        return setpOrderMaker(DeliveryStatus.ORDERED, "ordered successfully");
    }
  };

  const columns: MRT_ColumnDef<IOrder>[] = [
    {
      accessorKey: "shippingAddress.address",
      header: "Address",
      Cell: ({ row }) =>
        `${row.original.shippingAddress.address}, ${row.original.shippingAddress.city}, ${row.original.shippingAddress.postalCode}, ${row.original.shippingAddress.country}`,
    },
    {
      accessorKey: "name",
      header: "Product Name",
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      Cell: ({ cell }) => `${cell.getValue()} pcs`,
    },
    {
      accessorKey: "image",
      header: "Image",
      Cell: ({ cell }) => (
        <Avatar
          src={cell.getValue() as string}
          alt="Product Image"
          variant="rounded"
          sx={{ width: 50, height: 50 }}
        />
      ),
    },
    {
      accessorKey: "paymentMethod",
      header: "Payment Method",
      filterFn: "equals",
      filterSelectOptions: ["online", "cash on delivery"],
      filterVariant: "select",
    },
    {
      accessorKey: "totalPrice",
      header: "Total Price",
      Cell: ({ cell }) => `₹ ${cell.getValue()}`,
    },
    {
      accessorKey: "isPaid",
      header: "Paid",
      Cell: ({ cell }) => (
        <Chip
          label={cell.getValue() ? "Paid" : "Unpaid"}
          color={cell.getValue() ? "success" : "error"}
          variant="outlined"
        />
      ),
    },
    {
      accessorKey: "isDelivered",
      header: "Delivery Status",
      filterFn: "equals",
      filterSelectOptions: deliveryStatusOptions,
      filterVariant: "select",
      Cell: ({ cell }) => (
        <Chip
          label={cell.getValue()}
          color={
            cell.getValue() === DeliveryStatus.DELIVERED
              ? "success"
              : cell.getValue() === DeliveryStatus.Canceled
              ? "error"
              : cell.getValue() === DeliveryStatus.Refunded
              ? "success"
              : cell.getValue() === DeliveryStatus.Refunding
              ? "warning"
              : cell.getValue() === DeliveryStatus.SHIPPED
              ? "primary"
              : cell.getValue() === DeliveryStatus.OUT_OF_DELIVERY
              ? "info"
              : cell.getValue() === DeliveryStatus.ORDERED
              ? "default"
              : "default"
          }
          variant="outlined"
        />
      ),
    },

    {
      accessorKey: "createdAt",
      header: "Order Date",
      Cell: ({ cell }) => dayjs(cell.getValue() as string).format("DD/MM/YYYY"),
    },
  ];

  const handleNextClick = (order: IOrder) => {
    const currentStatus = whatDonext(order);
    const newStep = generateOrderStep(currentStatus);
    updateOrder({ id: order._id, data: { currentStatus, newStep } });
  };

  const handleRefund = (order: IOrder) => {
    const orderId = order._id;
    const userId = order.user;
    const amount = order.totalPrice;
    startTransition(() => {
      
      navigate("/refund", { state: { amount, userId, orderId } });
    });
  };
  const whatDonext = (order: IOrder): DeliveryStatus => {
    const ds = order.isDelivered as string; 
    switch (ds) {
      case DeliveryStatus.ORDERED:
        return DeliveryStatus.SHIPPED;
      case DeliveryStatus.SHIPPED:
        return DeliveryStatus.OUT_OF_DELIVERY;
      case DeliveryStatus.OUT_OF_DELIVERY:
        return DeliveryStatus.DELIVERED;
      case DeliveryStatus.Canceled:
        if (order.paymentMethod === PaymentMethod.ONLINE) {
          return DeliveryStatus.Refunding;
        } else {
          return DeliveryStatus.Canceled;
        }
      case DeliveryStatus.Refunding:
        return DeliveryStatus.Refunded;
      default:
        return DeliveryStatus.Canceled;
    }
  };

  const isGoNextProcess = (order: IOrder) => {
    if (
      (order.paymentMethod as string) === PaymentMethod.CASH_ON_DELIVERY &&
      (order.isDelivered as string) === DeliveryStatus.Canceled
    ) {
      return false;
    }

    if (
      order.isPaid &&
      (order.isDelivered as string) === DeliveryStatus.Refunding
    ) {
      return false;
    }
    if ((order.isDelivered as string) === DeliveryStatus.Refunded) {
      return false;
    }
    if((order.isDelivered as string) ===DeliveryStatus.OUT_OF_DELIVERY && !order.isPaid){
      return false;
    }
    if(order.isDelivered as string ===DeliveryStatus.DELIVERED){
      return false;
    }
    return true;
  };

  const isEligibleForRefund = (order: IOrder) => {
    if (order.isPaid && order.isDelivered === DeliveryStatus.Refunding) {
      return true;
    }
    return false;
  };

  if (status === "error") {
    return <Alert severity="error">Failed to load product: {error.msg}</Alert>;
  }
  if (updateStatus === "error") {
    return (
      <Alert severity="error">Failed to load product: {updateError.msg}</Alert>
    );
  }
  if (status === "pending") {
    return <CircularProgress />;
  }
  if (updateStatus === "pending") {
    return <CircularProgress />;
  }

  return (
    <TableWrapper tableName="Order table" title="Order">
      <MaterialReactTable
        columns={columns}
        data={data.order}
        enableRowActions
        positionActionsColumn="last"
        renderRowActions={({ row }) => (
          <div style={{ display: "flex", flexWrap: "nowrap" }}>
            {isGoNextProcess(row.original) && (
              <Tooltip title={`Next step-${whatDonext(row.original)} `} arrow>
                <IconButton onClick={() => handleNextClick(row.original)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    width="22"
                    height="22"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
                    />
                  </svg>
                </IconButton>
              </Tooltip>
            )}
            {isEligibleForRefund(row.original) && (
              <Tooltip title="Refund Payment" arrow>
                <IconButton onClick={() => handleRefund(row.original)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    width="22"
                    height="22"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </IconButton>
              </Tooltip>
            )}
          </div>
        )}
      />
    </TableWrapper>
  );
};

export default ManageOrder;
