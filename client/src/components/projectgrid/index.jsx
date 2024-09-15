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
  selectedId,
}) {
  

  //// handels MUI onrow selection change, passes in the id of grid item
  const handleSelectionChange = (rowSelectionModel, details) => {
    selectedId(rowSelectionModel);
   
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
