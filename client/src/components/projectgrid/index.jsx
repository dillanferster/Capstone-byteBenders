/**
 * This page component displays the ag data grid
 *
 * destructs rows, column, selection, selectionColumnDef,  onSelectionChanged
 * Passes all of them into AgGrid as props
 *
 * Uses AG Grid component
 *
 * References:
 * https://www.ag-grid.com/react-data-grid/getting-started/
 * https://www.ag-grid.com/react-data-grid/row-selection/
 * https://www.ag-grid.com/react-data-grid/row-selection-multi-row/
 *
 */

import React from "react";
import { AgGridReact } from "ag-grid-react";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";

// AG grid default styling
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

const ProjectGrid = ({
  rows,
  columns,
  selection,
  selectionColumnDef,
  onSelectionChanged,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const gridTheme = {
    "--ag-background-color": colors.primary[400],
    // "--ag-header-background-color": colors.greenAccent[500],
    "--ag-odd-row-background-color": colors.primary[300],
    "--ag-row-hover-color": colors.primary[200],
    // // Text colors
    "--ag-data-color": colors.primary[100],
    "--ag-foreground-color": colors.primary[100], // Default text color
  };

  return (
    <div
      className="ag-theme-quartz" // applying the Data Grid theme
      style={{
        height: "40rem",
        width: "100%",
        ...gridTheme,
      }}
    >
      <AgGridReact
        rowData={rows}
        columnDefs={columns}
        selection={selection}
        selectionColumnDef={selectionColumnDef}
        onSelectionChanged={onSelectionChanged}
      ></AgGridReact>
    </div>
  );
};

export default ProjectGrid;
