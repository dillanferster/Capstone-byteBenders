import SideNavbar from "../sidenav";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Sidebar from "../../pages/global/sidebar";
import Topbar from "../../pages/global/topbar";

const Layout = () => {
  // navbar items array
  const menuItems = [
    { text: "Home", icon: "HomeIcon", path: "/home" },
    { text: "Projects", icon: "FolderIcon", path: "/project" },
    { text: "Tasks", icon: "AssignmentIcon", path: "/task" },
    { text: "Notes", icon: "NoteIcon", path: "/note" },
  ];

  // check if user is authenticated
  // if not, redirect to the login page
  let user = sessionStorage.getItem("User");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user]);

  return (
    <div>
      <Topbar />
      <Sidebar />
      {/* <SideNavbar menuItems={menuItems} /> */}
      <Outlet />
    </div>
  );
};

export default Layout;
