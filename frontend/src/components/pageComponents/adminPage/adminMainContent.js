import React, { useEffect, useState } from 'react';

import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Checkbox from '@mui/joy/Checkbox';
import Chip from '@mui/joy/Chip';
import Link from '@mui/joy/Link';
import Sheet from '@mui/joy/Sheet';
import Table from '@mui/joy/Table';
import Typography from '@mui/joy/Typography';

import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import BlockIcon from '@mui/icons-material/Block';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import { getBlogs } from '../../../api/adminApi';
import { getCookie } from '../../../cookie/cookieUtils';

const tryDB = async (setBlogs) => {
  try {
    const token = getCookie('token');
    const response = await getBlogs(token);
    console.log(response);
    if (response) {
      setBlogs(response);
    } else {
      console.error('Fetched data is not an array:', response);
    }
  } catch (error) {
    console.error('Fetching blogs failed', error);
  }
};

function AdminMainComponent() {
  const [blogs, setBlogs] = useState([]);
  const [selected, setSelected] = useState([]);
  const [order, setOrder] = useState('asc');

  useEffect(() => {
    tryDB(setBlogs);
  }, []);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = blogs.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const newSelected = selected.includes(id)
      ? selected.filter(item => item !== id) 
      : [...selected, id]; 
  
    setSelected(newSelected); 
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  return (
    <Sheet
      className="OrderTableContainer"
      variant="outlined"
      sx={{
        display: { xs: 'none', sm: 'initial' },
        width: '100%',
        borderRadius: 'sm',
        overflowY: 'scroll',
        maxHeight: '100%',
      }}
    >
      <Table
        aria-labelledby="tableTitle"
        stickyHeader
        hoverRow
        sx={{
          '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
          '--Table-headerUnderlineThickness': '1px',
          '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',
          '--TableCell-paddingY': '4px',
          '--TableCell-paddingX': '8px',
        }}
      >
        <thead>
          <tr>
            <th style={{ width: 48, textAlign: 'center', padding: '12px 6px' }}>
              <Checkbox
                size="sm"
                indeterminate={selected.length > 0 && selected.length !== blogs.length}
                checked={selected.length === blogs.length}
                onChange={handleSelectAllClick}
                color={
                  selected.length > 0 || selected.length === blogs.length
                    ? 'primary'
                    : undefined
                }
                sx={{ verticalAlign: 'text-bottom' }}
              />
            </th>
            <th style={{ width: 80, padding: '12px 6px' }}>
              <Link
                underline="none"
                color="primary"
                component="button"
                onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
                fontWeight="lg"
                endDecorator={<ArrowDropDownIcon />}
                sx={{
                  '& svg': {
                    transition: '0.2s',
                    transform:
                      order === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)',
                  },
                }}
              >
                ID
              </Link>
            </th>
            <th style={{ width: 140, padding: '12px 6px' }}>Автор</th>
            <th style={{ width: 140, padding: '12px 6px' }}>Никнейм</th>
            <th style={{ width: 240, padding: '12px 6px' }}>Название</th>
            <th style={{ width: 240, padding: '12px 6px' }}>Описание</th>
            <th style={{ width: 140, padding: '12px 6px' }}>Дата создания</th>
            <th style={{ width: 80, padding: '12px 6px' }}>Статус</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => {
            const isItemSelected = isSelected(blog.id);
            return (
              <tr key={blog.id}>
                <td style={{ textAlign: 'center', width: 48 }}>
                  <Checkbox
                    size="sm"
                    checked={isItemSelected}
                    color={isItemSelected ? 'primary' : undefined}
                    onChange={(event) => handleClick(event, blog.id)}
                    slotProps={{ checkbox: { sx: { textAlign: 'left' } } }}
                    sx={{ verticalAlign: 'text-bottom' }}
                  />
                </td>
                <td style={{ width: 80 }}>
                  <Typography level="body-xs">{blog.id}</Typography>
                </td>
                <td style={{ width: 140 }}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <div>
                      <Typography level="body-xs">{`${blog.last_name} ${blog.first_name} ${blog.patronymic}`}</Typography>
                    </div>
                  </Box>
                </td>
                <td style={{ width: 140 }}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <div>
                      <Typography level="body-xs">{blog.nickname}</Typography>
                    </div>
                  </Box>
                </td>
                <td style={{ width: 240 }}>
                  <Typography level="body-xs">{blog.title}</Typography>
                </td>
                <td style={{ width: 240 }}>
                  <Typography level="body-xs">{blog.description}</Typography>
                </td>
                <td style={{ width: 140 }}>
                  <Typography level="body-xs">{new Date(blog.created_at).toLocaleDateString()}</Typography>
                </td>
                <td style={{ width: 80 }}>
                  <Typography level="body-xs">{blog.status}</Typography>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Sheet>
  );
}

export default AdminMainComponent;
