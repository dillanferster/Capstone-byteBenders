import * as Yup from "yup";

/// Reference https://yup-docs.vercel.app/docs/schema
/// Claude.AI prompt: "Can you help make yup form validation schema for react app form"
const taskSchema = Yup.object().shape({
  taskName: Yup.string()
    .matches(
      /^[a-zA-Z0-9\s]+$/,
      "Only alphanumeric characters and spaces are allowed"
    )
    .max(100, "Task name must not exceed 100 characters")
    .required("Task name is required"),
  assignedTo: Yup.string()
    .matches(/^[a-zA-Z\s]+$/, "Only letters and spaces are allowed")
    .max(50, "Assigned to must not exceed 50 characters")
    .required("Assigned to is required"),
  taskStatus: Yup.string()
    .matches(/^[a-zA-Z\s]+$/, "Only letters and spaces are allowed")
    .max(20, "Task status must not exceed 20 characters")
    .required("Task status is required"),
  priority: Yup.string()
    .matches(/^[a-zA-Z]+$/, "Only letters are allowed")
    .max(10, "Priority must not exceed 10 characters")
    .required("Priority is required"),
  taskCategory: Yup.string()
    .matches(/^[a-zA-Z\s]+$/, "Only letters and spaces are allowed")
    .max(30, "Task category must not exceed 30 characters")
    .required("Task category is required"),
  startDate: Yup.date()
    .default(() => new Date())
    .required("Start date is required"),
  dueDate: Yup.date()
    .default(() => new Date())
    .min(Yup.ref("startDate"), "Due date must be after the start date")
    .required("Due date is required"),
  projectTask: Yup.string()
    .matches(
      /^[a-zA-Z0-9\s]+$/,
      "Only alphanumeric characters and spaces are allowed"
    )
    .max(100, "Project task must not exceed 100 characters")
    .required("Project task is required"),
  projectStatus: Yup.string()
    .matches(/^[a-zA-Z\s]+$/, "Only letters and spaces are allowed")
    .max(20, "Project status must not exceed 20 characters")
    .required("Project status is required"),
  addChronicles: Yup.number()
    .required("Number of chronicles is required")
    .positive("Must be a positive number")
    .integer("Must be an integer")
    .max(9999, "Number of chronicles must not exceed 9999"),
  taskDesc: Yup.string()
    .matches(
      /^[a-zA-Z0-9\s.,!?()-]+$/,
      "Only alphanumeric characters, spaces, and basic punctuation are allowed"
    )
    .max(500, "Task description must not exceed 500 characters")
    .required("Task description is required"),
  attachments: Yup.string()
    .matches(
      /^[a-zA-Z0-9\s.,_-]+$/,
      "Only alphanumeric characters, spaces, dots, commas, underscores, and hyphens are allowed"
    )
    .max(255, "Attachments must not exceed 255 characters")
    .required("Attachments are required"),
  chroniclesComplete: Yup.number()
    .required("Number of completed chronicles is required")
    .positive("Must be a positive number")
    .integer("Must be an integer")
    .max(Yup.ref("addChronicles"), "Cannot exceed total number of chronicles"),
});

export default taskSchema;
