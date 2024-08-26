import React, { useEffect, useState } from 'react';

import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Sheet from '@mui/joy/Sheet';
import ListDivider from '@mui/joy/ListDivider';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';

import SearchIcon from '@mui/icons-material/Search';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import CustomTable from '../../shared/workSpaceTable.jsx';
import CustomList from '../../shared/workSpaceList.jsx';
import Pagination from '../../shared/workSpacePagination.jsx';

import WarningModal from '../../shared/modals/warningModal.jsx';
import AddModeratorModal from '../../shared/modals/addRoleModal.jsx';
import SuccessNotification from '../../shared/modals/successNotification.jsx';
import DatePopOver from '../../shared/modals/datePopOver.jsx';

import {deleteModerator,addModerator} from '../../../../api/usersApi.js';
import { getCookie } from '../../../../utils/cookie/cookieUtils.js';
import useOrganizations from '../../../../hooks/service/useOrganizations.js';


function OrganizationsSection() {
  const [openModerator, setOpenModerator] = useState(false);

  const [deleteId, setDeleteId] = useState();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState();

  const [searchTerm, setSearchTerm] = useState('');

  const [crtFrom, setСrtFrom] = useState('');
  const [crtTo, setСrtTo] = useState('');
  
  const [updFrom, setUpdFrom] = useState('');
  const [updTo, setUpdTo] = useState('');

  const [filtersCleared, setFiltersCleared] = useState(false);
  const searchFields= ['name'];
  const [searchValues, setSearchValues] = useState([]);
  const { data: organizations, isLoading, refetch  } = useOrganizations(['su/organizations'],['service'],setLastPage, 
    { 
      page: page,
      searchFields: searchFields,
      searchValues: searchValues,
      crtFrom:crtFrom,
      crtTo:crtTo,
      updFrom:updFrom,
      updTo:updTo,
      operator:'or',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  // const addNewModerator = async (email) => {
  //   const token = getCookie('token');
  //   const response = await addModerator(token, email)
  //   if (response) {
  //     console.log(response);
  //     refetch()
  //   }
  // };
  
  // const delModerator = async (confirmed) => {
  //   if (confirmed) {
  //     const token = getCookie('token');
  //     const response = await deleteModerator(token, deleteId)
  //     if (response) {
  //       console.log(response);
  //       setIsSuccess(true);
  //       refetch()
  //     }
  //   }
  // };
  

  // const RowMenu = ({id}) => {
  //   const handleRowDelete = (id) => {
  //     setDeleteId(id);
  //     setOpenDeleteModal(true);
  //   };
  //   return (
  //     <Dropdown>
  //       <MenuButton
  //         slots={{ root: IconButton }}
  //         slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
  //       >
  //         <MoreVertIcon />
  //       </MenuButton>
  //       <Menu size="sm" placement="bottom-end">
  //         <MenuItem disabled onClick={() => setOpenModerator(true)}>Подробнее</MenuItem>
  //         <ListDivider />
  //         <MenuItem variant="soft" color="danger" onClick={() => handleRowDelete(id)}>
  //           <ListItemDecorator sx={{ color: 'inherit' }}>
  //             <DeleteIcon />
  //           </ListItemDecorator>{' '}
  //           Удалить
  //         </MenuItem>
  //       </Menu>
  //     </Dropdown>
  //   );
  // };
  const renderFilters = () => (
    <>
      <DatePopOver
      label={'Дата создания'}
      fromDate={crtFrom}
      toDate={crtTo}
      setFromDate={setСrtFrom}
      setToDate={setСrtTo}
      />
      <DatePopOver
      label={'Дата обновления'}
      fromDate={updFrom}
      toDate={updTo}
      setFromDate={setUpdFrom}
      setToDate={setUpdTo}
      /> 
    </>
  );

  useEffect(() => {
    refetch();
  }, [page,refetch]);
  
  useEffect(() => {
    if (filtersCleared) {
      refetch();
      setFiltersCleared(false); 
    }
  }, [filtersCleared, refetch]);
  const clearFilters = () => {
    setСrtTo('');
    setСrtFrom('');
    setUpdTo('');
    setUpdFrom('');
    setSearchTerm('');
    setSearchValues([])
    setFiltersCleared(true);
  };
  const applyFilters = () => {
    setSearchValues([searchTerm,searchTerm,searchTerm,searchTerm,searchTerm])
    setFiltersCleared(true);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: '80px' },
    { field: 'name', headerName: 'Название', width: '140px'},
    { field: 'created_at', headerName: 'Дата создания', width: '90px', render: (item) => new Date(item.created_at).toLocaleDateString() },
    { field: 'updated_at', headerName: 'Дата создания', width: '90px', render: (item) => new Date(item.updated_at).toLocaleDateString() },
  ];

  return (
    <> 
      {/* <SuccessNotification
      open={isSuccess} message={'Модератор успешно удалён'} setOpen={setIsSuccess}
      />
      <WarningModal
      message={`Вы действительно хотите удалить модератора с ID: ${deleteId}?`}
      onConfirm={delModerator}
      open={openDeleteModal}
      setOpen={setOpenDeleteModal}
      /> */}
      <Typography  fontWeight={700} fontSize={30}>
           Организации
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
          <FormLabel>Поиск по почте или ФИО</FormLabel>
          <Input
            size="sm"
            placeholder="Search"
            startDecorator={<SearchIcon />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </FormControl>
        {renderFilters()}

        <Button size="sm"   variant='soft' startDecorator={<SearchIcon />}
        onClick={()=>applyFilters()}
        >
          Поиск
        </Button>
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
        data={organizations}
        />
      </Sheet>
      <CustomList 
        columns={columns} 
        data={organizations}
        colTitle={'name'}
        colDate={'created_at'}
        />
        </>
      )}
      
      <Pagination page={page} lastPage={lastPage} onPageChange={setPage} />
    </>
  );
}

export default OrganizationsSection;
