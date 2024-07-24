import React, { useEffect, useState } from 'react';

import Box from '@mui/joy/Box';
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

import CustomTable from '../customTable.jsx';
import CustomList from '../customList.jsx';
import Pagination from '../pagination.jsx';
import useEvents from '../../../hooks/useEvents.js';

import DatePopOver from '../modals/datePopOver.jsx';


function EventsSection() {
  const [openEvents, setOpenEvents] = useState(false);

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [status, setStatus] = useState('');
  const { data: events, isLoading, refetch  } = useEvents(['admin/events'],['admin'],page, setLastPage);

  const renderFilters = () => (
    <>
      <DatePopOver
      label={'Дата создания'}
      fromDate={fromDate}
      toDate={toDate}
      setFromDate={setFromDate}
      setToDate={setToDate}
      />
    </>
  );
  useEffect(() => {
    refetch();
  }, [page,refetch]);

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
          <MenuItem onClick={() => setOpenEvents(true)}>Просмотреть</MenuItem>
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
    { field: 'id', headerName: 'ID', width: '60px' },
    { field: 'name', headerName: 'Название', width: '140px'},
    { field: 'description', headerName: 'Описание', width: '200px', render: (item) => item.description.desc },
    { field: 'author',headerName: 'Организатор', width: '140px', render: (item) => item.last_name + ' ' + item.first_name + ' ' + item.patronymic },
    { field: 'location', headerName: 'Адрес', width: '200px' },
    { field: 'created_at', headerName: 'Дата создания', width: '90px', render: (item) => new Date(item.created_at).toLocaleDateString() },
    { field: 'start_time', headerName: 'Дата начала', width: '90px', render: (item) => new Date(item.start_time).toLocaleDateString() },
  ];

  return (
    <> 
        <Modal
        aria-labelledby="close-modal-title"
        open={openEvents}
        onClose={() => {
          setOpenEvents(false);
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
           Мероприятия
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
          <FormLabel>Поиск по названию или организатору</FormLabel>
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
      {isLoading?(
        <>
        </>

      ):(
        <>
      <Sheet
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
        data={events}
        rowMenu={RowMenu()}
        />
      </Sheet>
      <CustomList 
        columns={columns} 
        data={events}
        // rowMenu={RowMenu()}
        colTitle={'name'}
        colAuthor={'author'}
        colDescription={'description'}
        colDate={'start_time'}
        />
        </>
      )}
      <Pagination page={page} lastPage={lastPage} onPageChange={setPage} />
    </>
  );
}

export default EventsSection;
