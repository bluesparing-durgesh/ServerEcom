import React, { useState } from "react";
import { Box, Button, Rating, TextField, Typography } from "@mui/material";

interface RatingAndReviewProps {
  onSubmit: (rating: number, review: string) => void;
}

const RatingAndReview: React.FC<RatingAndReviewProps> = ({ onSubmit }) => {
  const [rating, setRating] = useState<number | null>(null);
  const [review, setReview] = useState<string>("");

  const handleRatingChange = (
    event: React.SyntheticEvent,
    newValue: number | null
  ) => {
    setRating(newValue);
  };

  const handleReviewChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReview(event.target.value);
  };

  const handleSubmit = () => {
    if (rating !== null && review.trim() !== "") {
      onSubmit(rating, review); 
      setRating(null);
      setReview("");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        padding: 2,
        width: "100%",
        maxWidth: "500px",
        margin: "auto",
        background:
          "linear-gradient(112.1deg, rgb(32, 38, 57) 11.4%, rgb(63, 76, 119) 70.2%)",
        borderRadius: 2,
        boxShadow: 1,
        color: "white",
      }}
    >
      <Typography variant="h5" component="div">
        Leave a Review
      </Typography>

      {/* Rating Component */}
      <Rating
        name="user-rating"
        value={rating}
        onChange={handleRatingChange}
        size="large"
        precision={0.5}
      />
      <Typography variant="body2" color="white">
        {rating !== null ? `You rated this ${rating} stars` : "Select a rating"}
      </Typography>


      <TextField
  label="Write a Review"
  multiline
  rows={4}
  fullWidth
  value={review}
  onChange={handleReviewChange}
  InputProps={{
    style: { color: 'white' }, // Change the text color to white
  }}
  InputLabelProps={{
    style: { color: 'white' }, // Change the label color to white
  }}
  sx={{
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white', // White border color
      },
      '&:hover fieldset': {
        borderColor: 'white', // White border on hover
      },
      '&.Mui-focused fieldset': {
        borderColor: 'white', // White border when focused
      },
    },
  }}
/>

      <Button
        variant="contained"
        sx={{ color:"white"}}
        onClick={handleSubmit}
        disabled={rating === null || review.trim() === ""}
      >
        Submit Review
      </Button>
    </Box>
  );
};

export default RatingAndReview;
