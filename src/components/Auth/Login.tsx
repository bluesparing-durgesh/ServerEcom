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
import { IloginPayload } from "../../utils/statuses";
import { useLogin } from "../../Hook/useAuthHook";
import { useAuth } from "../../context/AuthContext";

// Action type for dispatching actions to reducer
type ActionType = {
  type: "SET_USERNAME" | "SET_PASSWORD";
  payload: string;
};

// Initial form data for the login form
const initialFormData: IloginPayload = {
  username: "",
  password: "",
};

// Reducer function to handle form state updates
function formReducer(state: IloginPayload, action: ActionType): IloginPayload {
  switch (action.type) {
    case "SET_USERNAME":
      return { ...state, username: action.payload };
    case "SET_PASSWORD":
      return { ...state, password: action.payload };
    default:
      return state;
  }
}

export default function Login() {
  const [formData, dispatch] = useReducer(formReducer, initialFormData);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const { mutate: login, isError, error, data } = useLogin();
  const { login: contextLogin } = useAuth();

  const naviagte = useNavigate();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch({
      type: `SET_${name.toUpperCase()}` as ActionType["type"],
      payload: value,
    });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const at = data?.accessToken;
    const rt = data?.refreshToken;
    const user = data?.user;
    if (!!at && !!rt && !!user) {
      contextLogin(at, rt, user);
      if (data.user.role === "user") {
        startTransition(() => {
          naviagte("/");
        });
      } else {
        startTransition(() => {
          naviagte("/admin/dashboard");
        });
      }
    }
  }, [data?.accessToken]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <Box
      sx={{
        height: "95vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #2c3e50 40%, #3498db 90%)",
        padding: 1,
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
          Login
        </Typography>
        <Typography
          variant="body2"
          gutterBottom
          align="center"
          sx={{ color: "#757575", mb: 3 }}
        >
          Enter your credentials to login
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
              mb: 2,
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
              mb: 2,
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
              mt: 3,
              p: 1.5,
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
            login
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
            mt: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: "#757575", mr: 1 }}>
            Don't have an account?
          </Typography>
          <Link
            component={RouterLink}
            to="/signup"
            sx={{
              fontWeight: "bold",
              color: "#3f51b5",
              textDecoration: "none",
            }}
          >
            Sign up here
          </Link>
        </Box>
      </Card>
    </Box>
  );
}
