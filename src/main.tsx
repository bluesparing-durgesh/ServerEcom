import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, createTheme } from '@mui/material/styles';


const queryClient = new QueryClient();

const theme = createTheme({
  // Customize your theme here if needed
});
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
   
      </QueryClientProvider>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
);
