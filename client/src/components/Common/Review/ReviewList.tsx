import React from "react";
import { Alert, CircularProgress, Container, Typography } from "@mui/material";
import ReviewCard from "./ReviewCard";
import { useGetProductReviews } from "../../../Hook/review/useReview";
interface ReviewListProps {
  pid: string;
}

const ReviewList: React.FC<ReviewListProps> = ({ pid }) => {
  const {
    data: reviews,
    isLoading,
    isError,
    error,
  } = useGetProductReviews(pid);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return <Alert severity="error">Failed to load product: {error.msg}</Alert>;
  }
  if(reviews && reviews?.data.length<=0){
    return <>
      <Container
      className="hide-scrollbar"
      sx={{ mt: 5, height: "5vh", overflow: "auto" }}
    >
      
    </Container>
    </>
  }

  return (
    <Container
      className="hide-scrollbar"
      sx={{ mt: 5, height: "50vh", overflow: "auto" }}
    >
      <Typography sx={{ my: 3 }} variant="h6">
        Reviews
      </Typography>
      {reviews?.data.map((review, index) => (
        <ReviewCard key={index} review={review} />
      ))}
    </Container>
  );
};

export default ReviewList;
