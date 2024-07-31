import React, { useEffect, useState } from 'react';
import { useNavigate} from 'react-router-dom';

import Box from '@mui/joy/Box';
import Chip from '@mui/joy/Chip';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
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

import CustomTable from '../../shared/workSpaceTable.jsx';
import CustomList from '../../shared/workSpaceList.jsx';
import Pagination from '../../shared/workSpacePagination.jsx';
import useBlogs from '../../../../hooks/service/useBlogs.js';

import ChangeStatusModal from '../../shared/modals/changeStatusModal.jsx';
import DatePopOver from '../../shared/modals/datePopOver.jsx';

import { getToken } from '../../../../utils/authUtils/tokenStorage.js';
import {changeBlogStatus} from '../../../../api/blogsApi.js';

function BlogsSection() {
  const navigate = useNavigate();
  const [openBlog, setOpenBlog] = useState(false);


  const [changeId, setChangeId] = useState();
  const [openChangeModal, setOpenChangeModal] = useState(false);
  
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState();
  const [searchTerm, setSearchTerm] = useState('');

  const [crtFrom, setСrtFrom] = useState('');
  const [crtTo, setСrtTo] = useState('');
  
  const [updFrom, setUpdFrom] = useState('');
  const [updTo, setUpdTo] = useState('');

  const [status, setStatus] = useState('');
  const [filtersCleared, setFiltersCleared] = useState(false);
  const searchFields= ['title','first_name','last_name','patronymic','nickname'];
  const [searchValues, setSearchValues] = useState([]);

  const { data: blogs, isLoading, refetch  } = useBlogs(['moderator/blogs'],['service'],setLastPage, 
    {
      withAuthors: true,
      page: page,
      searchFields: searchFields,
      searchValues: searchValues,
      crtFrom:crtFrom,
      crtTo:crtTo,
      updFrom:updFrom,
      updTo:updTo,
      operator:'or',
    });

  useEffect(() => {
    refetch();
  }, [page,refetch]);

  const changeStauts= async (status) => {
    const {token,needsRedirect} = getToken('BloggerSection');
    if (needsRedirect){
      navigate('/login')
    }
    console.log(status)
    const response = await changeBlogStatus(token, changeId,status)
    if (response) {
      console.log(response);
      await refetch()
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
  function RowMenu({id}) {
    const handleStatusChange = (id) => {
      setChangeId(id);
      setOpenChangeModal(true);
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
          <MenuItem disabled onClick={() => setOpenBlog(true)}>Просмотреть</MenuItem>
          <MenuItem onClick={() => handleStatusChange(id)}><EditIcon/>Изменить статус</MenuItem>
        </Menu>
      </Dropdown>
    );
  }
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
    { field: 'author', headerName: 'Автор', width: '140px', render: (item) => item.last_name + ' ' + item.first_name + ' ' + item.patronymic },
    { field: 'nickname', headerName: 'Никнейм', width: '120px' },
    { field: 'title', headerName: 'Название', width: '200px' },
    { field: 'description', headerName: 'Описание', width: '200px', render: (item) => item.description.desc},
    { field: 'created_at', headerName: 'Дата создания', width: '90px', render: (item) => new Date(item.created_at).toLocaleDateString() },
    { field: 'updated_at', headerName: 'Дата создания', width: '90px', render: (item) => new Date(item.updated_at).toLocaleDateString() },
    { field: 'status', headerName: 'Статус', width: '120px', render: (item) => getStatus(item.status) },
    { field: 'menu', width: '50px', render: (item) => <RowMenu id={item.id}/>},
  ];

  return (
    <> <ChangeStatusModal
    func={changeStauts}
    message={`Вы действительно хотите изменить статус блога с id: ${changeId} на`}
    id={changeId}
    isOpen={openChangeModal}
    setIsOpen={setOpenChangeModal}
    />
      <Typography  fontWeight={700} fontSize={30}>
           Блоги
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
        data={blogs}
        />
      </Sheet>
       <CustomList 
        columns={columns} 
        data={blogs}
        // rowMenu={()}
        colTitle={'title'}
        colAuthor={'author'}
        colDescription={'description'}
        colDate={'created_at'}
        colStatus={'status'}
        />
        </>
      )}
      <Pagination page={page} lastPage={lastPage} onPageChange={setPage} />
    </>
  );
}

export default BlogsSection;
