import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Container } from "@mui/material";

export default function ProjectGrid({
  projects,
  isloading,
  rows,
  columns,
  setSelectedProject,
}) {
  const handleSelectionChange = (rowSelectionModel, details) => {
    // console.log("Selected row IDs:", rowSelectionModel);

    const selectedId = rowSelectionModel[0];

    const selected = rows.find((row) => selectedId === row.id);

    console.log("found row with matching id", selected);

    setSelectedProject(selected);
  };

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
          checkboxSelection
          onRowSelectionModelChange={handleSelectionChange}
        />
      </Box>
    </Container>
  );
}
