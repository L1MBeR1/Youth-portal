import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Dropdown from '@mui/joy/Dropdown';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import IconButton from '@mui/joy/IconButton';
import Input from '@mui/joy/Input';
import ListDivider from '@mui/joy/ListDivider';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';

import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import SearchOffIcon from '@mui/icons-material/SearchOff';

import CustomList from '../../components/workspaceComponents/shared/workSpaceList.jsx';
import Pagination from '../../components/workspaceComponents/shared/workSpacePagination.jsx';
import CustomTable from '../../components/workspaceComponents/shared/workSpaceTable.jsx';

import AddRoleModal from '../../components/workspaceComponents/shared/modals/addRoleModal.jsx';
import DatePopOver from '../../components/workspaceComponents/shared/modals/datePopOver.jsx';
import SuccessNotification from '../../components/workspaceComponents/shared/modals/successNotification.jsx';
import WarningModal from '../../components/workspaceComponents/shared/modals/warningModal.jsx';

import { addModerator, deleteModerator, getUsers } from '../../api/usersApi.js';
import useServiceData from '../../hooks/service/useServiceData.js';
import { getToken } from '../../utils/authUtils/tokenStorage.js';

function ModeratorsSection() {
	const navigate = useNavigate();
	const [openModerator, setOpenModerator] = useState(false);

	const [deleteId, setDeleteId] = useState();
	const [openDeleteModal, setOpenDeleteModal] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	const [page, setPage] = useState(1);
	const [lastPage, setLastPage] = useState();

	const [searchTerm, setSearchTerm] = useState('');
	const [bdFrom, setBdFrom] = useState('');
	const [bdTo, setBdTo] = useState('');

	const [filtersCleared, setFiltersCleared] = useState(false);
	const searchFields = [
		'email',
		'first_name',
		'last_name',
		'patronymic',
		'nickname',
	];
	const [searchValues, setSearchValues] = useState([]);
	const {
		data: moderators,
		isLoading,
		refetch,
	} = useServiceData(['admin/moderators'], getUsers, setLastPage, {
		role_name: 'moderator',
		page: page,
		searchFields: searchFields,
		searchValues: searchValues,
		bdTo: bdTo,
		bdFrom: bdFrom,
		operator: 'or',
	});
	const addNewModerator = async email => {
		const { token, needsRedirect } = await getToken('BloggerSection');
		if (needsRedirect) {
			navigate('/login');
		}
		const response = await addModerator(token, email);
		if (response) {
			console.log(response);
			refetch();
		}
	};

	const delModerator = async confirmed => {
		if (confirmed) {
			const { token, needsRedirect } = await getToken('BloggerSection');
			if (needsRedirect) {
				navigate('/login');
			}
			const response = await deleteModerator(token, deleteId);
			if (response) {
				console.log(response);
				setIsSuccess(true);
				refetch();
			}
		}
	};

	const RowMenu = ({ id }) => {
		const handleRowDelete = id => {
			setDeleteId(id);
			setOpenDeleteModal(true);
		};
		return (
			<Dropdown>
				<MenuButton
					slots={{ root: IconButton }}
					slotProps={{
						root: { variant: 'plain', color: 'neutral', size: 'sm' },
					}}
				>
					<MoreVertIcon />
				</MenuButton>
				<Menu size='sm' placement='bottom-end'>
					<MenuItem disabled onClick={() => setOpenModerator(true)}>
						Подробнее
					</MenuItem>
					<ListDivider />
					<MenuItem
						variant='soft'
						color='danger'
						onClick={() => handleRowDelete(id)}
					>
						<ListItemDecorator sx={{ color: 'inherit' }}>
							<DeleteIcon />
						</ListItemDecorator>{' '}
						Удалить
					</MenuItem>
				</Menu>
			</Dropdown>
		);
	};
	const renderFilters = () => (
		<>
			<DatePopOver
				label={'Дата рождения'}
				fromDate={bdFrom}
				toDate={bdTo}
				setFromDate={setBdFrom}
				setToDate={setBdTo}
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
		setBdFrom('');
		setBdTo('');
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
		{
			field: 'avatar',
			width: '70px',
			render: item => (
				<Avatar variant='outlined' src={item.profile_image_uri} />
			),
		},
		{
			field: 'fullName',
			headerName: 'ФИО',
			width: '140px',
			render: item =>
				item.last_name + ' ' + item.first_name + ' ' + item.patronymic,
		},
		{ field: 'nickname', headerName: 'Никнейм', width: '100px' },
		{ field: 'email', headerName: 'Почта', width: '140px' },
		{ field: 'gender', headerName: 'Пол', width: '100px' },
		{
			field: 'birthday',
			headerName: 'День рождения',
			width: '90px',
			render: item => new Date(item.birthday).toLocaleDateString(),
		},
		{ field: 'menu', width: '50px', render: item => <RowMenu id={item.id} /> },
	];

	return (
		<>
			<SuccessNotification
				open={isSuccess}
				message={'Модератор успешно удалён'}
				setOpen={setIsSuccess}
			/>
			<WarningModal
				message={`Вы действительно хотите удалить модератора с ID: ${deleteId}?`}
				onConfirm={delModerator}
				open={openDeleteModal}
				setOpen={setOpenDeleteModal}
			/>
			<Typography fontWeight={700} fontSize={30}>
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
				<AddRoleModal
					label={'Добавление модератора'}
					func={addNewModerator}
					message={'Вы точно хотите добавить модератора с почтой: '}
					successMessage={'Модератор успешно добавлен'}
				/>
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
