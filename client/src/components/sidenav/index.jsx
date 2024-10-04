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
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import FolderIcon from "@mui/icons-material/Folder";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BarChartIcon from "@mui/icons-material/BarChart";
import NoteIcon from "@mui/icons-material/Note";
import logo from "../../assets/images/logo.png"; // <-- Import the logo
import EmailIcon from "@mui/icons-material/Email";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

// nav menu items
import { menuItems } from "../../pages/pageData.js";

const iconMap = {
  HomeIcon,
  FolderIcon,
  AssignmentIcon,
  BarChartIcon,
  NoteIcon,
  EmailIcon,
  PersonOutlinedIcon,
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
        {/* Add Logo */}
        <img src={logo} alt="Planzo Logo" style={{ width: "200px" }} />
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
      {/* Top Bar */}
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

          {/* Search bar */}
          <Box display="flex" backgroundColor="#f5f5f5" borderRadius="4px">
            <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
            <IconButton type="button" sx={{ p: 1 }}>
              <SearchIcon />
            </IconButton>
          </Box>

          {/* Icons */}
          <Box display="flex" ml="auto">
            <IconButton>
              <LightModeOutlinedIcon />
            </IconButton>
            <IconButton>
              <NotificationsOutlinedIcon />
            </IconButton>
            <IconButton>
              <SettingsOutlinedIcon />
            </IconButton>
            <IconButton>
              <PersonOutlinedIcon />
            </IconButton>
          </Box>
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
