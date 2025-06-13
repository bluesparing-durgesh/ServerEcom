import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Rating,
  Avatar,
} from "@mui/material";
import { IGetProductReview } from "../../../Hook/review/IReview";

interface ReviewCardProps {
  review: IGetProductReview;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <Card
      sx={{
        marginBottom: 2,
        background: "linear-gradient(315deg, #2234ae 0%, #191714 74%)",
        color: "white",
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
          <Avatar
            alt={review.user.username}
            src={"/static/images/avatar/1.jpg"}
            sx={{ marginRight: 2 }}
          />
          <Typography variant="h6">{review.user.username}</Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
          <Rating value={review.rating} readOnly />
          <Typography variant="body2" sx={{ marginLeft: 1 }}>
            {review.rating}/5
          </Typography>
        </Box>

        <Typography variant="body1" sx={{ color: "white" }}>
          {review.review || ""}
        </Typography>

        <Typography variant="caption" sx={{ color: "white" }}>
          {new Date(review.createdAt).toLocaleDateString()}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
