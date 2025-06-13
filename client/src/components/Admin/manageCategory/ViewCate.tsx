import { useMemo, useState } from "react";
import { MaterialReactTable, MRT_ColumnDef } from "material-react-table";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Modal,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  CircularProgress,
  Alert,
  Grid2,
  Paper,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";
import {
  useAddCategory,
  useDeleteCategory,
  useGetCategories,
  useUpdateCategory,
} from "../../../Hook/category/useCategory";
import { ICategory, ICategoryPayload } from "../../../Hook/category/ICategory";
import { Link } from "react-router-dom";

export default function ViewCate() {
  const [modalOpen, setModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState<ICategory | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  // Fetch categories with pagination
  const { data} = useGetCategories();
  const { categories } = data || { categories: [], hasNext: false };
  const { mutate: addCate} = useAddCategory();
  const { mutate: updateCate, status, error: updatError } = useUpdateCategory();
  const {
    mutate: deleteCate,
    status: deleteStatus,
    error: deleteError,
  } = useDeleteCategory();
  const columns: MRT_ColumnDef<ICategory, unknown>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "relatedProduct",
        header: "Related Product",
        Cell: ({ row }) => (
          <Tooltip title={`View All Products in ${row.original.name} category`}>
            <VisibilityIcon
              onClick={() => handleView(row.original._id!)} // Handle view action
              style={{ cursor: "pointer", marginRight: 8 }}
            />
          </Tooltip>
        ),
      },
    ],
    []
  );

  const handleEdit = (category: ICategory) => {
    setNewCategory(category);
    setIsEditMode(true);
    setModalOpen(true);
  };

  const openDeleteDialog = (id: string) => {
    setCategoryToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (categoryToDelete) {
      deleteCate(categoryToDelete);
      setCategoryToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const handleView = (id: string) => {
    console.log("View category with id:", id); // Print the category ID
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setIsEditMode(false);
    setNewCategory(null);
  };

  const handleAddOrEditCategory = () => {
    if (isEditMode) {
      const data: ICategoryPayload = { name: newCategory?.name || "" };
      updateCate({ id: newCategory?._id ?? "", data });
    } else {
      addCate({ name: newCategory!.name });
    }
    handleModalClose();
  };
  const handleAddCategory = () => {
    setModalOpen(true);
    setIsEditMode(false);
    setNewCategory(null);
  };
  if (status === "pending" || deleteStatus === "pending") {
    return <CircularProgress />;
  }
  if (status === "error") {
    return (
      <Alert severity="error">Failed to load product: {updatError.msg}</Alert>
    );
  }
  if (deleteStatus === "error") {
    return (
      <Alert severity="error">Failed to load product: {deleteError.msg}</Alert>
    );
  }
  return (
    <div>
      <Grid2>
        <Paper elevation={1} sx={{ p: 2 }}>
          <Typography sx={{ color: "orange" }} variant="h5">
            Category Table
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
                  Category
                </span>
              </div>

              <Button
                variant="contained"
                color="primary"
                sx={{
                  height: "40px",
                  padding: "0 16px",
                  fontSize: "0.75rem",
                  borderRadius: "4px",
                }}
                onClick={handleAddCategory}
              >
                Add Category
              </Button>
            </div>
          </Typography>

          <Divider
            sx={{ borderColor: "#616161", marginTop: "16px", width: "100%" }}
          />
          <MaterialReactTable
            columns={columns}
            data={categories || []}
            enableRowActions
            positionActionsColumn="last"
            renderRowActions={({ row }) => (
              <div style={{ display: "flex", flexWrap: "nowrap" }}>
                <Tooltip title="Edit Product" arrow>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(row.original)}
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
                <Tooltip title="Delete Product" arrow>
                  <IconButton
                    color="error"
                    onClick={() => openDeleteDialog(row.original._id!)}
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

      {/* Add/Edit Modal */}
      <Modal open={modalOpen} onClose={handleModalClose}>
        <div
          style={{
            padding: "20px",
            background: "white",
            margin: "auto",
            maxWidth: "400px",
            borderRadius: "8px",
          }}
        >
          <h2>{isEditMode ? "Edit Category" : "Add New Category"}</h2>
          <TextField
            label="Category Name"
            variant="outlined"
            fullWidth
            value={newCategory?.name || ""}
            onChange={(e) =>
              setNewCategory({ ...newCategory, name: e.target.value })
            }
          />
          <Button
            onClick={handleAddOrEditCategory}
            variant="contained"
            color="primary"
            style={{ marginTop: "10px" }}
          >
            {isEditMode ? "Update Category" : "Add Category"}
          </Button>
          <Button
            onClick={handleModalClose}
            variant="outlined"
            style={{ marginTop: "10px", marginLeft: "10px" }}
          >
            Cancel
          </Button>
        </div>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this category?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
