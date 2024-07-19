import React, { useEffect, useState } from 'react';

import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Stack from '@mui/joy/Stack';
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import ListDivider from '@mui/joy/ListDivider';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import IconButton, { iconButtonClasses } from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';

import SearchIcon from '@mui/icons-material/Search';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import Add from '@mui/icons-material/Add';

import CustomTable from '../customTable.jsx';
import CustomList from '../customList.jsx';
import Pagination from '../pagination.jsx';

import WarningModal from '../modals/warningModal.jsx';
import AddModeratorModal from '../modals/addModeratorModal.jsx';
import SuccessNotification from '../modals/successNotification.jsx';

import {getModerators, deleteModerator,addModerator} from '../../../api/usersApi.js';
import { getCookie } from '../../../cookie/cookieUtils.js';
import useModerators from '../../../hooks/useModerators.js';
// const fetchModerators = async (page, setFunc,setLastPage) => {
//   try {
//     const token = getCookie('token');
//     const response = await getModerators(token, page);
//     console.log(response);
//     if (response) {
//       setFunc(response.data);
//       setLastPage(response.message.last_page)
//     } else {
//       console.error('Fetched data is not an array:', response);
//     }
//   } catch (error) {
//     console.error('Fetching moderators failed', error);
//   }
// };

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

function ModeratorsSection() {
  const [openModerator, setOpenModerator] = useState(false);

  const [deleteId, setDeleteId] = useState();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState();

  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [status, setStatus] = useState('');
  const { data: moderators, isLoading, refetch  } = useModerators(page);

  const addNewModerator = async (email) => {
    try {
      const token = getCookie('token');
      var response = await addModerator(token, email);
      console.log(response);
      await refetch();
    } catch (error) {
      console.error('Fetching moderators failed', error);
    }
  };
  const delModerator = async (confirmed) => {
    if (confirmed){
      try {
        const token = getCookie('token');
        const response = await deleteModerator(token, deleteId);
        console.log(response);
        setIsSuccess(true)
        await refetch();
      } catch (error) {
        console.error('Fetching moderators failed', error);
      }
    }
  };

  const RowMenu = ({id}) => {
    const handleRowDelete = (id) => {
      setDeleteId(id);
      setOpenDeleteModal(true);
    };
    return (
      <Dropdown>
        <MenuButton
          slots={{ root: IconButton }}
          slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
        >
          <MoreVertIcon />
        </MenuButton>
        <Menu size="sm" placement="bottom-end">
          <MenuItem onClick={() => setOpenModerator(true)}>Подробнее</MenuItem>
          <ListDivider />
          <MenuItem variant="soft" color="danger" onClick={() => handleRowDelete(id)}>
            <ListItemDecorator sx={{ color: 'inherit' }}>
              <DeleteIcon />
            </ListItemDecorator>{' '}
            Удалить
          </MenuItem>
        </Menu>
      </Dropdown>
    );
  };

  const clearFilters = () => {
    setStatus('');
    setToDate('');
    setFromDate('');
    setSearchTerm('');
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: '80px' },
    { field: 'avatar', width: '70px' ,render: (item) => <Avatar variant='outlined' src={item.profile_image_uri}/>},
    { field: 'fullName', headerName: 'ФИО', width: '140px',render: (item) => item.last_name + ' ' + item.first_name + ' ' + item.patronymic},
    { field: 'nickname', headerName: 'Никнейм', width: '100px' },
    { field: 'email', headerName: 'Почта', width: '140px' },
    { field: 'gender', headerName: 'Пол', width: '100px' },
    { field: 'birthday', headerName: 'День рождения', width: '90px', render: (item) => new Date(item.birthday).toLocaleDateString() },
    { field: 'menu', width: '50px', render: (item) => <RowMenu id={item.id}/>},
  ];

  return (
    <> 
      <SuccessNotification
      open={isSuccess} message={'Модератор успешно удалён'} setOpen={setIsSuccess}
      />
      <WarningModal
      message={`Вы действительно хотите удалить модератора с ID: ${deleteId}?`}
      onConfirm={delModerator}
      open={openDeleteModal}
      setOpen={setOpenDeleteModal}
      />
      <Typography  fontWeight={700} fontSize={30}>
           Модераторы
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
          <FormLabel>Поиск ФИО или почте</FormLabel>
          <Input
            size="sm"
            placeholder="Search"
            startDecorator={<SearchIcon />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </FormControl>
        {renderFilters(fromDate, setFromDate, toDate, setToDate, status, setStatus)}
        <AddModeratorModal
        func={addNewModerator}
        />


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
        data={moderators}
        RowMenu={RowMenu}
        />
      </Sheet>
      <CustomList 
        columns={columns} 
        data={moderators}
        colMenu={'menu'}
        colAvatar={'avatar'}
        colTitle={'fullName'}
        colAuthor={'email'}
        colDate={'birthday'}
        />
        </>
      )}
      
      <Pagination page={page} lastPage={lastPage} onPageChange={setPage} />
    </>
  );
}

export default ModeratorsSection;
