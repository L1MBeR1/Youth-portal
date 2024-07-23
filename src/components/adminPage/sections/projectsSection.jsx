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

import CustomTable from '../customTable.jsx';
import CustomList from '../customList.jsx';
import Pagination from '../pagination.jsx';
import useProjects from '../../../hooks/useProjects.js';


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

function ProjectsSection() {
  const [openProject, setOpenProject] = useState(false);

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [status, setStatus] = useState('');

  const { data: projects, isLoading, refetch  } = useProjects(page, setLastPage);
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
          <MenuItem onClick={() => setOpenProject(true)}>Просмотреть</MenuItem>
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
    { field: 'name', headerName: 'Название', width: '140px'},
    { field: 'description', headerName: 'Описание', width: '200px', render: (item) => item.description.desc },
    { field: 'author',headerName: 'Организатор', width: '140px', render: (item) => item.last_name + ' ' + item.first_name + ' ' + item.patronymic },
    { field: 'location', headerName: 'Адрес', width: '200px' },
    { field: 'created_at', headerName: 'Дата создания', width: '90px', render: (item) => new Date(item.created_at).toLocaleDateString() },
  ];

  return (
    <> 
        <Modal
        aria-labelledby="close-modal-title"
        open={openProject}
        onClose={() => {
          setOpenProject(false);
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
           Проекты
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
        data={projects}
        // rowMenu={RowMenu()}
        />
      </Sheet>
      <CustomList 
        columns={columns} 
        data={projects}
        // rowMenu={RowMenu()}
        colTitle={'name'}
        colAuthor={'author'}
        colDescription={'description'}
        colDate={'created_at'}
        />
        </>
      )}
      <Pagination page={page} lastPage={lastPage} onPageChange={setPage} />
    </>
  );
}

export default ProjectsSection;
