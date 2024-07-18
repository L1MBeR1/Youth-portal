import React, { useEffect, useState } from 'react';

import Box from '@mui/joy/Box';
import Chip from '@mui/joy/Chip';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Sheet from '@mui/joy/Sheet';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';

import SearchIcon from '@mui/icons-material/Search';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';

import CustomTable from './customTable.jsx';
import CustomList from './customList.jsx';
import Pagination from './pagination.jsx';

import {getPodcastsByPage } from '../../../api/podcastsApi.js';
import { getCookie } from '../../../cookie/cookieUtils.js';

const fetchPodcasts = async (token, page, setFunc,setLastPage) => {
  try {
    const response = await getPodcastsByPage(token, page);
    console.log(response);
    if (response) {
      setFunc(response.data);
      setLastPage(response.message.last_page)
    } else {
      console.error('Fetched data is not an array:', response);
    }
  } catch (error) {
    console.error('Fetching blogs failed', error);
  }
};

const getStatus = (status) => {
  switch (status) {
    case 'moderating':
      return <Chip color="warning" size="sm" variant="soft">На проверке</Chip>;
    case 'published':
      return <Chip color="success" size="sm" variant="soft">Опубликован</Chip>;
    case 'archived':
      return <Chip color="neutral" size="sm" variant="soft">Заархивирован</Chip>;
    case 'pending':
      return <Chip color="danger" size="sm" variant="soft">На доработке</Chip>;
    default:
      return <Chip size="sm">{status}</Chip>;
  }
};

const renderFilters = (fromDate, setFromDate, toDate, setToDate, status, setStatus) => (
  <React.Fragment>
    <FormControl size="sm">
      <FormLabel>От</FormLabel>
      <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
    </FormControl>
    <FormControl size="sm">
      <FormLabel>До</FormLabel>
      <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
    </FormControl>
    <FormControl size="sm">
      <FormLabel>Статус</FormLabel>
      <Select size="sm" value={status} onChange={(e, newValue) => setStatus(newValue)} placeholder="Фильтр по статусу">
        <Option value="moderating">На проверке</Option>
        <Option value="published">Опубликован</Option>
        <Option value="archived">Заархивирован</Option>
        <Option value="pending">На доработке</Option>
      </Select>
    </FormControl>
  </React.Fragment>
);

function PodcastsSection() {
  const [openPodcast, setOpenPodcast] = useState(false);

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState();
  const [podcasts, setPodcasts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const token = getCookie('token');
    fetchPodcasts(token, page, setPodcasts,setLastPage);
  }, [page]);

  function RowMenu() {
    return (
      <Dropdown>
        <MenuButton
          slots={{ root: IconButton }}
          slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
        >
          <MoreVertIcon />
        </MenuButton>
        <Menu size="sm" sx={{ minWidth: 140 }}>
          <MenuItem onClick={() => setOpenPodcast(true)}>Просмотреть</MenuItem>
          <MenuItem>Изменить</MenuItem>
        </Menu>
      </Dropdown>
    );
  }
  const clearFilters = () => {
    setStatus('');
    setToDate('');
    setFromDate('');
    setSearchTerm('');
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: '80px' },
    { field: 'author', headerName: 'Автор', width: '140px', render: (value) => value.last_name + ' ' + value.first_name + ' ' + value.patronymic },
    { field: 'nickname', headerName: 'Никнейм', width: '120px' },
    { field: 'title', headerName: 'Название', width: '200px' },
    { field: 'description', headerName: 'Описание', width: '200px', render: (value) => value.desc },
    { field: 'created_at', headerName: 'Дата создания', width: '90px', render: (value) => new Date(value).toLocaleDateString() },
    { field: 'status', headerName: 'Статус', width: '120px', render: getStatus },
  ];

  const rows = podcasts.map((podcast) => ({
    ...podcast,
    author: { last_name: podcast.last_name, first_name: podcast.first_name, patronymic: podcast.patronymic },
  }));
  return (
    <> 
        <Modal
        aria-labelledby="close-modal-title"
        open={openPodcast}
        onClose={() => {
          setOpenPodcast(false);
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ModalDialog>
          <EditIcon/>
          <ModalClose variant="outlined" />
          <Typography
            component="h2"
            id="close-modal-title"
            level="h4"
            textColor="inherit"
            fontWeight="lg"
          >
            Modal title
          </Typography>
          </ModalDialog>
      </Modal>
      <Typography  fontWeight={700} fontSize={30}>
           Подкасты
      </Typography>
      <Box
        sx={{
          borderRadius: 'sm',
          display: { xs: 'none', sm: 'flex' },
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          gap: 1.5,
        }}
      >
        <FormControl sx={{ flex: 1 }} size="sm">
          <FormLabel>Поиск по названию или автору</FormLabel>
          <Input
            size="sm"
            placeholder="Search"
            startDecorator={<SearchIcon />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </FormControl>
        {renderFilters(fromDate, setFromDate, toDate, setToDate, status, setStatus)}

        <IconButton variant='outlined'
          onClick={clearFilters}
          color="danger"
          sx={{
            "--IconButton-size": "32px",
          }}
        >
          <SearchOffIcon />
        </IconButton>
      </Box>
      <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          display: { xs: 'none', sm: 'flex' },
          flexGrow: '1',
          borderRadius: 'sm',
          overflow: 'auto',
          maxHeight: '100%',
        }}
      >
        <CustomTable 
        columns={columns} 
        rows={rows}
        rowMenu={RowMenu()}
        />
      </Sheet>
      <CustomList 
        columns={columns} 
        rows={rows}
        rowMenu={RowMenu()}
        colTitle={'title'}
        colAuthor={'author'}
        colDescription={'description'}
        colDate={'created_at'}
        colStatus={'status'}
        />
      <Pagination page={page} lastPage={lastPage} onPageChange={setPage} />
    </>
  );
}

export default PodcastsSection;
