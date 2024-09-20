import SideNavbar from "../sidenav";
import { Outlet } from "react-router-dom";

const Layout = () => {
  // navbar items array
  const menuItems = [
    { text: "Home", icon: "HomeIcon", path: "/home" },
    { text: "Projects", icon: "FolderIcon", path: "/project" },
    { text: "Tasks", icon: "AssignmentIcon", path: "/task" },
  ];

  return (
    <div>
      <SideNavbar menuItems={menuItems} />
      <Outlet />
    </div>
  );
};

export default Layout;
