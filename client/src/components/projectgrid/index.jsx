import * as React from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

function ProjectGrid({
  rows,
  columns,
  selection,
  selectionColumnDef,
  onSelectionChanged,
}) {
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
}

export default ProjectGrid;
