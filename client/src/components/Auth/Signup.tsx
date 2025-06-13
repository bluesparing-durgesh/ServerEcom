import React, {
  useReducer,
  ChangeEvent,
  FormEvent,
  useEffect,
  startTransition,
} from "react";
import {
  Box,
  Button,
  TextField,
  IconButton,
  InputAdornment,
  Card,
  Typography,
  Link,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { ISignupPayload } from "../../utils/statuses";
import { useSignup } from "../../Hook/useAuthHook";
import { useAuth } from "../../context/AuthContext";

type ActionType = {
  type: "SET_USERNAME" | "SET_EMAIL" | "SET_FULLNAME" | "SET_PASSWORD";
  payload: string;
};

const initialFormData: ISignupPayload = {
  username: "",
  email: "",
  fullName: "",
  password: "",
};

function formReducer(
  state: ISignupPayload,
  action: ActionType
): ISignupPayload {
  switch (action.type) {
    case "SET_USERNAME":
      return { ...state, username: action.payload };
    case "SET_EMAIL":
      return { ...state, email: action.payload };
    case "SET_FULLNAME":
      return { ...state, fullName: action.payload };
    case "SET_PASSWORD":
      return { ...state, password: action.payload };
    default:
      return state;
  }
}

export default function Signup() {
  const [formData, dispatch] = useReducer(formReducer, initialFormData);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const { user } = useAuth();
  const { mutate: signup, isError, error, isSuccess } = useSignup();
  const naviagte = useNavigate();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch({
      type: `SET_${name.toUpperCase()}` as ActionType["type"],
      payload: value,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      startTransition(() => {
        naviagte("/login");
      });
    }
    if (user) {
      startTransition(() => {
        naviagte("/");
      });
    }
  }, [isSuccess]);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signup(formData);
  };

  return (
    <Box
      sx={{
        height: "93vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #2c3e50 40%, #3498db 90%)",
        padding: 2,
      }}
    >
      <Card
        sx={{
          p: 3,
          boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.2)",
          borderRadius: "16px",
          maxWidth: 400,
          width: "100%",
          backgroundColor: "#fff",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          sx={{
            fontWeight: "bold",
            color: "#3f51b5",
            mb: 1,
          }}
        >
          Create an Account
        </Typography>
        <Typography
          variant="body2"
          gutterBottom
          align="center"
          sx={{ color: "#757575", mb: 2 }}
        >
          Please fill the form to sign up
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            sx={{
              mb: 1,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderRadius: "12px",
                },
              },
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            sx={{
              mb: 1,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderRadius: "12px",
                },
              },
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Full Name"
            name="fullname"
            value={formData.fullName}
            onChange={handleChange}
            sx={{
              mb: 1,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderRadius: "12px",
                },
              },
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            type={showPassword ? "text" : "password"}
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            sx={{
              mb: 1,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderRadius: "12px",
                },
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    sx={{ color: "#757575" }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{
              mt: 2,
              p: 1,
              backgroundColor: "#3f51b5",
              borderRadius: "12px",
              fontWeight: "bold",
              fontSize: "16px",
              transition: "background-color 0.3s",
              "&:hover": {
                backgroundColor: "#303f9f",
              },
            }}
          >
            Sign Up
          </Button>
        </form>
        {isError && (
          <Typography
            variant="body2"
            color="error"
            align="center"
            sx={{ mt: 2 }}
          >
            {error.msg || "Login failed. Please try again."}
          </Typography>
        )}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 1,
          }}
        >
          <Typography variant="body2" sx={{ color: "#757575", mr: 1 }}>
            Already have an account?
          </Typography>
          <Link
            component={RouterLink}
            to="/login"
            sx={{
              fontWeight: "bold",
              color: "#3f51b5",
              textDecoration: "none",
            }}
          >
            Go to login
          </Link>
        </Box>
      </Card>
    </Box>
  );
}
