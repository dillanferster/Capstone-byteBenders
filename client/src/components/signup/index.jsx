// Author: gg-vu2804
// Source: Admin Dashboard Youtube Tutorial

import { useState } from "react";
import { Formik } from "formik";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  Box,
  Button,
  TextField,
  IconButton,
  InputAdornment,
  Typography,
} from "@mui/material";
import { Label, Visibility, VisibilityOff } from "@mui/icons-material"; // Import visibility icons
import * as yup from "yup";

export default function SignUp({ handleSubmit }) {
  const isNonMobile = useMediaQuery("(min-width:600px)");
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
        role: "User",
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
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? "span 2" : "span 4" },
            }}
          >
            <TextField
              margin="normal"
              type="text"
              label="First Name"
              name="fname"
              onBlur={handleBlur}
              onChange={(e) => setFieldValue("fname", e.target.value)} // Use setFieldValue to handle input
              variant="filled"
              value={values.fname} // Controlled input
              error={!!touched.fname && !!errors.fname}
              helperText={
                touched.fname && errors.fname ? (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: errors.fname.replace(/\n/g, "<br/>"),
                    }}
                  />
                ) : (
                  ""
                )
              }
              sx={{
                gridColumn: "span 2",
                // *** POTENTIAL FIX FOR FLOATING LABEL COLOR ***
                // "& .MuiInputLabel-root.Mui-focused": {
                //   color: "white",
                // },
              }}
            />
            <TextField
              margin="normal"
              type="text"
              // fullWidth
              label="Last Name"
              name="lname"
              onBlur={handleBlur}
              onChange={(e) => setFieldValue("lname", e.target.value)} // Use setFieldValue to handle input
              variant="filled"
              value={values.lname} // Controlled input
              error={!!touched.lname && !!errors.lname}
              helperText={
                touched.lname && errors.lname ? (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: errors.lname.replace(/\n/g, "<br/>"),
                    }}
                  />
                ) : (
                  ""
                )
              }
              sx={{ gridColumn: "span 2" }}
            />
            <TextField
              margin="normal"
              // fullWidth
              label="Email"
              name="email"
              type="email"
              onBlur={handleBlur}
              onChange={(e) => setFieldValue("email", e.target.value)} // Use setFieldValue to handle input
              variant="filled"
              value={values.email} // Controlled input
              error={!!touched.email && !!errors.email}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: "span 4" }}
            />

            {/* TO FIX : ROLE DOES NOT WORK IF NOT CLICKED ON DURING REGISTRATION - WORKS CURRENTLY BUT CHANGING initialValues ADDS THAT ONE TO DATABASE NOT OUR DROPDOWN VALUES */}
            <TextField
              margin="normal"
              label="Role"
              name="role"
              select
              defaultValue="User"
              value={values.role}
              slotProps={{
                select: {
                  native: true,
                },
              }}
              onBlur={handleBlur}
              onChange={(e) => setFieldValue("role", e.target.value)}
              variant="filled"
              error={!!touched.role && !!errors.role}
              helperText={touched.role && errors.role}
              sx={{ gridColumn: "span 4" }}
            >
              <option key="user" value="user">
                User
              </option>
              <option key="admin " value="admin">
                Admin
              </option>
            </TextField>
            <TextField
              margin="normal"
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"} // Toggle between 'text' and 'password'
              onBlur={handleBlur}
              onChange={(e) => setFieldValue("password", e.target.value)} // Use setFieldValue to handle input
              variant="filled"
              value={values.password} // Controlled input
              error={!!touched.password && !!errors.password}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
              slotProps={{
                input: {
                  // Add the visibility toggle icon
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>
          <Box display="flex" justifyItems="end" mt="20px">
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="warning"
              sx={{
                marginTop: 3,
                marginBottom: 2,
              }}
              disabled={isSubmitting}
            >
              Create User Account
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
}

// Validation schema with password rules
const checkoutSchema = yup.object().shape({
  fname: yup
    .string()
    .required("First name is required")
    .matches(
      /^[A-Za-z]+(?: [A-Za-z]+)*$/,
      "- Only letters allowed.\n- No double spacing"
    )
    .min(2, "Must be at least 2 characters")
    .max(50, "Must be less than 50 characters"),
  lname: yup
    .string()
    .required("Last name is required")
    .matches(
      /^[A-Za-z]+(?: [A-Za-z]+)*$/,
      "- Only letters allowed.\n- No double spacing"
    )
    .min(2, "Must be at least 2 characters")
    .max(50, "Must be less than 50 characters"),
  email: yup
    .string()
    .email("Invalid email. Use the format: example@example.com")
    .required("Email is required")
    .max(50, "Must be less than 50 characters")
    .min(5, "Must be at least 5 characters"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Must be at least 8 characters")
    .matches(/^(?=.*[A-Za-z])(?=.*\d)/, "Must contain both letters and numbers")
    .matches(
      /^[A-Za-z\d@^$!%*?&,.-]+$/,
      "Only use letters, numbers, or these special characters: @ ^ $ ! % * ? & , . -"
    ),
  role: yup.string().required("Role is required"),
});
