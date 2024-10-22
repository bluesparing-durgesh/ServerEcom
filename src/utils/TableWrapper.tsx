import { Divider, Grid2, Paper, Typography } from "@mui/material";
import React, { FC } from "react";
import { Link } from "react-router-dom";
interface TableProps {
    children: React.ReactNode;
  tableName: string;
  title: string;
}
const TableWrapper: FC<TableProps> = ({ children, tableName, title }) => {
  return (
    <Grid2>
      <Paper elevation={1} sx={{ p: 2 }}>
        <Typography sx={{ color: "orange" }} variant="h5">
          {tableName}
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
                {title}
              </span>
            </div>
          </div>
        </Typography>

        <Divider
          sx={{ borderColor: "#616161", marginTop: "16px", width: "100%" }}
        />
        {children}
      </Paper>
    </Grid2>
  );
};

export default TableWrapper;
