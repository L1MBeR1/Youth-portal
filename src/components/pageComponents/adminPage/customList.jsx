import React from "react";
import Box from "@mui/joy/Box";
import Avatar from "@mui/joy/Avatar";
import Typography from "@mui/joy/Typography";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListDivider from "@mui/joy/ListDivider";

const renderField = (item, column) => {
  const value = item[column.field];
  return column.render ? column.render(value) : value;
};

const OrderList = ({
  columns,
  rows,
  rowMenu,
  colAvatar,
  colTitle,
  colAuthor,
  colDescription,
  colDate,
  colStatus
}) => {
  return (
    <Box>
      <Box sx={{ display: { xs: "block", sm: "none" } }}>
        <List size="sm">
          {rows.map((row) => (
            <React.Fragment key={row.id}>
              <ListItem
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  flexDirection: "row",
                  p: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "10px",
                  }}
                >
                  {colAvatar ? (
                    <Avatar variant="outlined" size="sm">
                      {colAvatar ?(
                        renderField(
                        row,
                        columns.find((col) => col.field === colAvatar)
                      )):(<></>)}

                    </Avatar>
                  ) : (
                    <></>
                  )}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "3px",
                    }}
                  >
                    <Typography level="title-md">
                    {colTitle ?(
                      renderField(
                        row,
                        columns.find((col) => col.field === colTitle)
                      )):(<></>)}
                    </Typography>
                    <Typography level="title-sm">
                    {colAuthor ?(
                      renderField(
                        row,
                        columns.find((col) => col.field === colAuthor)
                      )):(<></>)}
                    </Typography>
                    <Typography level="body-xs">
                    {colDescription ?(
                      renderField(
                        row,
                        columns.find((col) => col.field === colDescription)
                      )):(<></>)}
                    </Typography>
                    <Typography level="body-sm">
                    {colDate ?(
                      renderField(
                        row,
                        columns.find((col) => col.field === colDate)
                      )):(<></>)}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                    }}
                  >
                    <Box>
                    {colStatus ?(
                      renderField(
                        row,
                        columns.find((col) => col.field === colStatus)
                      )):(<></>)}
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        width: "fit-content",
                        justifySelf: "center",
                      }}
                    >
                      {rowMenu}
                    </Box>
                  </Box>
                </Box>
              </ListItem>
              <ListDivider />
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default OrderList;
