import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import FolderIcon from "@mui/icons-material/Folder";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BarChartIcon from "@mui/icons-material/BarChart";
import NoteIcon from "@mui/icons-material/Note"; // <-- Add this line
import logo from "../../assets/images/logo.png"; // <-- Import the logo

// nav menu items
import { menuItems } from "../../pages/pageData.js";

const iconMap = {
  HomeIcon,
  FolderIcon,
  AssignmentIcon,
  BarChartIcon,
  NoteIcon,
};

const SideNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <Box sx={{ width: 240 }}>
      <Toolbar />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px", // Adjust the margin as needed
        }}
      >
        {/* Add Logo
        <img src={logo} alt="Planzo Logo" style={{ width: "200px" }} /> */}
      </Box>
      <List>
        {menuItems.map((item) => {
          const IconComponent = iconMap[item.icon];
          return (
            <ListItem
              button="true"
              key={item.text}
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
            >
              <ListItemIcon>
                <IconComponent />
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          {isSmallScreen && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
          )}
          {/* If you want the logo in the AppBar as well */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginRight: "10px",
            }}
          >
            <img src={logo} alt="Planzo Logo" style={{ width: "80px" }} />
          </Box>
          <Typography variant="h6" noWrap component="div">
            Planzo
          </Typography>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { sm: 240 }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant={isSmallScreen ? "temporary" : "permanent"}
          open={isSmallScreen ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>
    </>
  );
};

export default SideNavbar;
