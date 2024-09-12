import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Container } from "@mui/material";

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "projectName",
    headerName: "Project name",
    width: 150,
    editable: true,
  },
  {
    field: "projectDesc",
    headerName: "Project Desc",
    width: 150,
    editable: true,
  },
  {
    field: "assignedTo",
    headerName: "Assigned To",
    type: "string",
    width: 110,
    editable: true,
  },
  {
    field: "fullName",
    headerName: "Full name",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 160,
    valueGetter: (value, row) => `${row.firstName || ""} ${row.lastName || ""}`,
  },
];

const rows = [
  { id: 1, projectName: "Snow", projectDesc: "Jon", assignedTo: 14 },
  { id: 2, projectName: "Lannister", projectDesc: "Cersei", assignedTo: 31 },
  { id: 3, projectName: "Lannister", projectDesc: "Jaime", assignedTo: 31 },
];

export default function ProjectGrid() {
  return (
    <Container>
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    </Container>
  );
}
