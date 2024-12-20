import React, { useEffect, useState } from 'react';

import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Chip from '@mui/joy/Chip';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import IconButton from '@mui/joy/IconButton';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import ModalDialog from '@mui/joy/ModalDialog';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';

import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import SearchOffIcon from '@mui/icons-material/SearchOff';

import CustomList from '../../components/workspaceComponents/shared/workSpaceList.jsx';
import Pagination from '../../components/workspaceComponents/shared/workSpacePagination.jsx';
import CustomTable from '../../components/workspaceComponents/shared/workSpaceTable.jsx';

import { getProjectsByPage } from '../../api/projectsApi.js';
import DatePopOver from '../../components/workspaceComponents/shared/modals/datePopOver.jsx';
import useServiceData from '../../hooks/service/useServiceData.js';
function ProjectsSection() {
	const [openProject, setOpenProject] = useState(false);

	const [page, setPage] = useState(1);
	const [lastPage, setLastPage] = useState();
	const [searchTerm, setSearchTerm] = useState('');

	const [crtFrom, setСrtFrom] = useState('');
	const [crtTo, setСrtTo] = useState('');

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
		data: projects,
		isLoading,
		refetch,
	} = useServiceData(['admin/projects'], getProjectsByPage, setLastPage, {
		withAuthors: true,
		page: page,
		searchFields: searchFields,
		searchValues: searchValues,
		crtFrom: crtFrom,
		crtTo: crtTo,
		operator: 'or',
		timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
	});
	useEffect(() => {
		refetch();
	}, [page, refetch]);

	const getStatus = status => {
		switch (status) {
			case 'moderating':
				return (
					<Chip color='warning' size='sm' variant='soft'>
						На проверке
					</Chip>
				);
			case 'published':
				return (
					<Chip color='success' size='sm' variant='soft'>
						Опубликован
					</Chip>
				);
			case 'archived':
				return (
					<Chip color='neutral' size='sm' variant='soft'>
						Архивирован
					</Chip>
				);
			case 'pending':
				return (
					<Chip color='danger' size='sm' variant='soft'>
						На доработке
					</Chip>
				);
			default:
				return <Chip size='sm'>{status}</Chip>;
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
		</>
	);
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
	//         <MenuItem onClick={() => setOpenProject(true)}>Просмотреть</MenuItem>
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
	];

	return (
		<>
			<Modal
				aria-labelledby='close-modal-title'
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
				<FormControl sx={{ flex: 1 }} size='sm'>
					<FormLabel>Поиск по названию </FormLabel>
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
