// import { verifyUser } from "../../api.js";
import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  IconButton,
  InputAdornment,
  Typography,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Visibility, VisibilityOff } from "@mui/icons-material"; // Import visibility icons
import * as yup from "yup";
import { Formik } from "formik";

export default function Login({ handleSubmit }) {
  // const [user, setUser] = useState({
  //   email: "",
  //   password: "",
  // });

  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  // const navigate = useNavigate();

  // async function handleSubmit(e) {
  //   e.preventDefault();
  //   try {
  //     let tokenValue = await verifyUser(user);
  //     console.log("Token received from backend:", tokenValue); // Gigi Debug log for token authentication -> remove before production
  //     if (tokenValue) {
  //       sessionStorage.setItem("User", tokenValue);
  //       axios.defaults.headers.common["Authorization"] = `Bearer ${tokenValue}`; // Bearer = authentication token formatting
  //       navigate("/home");
  //     } else {
  //       alert("Login failed");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // Toggle password visibility
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      validationSchema={checkoutSchema}
      onSubmit={handleSubmit} // Custom handleSubmit passed from props
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        isSubmitting,
      }) => (
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            margin="normal"
            fullWidth
            label="Email"
            name="email"
            type="email"
            onBlur={handleBlur}
            onChange={(e) => setFieldValue("email", e.target.value)} // Use setFieldValue to handle input
            variant="outlined"
            value={values.email} // Controlled input
            error={!!touched.email && !!errors.email}
            helperText={touched.email && errors.email}
            required
          />
          <TextField
            margin="normal"
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"} // Toggle between 'text' and 'password'
            onBlur={handleBlur}
            onChange={(e) => setFieldValue("password", e.target.value)} // Use setFieldValue to handle input
            variant="outlined"
            value={values.password} // Controlled input
            error={!!touched.password && !!errors.password}
            helperText={touched.password && errors.password}
            required
            InputProps={{
              // Add the visibility toggle icon
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ marginTop: 3, marginBottom: 2 }}
              disabled={isSubmitting}
            >
              Login
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
}

// Validation schema with password rules
const checkoutSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email. (example@example.com)")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain letters and numbers"
    )
    .required("Password is required"),
});
