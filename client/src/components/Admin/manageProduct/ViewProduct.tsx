import {
  Alert,
  CircularProgress,
  Button,
  Grid2,
  Paper,
  Typography,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";

const columns: MRT_ColumnDef<IProduct>[] = [
  {
    accessorKey: "name",
    header: "Product Name",
    size: 100,
  },
  {
    accessorKey: "price",
    header: "Price",
    size: 50,
  },
  {
    accessorKey: "category.name",
    header: "Category",
    size: 100,
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    size: 50,
  },
  {
    accessorKey: "rating",
    header: "Rating",
    size: 10,
  },
];

import { startTransition, useState } from "react";
import {
  useDeleteProduct,
  useGetAllProducts,
} from "../../../Hook/product/useProduct";
import { MaterialReactTable, MRT_ColumnDef } from "material-react-table";
import { IProduct } from "../../../Hook/product/Iproduct";

import { Link, useNavigate } from "react-router-dom";
const ViewProduct = () => {
  const { data: proRes, error, status, isLoading } = useGetAllProducts();
  const {
    mutate: deleteP,
    status: deleteStatus,
    error: deleteError,
  } = useDeleteProduct();
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const navigate = useNavigate();
  const handleEditProduct = (p: IProduct) => {
    startTransition(() => {
      navigate("/admin/edit-product", { state: { p } });
    });
   
  };
  const handleAddProduct = () => {
    startTransition(() => {
      navigate("/admin/add-product")
    });
   
  };
  const handleDeleteProduct = (id: string) => {
    deleteP(id);
  };

  if (status === "pending" || deleteStatus === "pending") {
    return <CircularProgress />;
  }
  if (status === "error") {
    return <Alert severity="error">Failed to load product: {error.msg}</Alert>;
  }
  if (deleteStatus === "error") {
    return (
      <Alert severity="error">Failed to load product: {deleteError.msg}</Alert>
    );
  }

  return (
    <Grid2>
      <Paper elevation={1} sx={{ p: 2 }}>
        <Typography sx={{ color: "orange" }} variant="h5">
          Product Table
        </Typography>
        <Typography variant="h5" mb={2}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ flex: 1 }}>
              <Link
                to="/admin/dashboard"
                style={{
                  color: "#1976d2",
                  fontWeight: "bold",
                  fontSize: "0.875rem",
                }}
              >
                Dashboard /
              </Link>
              <span style={{ color: "#616161", fontSize: "0.875rem" }}>
                {" "}
                Product
              </span>
            </div>
 
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddProduct}
                sx={{
                  height: "40px",
                  padding: "0 16px",
                  fontSize: "0.75rem",
                  borderRadius: "4px",
                }}
              >
                Add Product
              </Button>
       
          </div>
        </Typography>

        <Divider
          sx={{ borderColor: "#616161", marginTop: "16px", width: "100%" }}
        />
        <MaterialReactTable
          state={{ isLoading, pagination }}
          columns={columns}
          onPaginationChange={setPagination}
          data={proRes?.products || []}
          enableRowActions
          positionActionsColumn="last"
          renderRowActions={({ row }) => (
            <div style={{ display: "flex", flexWrap: "nowrap" }}>
              <Tooltip title="Edit Category" arrow>
                <IconButton
                  color="primary"
                  onClick={() => handleEditProduct(row.original)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    width="22"
                    height="22"
                    className="size-5 text-addButton"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Category" arrow>
                <IconButton
                  color="error"
                  onClick={() => handleDeleteProduct(row.original._id!)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    width="22"
                    height="22"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-5 text-red-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </IconButton>
              </Tooltip>
            </div>
          )}
        />
      </Paper>
    </Grid2>
  );
};

export default ViewProduct;
