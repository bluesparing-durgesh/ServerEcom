import React from "react";
import {
  Alert,
  Card,
  CardContent,
  CircularProgress,
  Grid2,
  Typography,
} from "@mui/material";
import { useGetDashboard } from "Hook/dashBoard/useDashboard";

interface OrderCardProps {
  status: string;
  count?: number;
}
const DashBoard = () => {
  const { data, isLoading, isError, error } = useGetDashboard();

  if (isLoading) {
    return (
      <Grid2>
        <CircularProgress />
      </Grid2>
    );
  }

  if (isError) {
    return (
      <>
        <Alert severity="error">Failed to load product: {error.msg}</Alert>
      </>
    );
  }
  return (
    <Grid2 container spacing={3} sx={{ padding: "2rem" }}>
      {/* Product Count */}
      <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
        <OrderCard status="Product Count" count={data?.productCount} />
      </Grid2>

      {/* Category Count */}
      <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
        <OrderCard status="Category Count" count={data?.categoryCount} />
      </Grid2>

      {/* Monthly Orders Section */}
      <Grid2 size={{ xs: 12 }}>
        <Typography variant="h6" gutterBottom sx={{color:"white"}}>
          Monthly Order Record
        </Typography>
        <hr style={{height:'4px',borderRadius:'2px',backgroundColor:"white"}}/>
      </Grid2>

      {data &&
        data.orderStats.monthly.map((ele) => (
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={ele._id}>
            <OrderCard status={ele._id} count={ele.count} />
          </Grid2>
        ))}

      {/* Yearly Orders Section */}
      <Grid2 size={{ xs: 12 }}>
        <Typography variant="h6" gutterBottom sx={{color:"white"}}>
          Yearly Order Record
          <hr style={{height:'4px',borderRadius:'2px',backgroundColor:"white"}}/>
        </Typography>
      </Grid2>

      {data &&
        data.orderStats.yearly.map((ele) => (
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={ele._id}>
            <OrderCard status={ele._id} count={ele.count} />
          </Grid2>
        ))}
    </Grid2>
  );
};

const OrderCard: React.FC<OrderCardProps> = ({ status, count = 0 }) => {
  return (
    <Card sx={{ minWidth: 275}}>
      <CardContent>
        <Typography variant="body1" component="div" sx={{textTransform:"capitalize"}}>
          {status}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{fontWeight:'semibold'}}>
          {count}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default DashBoard;
