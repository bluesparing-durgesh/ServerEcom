import { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_ColumnDef,
} from "material-react-table";

import {  CircularProgress, Alert } from "@mui/material";
import { IUser } from "../../../types";
import TableWrapper from "../../../utils/TableWrapper";
import { useGetUsers } from "../../../Hook/useAuthHook";
import dayjs from "dayjs";

export default function ManageUsers() {
  const { data, status, error } = useGetUsers();
  const columns: MRT_ColumnDef<IUser, unknown>[] = useMemo(
    () => [
      {
        accessorKey: "username",
        header: "Username",
        size: 200,
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 200,
      },
      {
        accessorKey: "fullName",
        header: "Full Name",
        size: 100,
      },
      {
        accessorKey: "role",
        header: "Role",
        size: 100,
      },
      {
        accessorKey: "createdAt",
        header: "Creation Date",
        size: 100,
        Cell: ({ row }) => (
          <span>{dayjs(row.original.createdAt).format("DD/MM/YYYY")}</span>
        ),
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: data?.users || [],
    enableRowSelection: true,
    enablePagination: true,
  });

  if (status === "pending") {
    <CircularProgress />;
  }

  if (status === "error") {
    return <Alert severity="error">Failed to load product: {error.msg}</Alert>;
  }
  return (
    <div>
      <TableWrapper tableName="User Table" title="User">
        <>
          <MaterialReactTable table={table} />
        </>
      </TableWrapper>
    </div>
  );
}
