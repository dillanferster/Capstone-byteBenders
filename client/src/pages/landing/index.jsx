import { Button } from "@mui/material";
import CreateUser from "../../components/create-user/index.jsx";
import Login from "../../components/login/index.jsx";
import { useState } from "react";

export default function Landing() {
  // view == 0 --> Login
  // view == 1 --> Create User
  const [view, setView] = useState(0);

  return (
    <>
      {!view ? (
        <>
          <h1 className="text-xl">Login To Planzo</h1>
          <Login />
          <Button variant="text" onClick={() => setView(!view)}>
            Sign up here
          </Button>
        </>
      ) : (
        <>
          <h1>Sign Up</h1>
          <h2>Not yet a user? Create an account here!</h2>
          <CreateUser />
          <Button variant="text" onClick={() => setView(!view)}>
            Login here
          </Button>
        </>
      )}
    </>
  );
}
