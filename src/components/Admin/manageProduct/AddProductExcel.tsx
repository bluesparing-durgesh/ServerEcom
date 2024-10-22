import { useState } from "react";
import {
  Box,
  Typography,
  Input,
  Paper,
  Button,
  CircularProgress,
} from "@mui/material";
import { SvgIcon } from "@mui/material";
import { useAddProductExcel } from "../../../Hook/product/useProduct";
import TableWrapper from "../../../utils/TableWrapper";

const AddProductExcel = () => {
  const {
    mutate: addp,
    isError,
    error: AError,
    isSuccess,
    isPending,
  } = useAddProductExcel();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      addp(selectedFile);
      console.log("Uploading file:", selectedFile);
    } else {
      console.log("No file selected");
    }
  };

  return (
    <TableWrapper tableName="Upload Poduct excel" title="Product excel">
      <Box
        sx={{
          width: "80%",
          borderRadius: "10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px",
          backgroundColor: "rgba(0, 110, 255, 0.041)",
        }}
      >
        <Box
          sx={{
            flex: 1,
            width: "100%",
            border: "2px dashed royalblue",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <SvgIcon
            sx={{ height: "60px", width: "60px" }}
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M7 10V9C7 6.23858 9.23858 4 12 4C14.7614 4 17 6.23858 17 9V10C19.2091 10 21 11.7909 21 14C21 15.4806 20.1956 16.8084 19 17.5M7 10C4.79086 10 3 11.7909 3 14C3 15.4806 3.8044 16.8084 5 17.5M7 10C7.43285 10 7.84965 10.0688 8.24006 10.1959M12 12V21M12 12L15 15M12 12L9 15"
              stroke="#000000"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </SvgIcon>
          <Typography
            variant="body1"
            sx={{ textAlign: "center", color: "black" }}
          >
            Browse File to upload!
          </Typography>
        </Box>
        <label
          htmlFor="file"
          style={{
            backgroundColor: "rgba(0, 110, 255, 0.075)",
            width: "100%",
            height: "40px",
            borderRadius: "10px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "black",
          }}
        >
          <SvgIcon
            sx={{ height: "30px", width: "30px", marginRight: "5px" }}
            viewBox="0 0 32 32"
          >
            <path d="M15.331 6H8.5v20h15V14.154h-8.169z" />
            <path d="M18.153 6h-.009v5.342H23.5v-.002z" />
          </SvgIcon>
          <Typography variant="body2">
            {selectedFile ? selectedFile.name : "Not selected file"}
          </Typography>
        </label>
        <Input
          id="file"
          type="file"
          onChange={handleFileChange}
          sx={{ display: "none" }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          sx={{
            marginTop: "10px",
            borderRadius: "10px",
            width: "100%",
          }}
          disabled={isPending} // Disable button during upload
        >
          {isPending ? "Uploading..." : "Upload"}
        </Button>

        {/* Show loader when upload is in progress */}
        {isPending && (
          <CircularProgress
            sx={{ marginTop: "10px" }}
            size={24}
            color="primary"
          />
        )}

        {/* Show error message if upload failed */}
        {isError && (
          <Typography color="error" sx={{ marginTop: "10px" }}>
            {AError?.msg || "An error occurred while uploading."}
          </Typography>
        )}

        {/* Show success message if upload succeeded */}
        {isSuccess && (
          <Typography color="success.main" sx={{ marginTop: "10px" }}>
            File uploaded successfully!
          </Typography>
        )}
      </Box>
    </TableWrapper>
  );
};

export default AddProductExcel;
