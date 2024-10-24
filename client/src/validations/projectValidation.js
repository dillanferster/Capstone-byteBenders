import * as Yup from "yup";

/// Reference https://yup-docs.vercel.app/docs/schema
/// Claude.AI prompt: "Can you help make yup form validation schema for react app form"
const projectSchema = Yup.object().shape({
  projectName: Yup.string()
    .matches(/^[a-zA-Z0-9\s]+$/, "Only letters and spaces are allowed")
    .max(100, " Task name must not exceed 100 characters")
    .required("Task name is required"),
  assignedTo: Yup.string()
    .matches(
      /^[a-zA-Z\s]+$/,
      "Assigned To Error: Only letters and spaces are allowed"
    )
    .max(50, "Assigned to must not exceed 50 characters")
    .required("Assigned to is required"),
  caseId: Yup.string()
    .matches(/^[a-zA-Z0-9]+$/, "Only letters and numbers are allowed")
    .max(50, "Assigned to must not exceed 50 characters")
    .required("Assigned to is required"),
  dataClassification: Yup.string()
    .matches(
      /^[a-zA-Z\s]+$/,
      "Assigned To Error: Only letters and spaces are allowed"
    )
    .max(50, "Assigned to must not exceed 50 characters")
    .required("Assigned to is required"),
  projectStatus: Yup.string()
    .matches(
      /^[a-zA-Z\s]+$/,
      "Task Status Error: Only letters and spaces are allowed"
    )
    .max(20, "Task status must not exceed 20 characters")
    .required("Task status is required"),

  dateCreated: Yup.date()
    .default(() => new Date())
    .required("Start date is required"),

  quickBaseLink: Yup.string()
    .matches(/^[a-zA-Z0-9]+$/, "Only letters and numbers are allowed")
    .max(100, "Project task must not exceed 100 characters")
    .required("Project task is required"),
  projectStatus: Yup.string()
    .matches(/^[a-zA-Z\s]+$/, "Only letters and spaces are allowed")
    .max(20, "Project status must not exceed 20 characters")
    .required("Project status is required"),

  projectDesc: Yup.string()
    .matches(
      /^[a-zA-Z0-9\s.,!?()-]+$/,
      "Only alphanumeric characters, spaces, and basic punctuation are allowed"
    )
    .max(500, "Task description must not exceed 500 characters")
    .required("Task description is required"),
});

export default projectSchema;
