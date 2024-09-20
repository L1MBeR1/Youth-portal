import React, { useEffect, useState } from 'react';

import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import IconButton from '@mui/joy/IconButton';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import ModalDialog from '@mui/joy/ModalDialog';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';

import SearchIcon from '@mui/icons-material/Search';
import SearchOffIcon from '@mui/icons-material/SearchOff';

import EditIcon from '@mui/icons-material/Edit';

import CustomList from '../../shared/workSpaceList.jsx';
import Pagination from '../../shared/workSpacePagination.jsx';
import CustomTable from '../../shared/workSpaceTable.jsx';

import { getEventsByPage } from '../../../../api/eventsApi.js';
import useServiceData from '../../../../hooks/service/useServiceData.js';
import DatePopOver from '../../shared/modals/datePopOver.jsx';
function EventsSection() {
	const [openEvents, setOpenEvents] = useState(false);

	const [page, setPage] = useState(1);
	const [lastPage, setLastPage] = useState();
	const [searchTerm, setSearchTerm] = useState('');

	const [crtFrom, setСrtFrom] = useState('');
	const [crtTo, setСrtTo] = useState('');

	const [updFrom, setUpdFrom] = useState('');
	const [updTo, setUpdTo] = useState('');

	const [status, setStatus] = useState('');
	const [filtersCleared, setFiltersCleared] = useState(false);
	const searchFields = [
		'name',
		'first_name',
		'last_name',
		'patronymic',
		'nickname',
	];
	const [searchValues, setSearchValues] = useState([]);

	const {
		data: events,
		isLoading,
		refetch,
	} = useServiceData(['su/events'], getEventsByPage, setLastPage, {
		withAuthors: true,
		page: page,
		searchFields: searchFields,
		searchValues: searchValues,
		crtFrom: crtFrom,
		crtTo: crtTo,
		updFrom: updFrom,
		updTo: updTo,
		operator: 'or',
		timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
	});

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

	// function RowMenu() {
	//   return (
	//     <Dropdown>
	//       <MenuButton
	//         slots={{ root: IconButton }}
	//         slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
	//       >
	//         <MoreVertIcon />
	//       </MenuButton>
	//       <Menu size="sm" sx={{ minWidth: 140 }}>
	//         <MenuItem onClick={() => setOpenEvents(true)}>Просмотреть</MenuItem>
	//         <MenuItem>Изменить</MenuItem>
	//       </Menu>
	//     </Dropdown>
	//   );
	// }
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
		{ field: 'id', headerName: 'ID', width: '60px' },
		{ field: 'name', headerName: 'Название', width: '140px' },
		{
			field: 'description',
			headerName: 'Описание',
			width: '200px',
			render: item => item.description.desc,
		},
		{
			field: 'author',
			headerName: 'Организатор',
			width: '140px',
			render: item =>
				item.last_name + ' ' + item.first_name + ' ' + item.patronymic,
		},
		{ field: 'location', headerName: 'Адрес', width: '200px' },
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
		{
			field: 'start_time',
			headerName: 'Дата начала',
			width: '90px',
			render: item => new Date(item.start_time).toLocaleDateString(),
		},
	];

	return (
		<>
			<Modal
				aria-labelledby='close-modal-title'
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
					<EditIcon />
					<ModalClose variant='outlined' />
					<Typography
						component='h2'
						id='close-modal-title'
						level='h4'
						textColor='inherit'
						fontWeight='lg'
					>
						Modal title
					</Typography>
				</ModalDialog>
			</Modal>
			<Typography fontWeight={700} fontSize={30}>
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
				<FormControl sx={{ flex: 1 }} size='sm'>
					<FormLabel>Поиск по названию или организатору</FormLabel>
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
						variant='outlined'
						sx={{
							display: { xs: 'none', sm: 'flex' },
							flexGrow: '1',
							borderRadius: 'sm',
							overflow: 'auto',
							maxHeight: '100%',
						}}
					>
						<CustomTable columns={columns} data={events} />
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
