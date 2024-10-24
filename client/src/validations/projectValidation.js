import * as Yup from "yup";

/// Reference https://yup-docs.vercel.app/docs/schema
/// Claude.AI prompt: "Can you help make yup form validation schema for react app form"
const projectSchema = Yup.object().shape({
  projectName: Yup.string()
    .matches(/^[a-zA-Z0-9\s]+$/, "Only letters and spaces are allowed")
    .max(100, "must not exceed 100 characters")
    .required("required"),
  assignedTo: Yup.string()
    .matches(/^[a-zA-Z\s]+$/, "Only letters and spaces are allowed")
    .max(50, "must not exceed 50 characters")
    .required("required"),
  caseId: Yup.string()
    .matches(/^[a-zA-Z0-9]+$/, "Only letters and numbers are allowed")
    .max(50, "must not exceed 50 characters")
    .required("required"),
  dataClassification: Yup.string()
    .matches(/^[a-zA-Z0-9\s]+$/, "Only letters and spaces are allowed")
    .max(50, "must not exceed 50 characters")
    .required("required"),
  projectStatus: Yup.string()
    .matches(
      /^[a-zA-Z\s]+$/,
      "Task Status Error: Only letters and spaces are allowed"
    )
    .max(20, "must not exceed 20 characters")
    .required("required"),

  dateCreated: Yup.date()
    .default(() => new Date())
    .required("Start date is required"),

  quickBaseLink: Yup.string()
    .matches(/^[a-zA-Z0-9]+$/, "Only letters and numbers are allowed")
    .max(100, "must not exceed 100 characters")
    .required("required"),
  projectStatus: Yup.string()
    .matches(/^[a-zA-Z\s]+$/, "Only letters and spaces are allowed")
    .max(20, "must not exceed 20 characters")
    .required("required"),

  projectDesc: Yup.string()
    .matches(
      /^[a-zA-Z0-9\s.,!?()-]+$/,
      "Only alphanumeric characters, spaces, and basic punctuation are allowed"
    )
    .max(500, "must not exceed 500 characters")
    .required("required"),
});

export default projectSchema;
