import React from "react";
import Table from "@mui/joy/Table";

const CustomTable = ({ columns, rows, rowMenu }) => {
  return (
    <Table
      aria-labelledby="tableTitle"
      stickyHeader
      hoverRow
      size="sm"
      sx={{
        "--TableCell-headBackground": "var(--joy-palette-background-level1)",
        "--Table-headerUnderlineThickness": "1px",
        "--TableRow-hoverBackground": "var(--joy-palette-background-level1)",
        "--TableCell-paddingY": "4px",
        "--TableCell-paddingX": "12px",
      }}
    >
      <thead>
        <tr>
          {columns.map((column) => (
            <th
              key={column.field}
              style={{ width: column.width, padding: "12px" }}
            >
              {column.headerName}
            </th>
          ))}
          {rowMenu ? <th style={{ width: 50 }}></th> : null}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index}>
            {columns.map((column) => (
              <td
                key={column.field}
                style={{
                  width: column.width,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "normal",
                  maxHeight: "4.8em",
                  lineHeight: "1.2em",
                }}
              >
                <div
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: "vertical",
                    whiteSpace: "normal",
                  }}
                >
                  {column.render
                    ? column.render(row[column.field])
                    : row[column.field]}
                </div>
              </td>
            ))}
            {rowMenu ? <td style={{ width: 50 }}>{rowMenu}</td> : null}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default CustomTable;
