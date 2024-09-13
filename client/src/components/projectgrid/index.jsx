import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Container } from "@mui/material";
import { useState, useEffect } from "react";

/// columns for MUI datagrid
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
    field: "dateCreated",
    headerName: "Date",
    description: "This column has a value getter and is not sortable.",
    sortable: true,
    width: 160,
  },
];
///

export default function ProjectGrid({ projects, isloading }) {
  // projects object array from the database is passed into grid from project page
  // rows maps the project list to the corresponding fields that match to the MUI columns for the datagrid component, rows is then passed into the datagrid component
  const rows = projects.map((project) => {
    return {
      id: project._id,
      projectName: project.projectName,
      projectDesc: project.projectDesc,
      assignedTo: project.assignedTo,
      dateCreated: project.dateCreated,
    };
  });

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
          loading={isloading}
          slotProps={{
            loadingOverlay: {
              variant: "skeleton",
              noRowsVariant: "skeleton",
            },
          }}
          checkboxSelection="true"
        />
      </Box>
    </Container>
  );
}
