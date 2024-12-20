import React, { useEffect, useState } from 'react';

import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import IconButton from '@mui/joy/IconButton';
import Input from '@mui/joy/Input';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';

import SearchIcon from '@mui/icons-material/Search';
import SearchOffIcon from '@mui/icons-material/SearchOff';

import CustomList from '../../components/workspaceComponents/shared/workSpaceList.jsx';
import Pagination from '../../components/workspaceComponents/shared/workSpacePagination.jsx';
import CustomTable from '../../components/workspaceComponents/shared/workSpaceTable.jsx';

import { getOrganizationsByPage } from '../../api/organizationsApi.js';
import DatePopOver from '../../components/workspaceComponents/shared/modals/datePopOver.jsx';
import useServiceData from '../../hooks/service/useServiceData.js';

function OrganizationsSection() {
	const [page, setPage] = useState(1);
	const [lastPage, setLastPage] = useState();

	const [searchTerm, setSearchTerm] = useState('');

	const [crtFrom, setСrtFrom] = useState('');
	const [crtTo, setСrtTo] = useState('');

	const [updFrom, setUpdFrom] = useState('');
	const [updTo, setUpdTo] = useState('');

	const [filtersCleared, setFiltersCleared] = useState(false);
	const searchFields = ['name'];
	const [searchValues, setSearchValues] = useState([]);
	const {
		data: organizations,
		isLoading,
		refetch,
	} = useServiceData(
		['admin/organizations'],
		getOrganizationsByPage,
		setLastPage,
		{
			page: page,
			searchFields: searchFields,
			searchValues: searchValues,
			crtFrom: crtFrom,
			crtTo: crtTo,
			updFrom: updFrom,
			updTo: updTo,
			operator: 'or',
			timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		}
	);

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
	}, [page, refetch]);

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
		setSearchValues([]);
		setFiltersCleared(true);
	};
	const applyFilters = () => {
		setSearchValues([
			searchTerm,
			searchTerm,
			searchTerm,
			searchTerm,
			searchTerm,
		]);
		setFiltersCleared(true);
	};

	const columns = [
		{ field: 'id', headerName: 'ID', width: '80px' },
		{ field: 'name', headerName: 'Название', width: '140px' },
		{
			field: 'created_at',
			headerName: 'Дата создания',
			width: '90px',
			render: item => new Date(item.created_at).toLocaleDateString(),
		},
		{
			field: 'updated_at',
			headerName: 'Дата создания',
			width: '90px',
			render: item => new Date(item.updated_at).toLocaleDateString(),
		},
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
			<Typography fontWeight={700} fontSize={30}>
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
				<FormControl sx={{ flex: 1 }} size='sm'>
					<FormLabel>Поиск</FormLabel>
					<Input
						size='sm'
						placeholder='Search'
						startDecorator={<SearchIcon />}
						value={searchTerm}
						onChange={e => setSearchTerm(e.target.value)}
					/>
				</FormControl>
				{renderFilters()}

				<Button
					size='sm'
					variant='soft'
					startDecorator={<SearchIcon />}
					onClick={() => applyFilters()}
				>
					Поиск
				</Button>
				<IconButton
					variant='outlined'
					onClick={clearFilters}
					color='danger'
					sx={{
						'--IconButton-size': '32px',
					}}
				>
					<SearchOffIcon />
				</IconButton>
			</Box>
			{isLoading ? (
				<></>
			) : (
				<>
					<Sheet
						className='OrderTableContainer'
						variant='outlined'
						sx={{
							display: { xs: 'none', sm: 'flex' },
							flexGrow: '1',
							borderRadius: 'sm',
							overflow: 'auto',
							maxHeight: '100%',
						}}
					>
						<CustomTable columns={columns} data={organizations} />
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
