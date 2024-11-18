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
    "--ag-odd-row-background-color": colors.primary[300],
    "--ag-row-hover-color": colors.primary[200],
    "--ag-data-color": colors.primary[100],
    "--ag-foreground-color": colors.primary[100],
  };

  // Custom styles for the grid container to enable custom scrollbar
  const containerStyle = {
    height: "40rem",
    width: "100%",
    ...gridTheme,
    // Add scrollbar styling
    overflow: "hidden", // This ensures the scrollbar styling applies properly
  };

  // Add custom CSS for the scrollbar
  const customScrollbarStyles = `
    .ag-theme-quartz ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    .ag-theme-quartz ::-webkit-scrollbar-track {
      background: ${colors.primary[400]};
    }

    .ag-theme-quartz ::-webkit-scrollbar-thumb {
      background: ${colors.greenAccent[500]};
      border-radius: 4px;
    }

    .ag-theme-quartz ::-webkit-scrollbar-thumb:hover {
      background: ${colors.greenAccent[400]};
    }

    /* For Firefox */
    .ag-theme-quartz {
      scrollbar-width: thin;
      scrollbar-color: ${colors.greenAccent[500]} ${colors.primary[400]};
    }

    /* Ensure the grid body has the same scrollbar styling */
    .ag-theme-quartz .ag-body-horizontal-scroll,
    .ag-theme-quartz .ag-body-vertical-scroll {
      scrollbar-width: thin;
      scrollbar-color: ${colors.greenAccent[500]} ${colors.primary[400]};
    }
  `;

  return (
    <>
      <style>{customScrollbarStyles}</style>
      <div className="ag-theme-quartz" style={containerStyle}>
        <AgGridReact
          rowData={rows}
          columnDefs={columns}
          selection={selection}
          selectionColumnDef={selectionColumnDef}
          onSelectionChanged={onSelectionChanged}
          // Additional props to ensure proper scrolling behavior
          suppressHorizontalScroll={false}
          suppressVerticalScroll={false}
        />
      </div>
    </>
  );
};

export default ProjectGrid;
