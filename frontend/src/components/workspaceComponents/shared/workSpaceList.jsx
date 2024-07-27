import React from "react";
import Box from "@mui/joy/Box";
import Avatar from "@mui/joy/Avatar";
import Typography from "@mui/joy/Typography";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListDivider from "@mui/joy/ListDivider";

const renderField = (item, column) => {
  const value = item[column.field];
  return column.render ? column.render(item) : value;
};

const OrderList = ({
  columns,
  data,
  colMenu,
  colAvatar,
  colTitle,
  colAuthor,
  colDescription,
  colDate,
  colStatus
}) => {
  return (
    <Box>
      <Box 
      sx={{ 
      display: { xs: "block", sm: "none" } 
      }}>
        <List size="sm">
          {data.map((item) => (
            <React.Fragment key={item.id}>
              <ListItem
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  flexDirection: "row",
                  overflowX:'hidden',
                  paddng: '10px',
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
                        item,
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
                    <Box
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      whiteSpace: "normal",
                    }}
                    >
                      <Typography level="title-md">
                      {colTitle ?(
                        renderField(
                          item,
                          columns.find((col) => col.field === colTitle)
                        )):(<></>)}
                      </Typography>
                    </Box>
                    <Typography level="title-sm">
                    {colAuthor ?(
                      renderField(
                        item,
                        columns.find((col) => col.field === colAuthor)
                      )):(<></>)}
                    </Typography>
                    <Box
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      whiteSpace: "normal",
                    }}
                    >
                    <Typography level="body-xs">
                    {colDescription ?(
                      renderField(
                        item,
                        columns.find((col) => col.field === colDescription)
                      )):(<></>)}
                    </Typography>
                    </Box>
                    <Typography level="body-sm">
                    {colDate ?(
                      renderField(
                        item,
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
                        item,
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
                    <Box>
                    {colMenu ?(
                      renderField(
                        item,
                        columns.find((col) => col.field === colMenu)
                      )):(<></>)}
                    </Box>
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
