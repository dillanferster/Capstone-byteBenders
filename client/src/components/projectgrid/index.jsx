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
  return (
    <div
      className="ag-theme-quartz" // applying the Data Grid theme
      style={{ height: 500, width: 1000 }}
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
