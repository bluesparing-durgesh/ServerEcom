import React, { useState } from "react";
import {
  Box,
  List,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Card,
} from "@mui/material";
import {
  Category,
  People,
  ChevronLeft,
  Dashboard,
  Menu,
} from "@mui/icons-material";

import { SidebarItem } from "../../utils/statuses";

import UploadFileIcon from "@mui/icons-material/UploadFile";
import { NavLink } from "react-router-dom";
export const sidebarItems: SidebarItem[] = [
  {
    id: "s1",
    title: "Dashboard",
    icon: <Dashboard sx={{ color: "white" }} />,
    link: "/admin/dashboard",
  },
  {
    id: "s2",
    title: "Manage Products",
    icon: <Category sx={{ color: "white" }} />,
    link: "/admin/product",
  },
  {
    id: "s3",
    title: "Manage Categories",
    icon: <Category sx={{ color: "white" }} />,
    link: "/admin/category",
  },
  {
    id: "s4",
    title: "Manage Users",
    icon: <People sx={{ color: "white" }} />,
    link: "/admin/user",
  },
  {
    id: "s5",
    title: "Manage Order",
    icon: <People sx={{ color: "white" }} />,
    link: "/admin/order",
  },
  {
    id: "s6",
    title: "Add Product Excel",
    icon: <UploadFileIcon sx={{ color: "white" }} />,
    link: "/admin/upload-excel",
  },
];

const Sidebar = () => {
  const [open, setOpen] = useState(true);

  const toggleSidebar = () => {
    setOpen((prev) => !prev);
  };

  return (
    <Card
      sx={{
        position: "sticky", // Fix the sidebar to the left
        top: 50,
        left: 0,
        bottom: 0,
        height: "88.2vh",
        background: "linear-gradient(315deg, #2234ae 0%, #191714 74%)",
        color: "white",
        zIndex: 4, // Ensure it stays on top
        display: "flex",
      }}
    >
      <Box sx={{ width: open ? 250 : 60, transition: "width 0.3s" }}>
        <IconButton onClick={toggleSidebar} sx={{ margin: "8px" }}>
          {open ? (
            <ChevronLeft sx={{ color: "white" }} />
          ) : (
            <Menu sx={{ color: "white" }} />
          )}
        </IconButton>
        <List>
          {sidebarItems.map((item) => (
            <React.Fragment key={item.title}>
              <NavLink
                to={item.link}
                className={({ isActive, isPending, isTransitioning }) =>
                  [
                    "nav-link",
                    isPending ? "pending" : "",
                    isActive ? "active" : "",
                    isTransitioning ? "transitioning" : "",
                  ].join(" ")
                }
              >
                <ListItemIcon className="list-item-icon">
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={open ? item.title : ""} />
              </NavLink>
              <Divider className="divider" />
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Card>
  );
};

export default Sidebar;
