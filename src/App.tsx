import { useLocation, useRoutes } from "react-router-dom";
import routeData from "./RouteHook";
import { useEffect } from "react";


const App = () => {
  const content = useRoutes(routeData);
  const location = useLocation();
  const currentUrl = location.pathname;
  useEffect(() => {
    if (currentUrl !== "/admin") {
      sessionStorage.removeItem("AdminSidebar");
    }
  }, [currentUrl]);
  return content;
};

export default App;
