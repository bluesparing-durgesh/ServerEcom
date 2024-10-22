import Sidebar from "./Sidebar";

import { Outlet } from "react-router-dom";
import AdminHeader from "../Common/Header/AdminHeader";

const AdminWrapper = () => {

  return (
    <div
      style={{
        position: "relative",
        background: "linear-gradient(315deg, #2234ae 0%, #191714 74%)",
      }}
    >
      <AdminHeader />
      <div style={{ display: "flex", height: "100vh" }}>
        <Sidebar  />
        <div
          style={{
            flex: 1,
            padding: "16px",
            overflow: "auto",
            transition: "margin-left 0.3s ease",
          }}
          className="scrollable-content"
        >
           <Outlet/>
        </div>
      </div>
    </div>
  );
};

export default AdminWrapper;
