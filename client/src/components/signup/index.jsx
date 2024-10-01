// Author: gg-vu2804
// Source: Admin Dashboard Youtube Tutorial

import { useState } from "react";
import { Formik } from "formik";
import {
  Box,
  Button,
  TextField,
  IconButton,
  InputAdornment,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material"; // Import visibility icons
import * as yup from "yup";

export default function SignUp({ handleSubmit }) {
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  // Toggle password visibility
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Formik
      initialValues={{
        fname: "",
        lname: "",
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
            type="text"
            fullWidth
            label="First Name"
            name="fname"
            onBlur={handleBlur}
            onChange={(e) => setFieldValue("fname", e.target.value)} // Use setFieldValue to handle input
            variant="outlined"
            value={values.fname} // Controlled input
            error={!!touched.fname && !!errors.fname}
            helperText={touched.fname && errors.fname}
            required
          />
          <TextField
            margin="normal"
            type="text"
            fullWidth
            label="Last Name"
            name="lname"
            onBlur={handleBlur}
            onChange={(e) => setFieldValue("lname", e.target.value)} // Use setFieldValue to handle input
            variant="outlined"
            value={values.lname} // Controlled input
            error={!!touched.lname && !!errors.lname}
            helperText={touched.lname && errors.lname}
            required
          />
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ marginTop: 3, marginBottom: 2 }}
            disabled={isSubmitting}
          >
            Create Account
          </Button>
        </form>
      )}
    </Formik>
  );
}

// Validation schema with password rules
const checkoutSchema = yup.object().shape({
  fname: yup.string().required("First name is required"),
  lname: yup.string().required("Last name is required"),
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
