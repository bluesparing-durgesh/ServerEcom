import { useLocation, useRoutes } from "react-router-dom";
import routeData from "./RouteHook";
import { useEffect, useState } from "react";


function OfflineFallback() {
  return (
    <div
      style={{ 
        padding: "40px", 
        background: "linear-gradient(135deg, #ff7675 0%, #d63031 100%)",
        color: "white",
        textAlign: "center",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Helvetica, Arial, sans-serif",
      }}>
      <h1>⚡ You’re Offline</h1>
      <p>It looks like you’ve lost your internet connection.</p>
      <p>Please check your connection and try again.</p>
      <button
        onClick={() => window.location.reload()}
        style={{ 
          padding: "12px 20px",
          background: "white",
          color: "#d63031",
          fontWeight: "bold",
          border: "none",
          borderRadius: "8px",
          boxShadow: "0 4px 14px rgb(0 0 0 / 0.4)", 
          cursor: "pointer",
          marginTop: "20px",
          transition: "all 0.3s ease-in-out",
        }}>
        Reload
      </button>
    </div>
  );
}




const App = () => {
  const content = useRoutes(routeData);
  const location = useLocation();
  const currentUrl = location.pathname;
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    function handleOnline() {
      setIsOffline(false);
    }

    function handleOffline() {
      setIsOffline(true);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (currentUrl !== "/admin") {
      sessionStorage.removeItem("AdminSidebar");
    }
  }, [currentUrl]);
  return isOffline ? <OfflineFallback /> : <>{content}</>;
 
};

export default App;
