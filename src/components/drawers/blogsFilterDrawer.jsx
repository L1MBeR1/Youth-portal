import {
	Box,
	Button,
	DialogTitle,
	Drawer,
	FormControl,
	FormLabel,
	ModalClose,
	Option,
	Select,
	Stack,
} from '@mui/joy';
import React from 'react';
import usePublicationsTags from '../../hooks/usePublicationsTags';

function BlogsFilterDrawer({
	open,
	setOpen,
	setTag,
	tag,
	clearFilters,
	refetch,
}) {
	const { data: tags } = usePublicationsTags();
	const handleRefetch = () => {
		refetch();
		setOpen(false);
	};

	const handleTagChange = (event, value) => {
		if (value) {
			setTag(value);
		} else {
			setTag(null);
		}
	};

	return (
		<Drawer open={open} onClose={() => setOpen(false)} anchor='left' size='sm'>
			<ModalClose />
			<DialogTitle>Фильтры для блогов</DialogTitle>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					gap: 2,
					padding: '20px',
				}}
			>
				{tags && (
					<FormControl>
						<FormLabel>Категории</FormLabel>
						<Select
							placeholder='Выберите категорию'
							value={tag || ''}
							onChange={handleTagChange}
							size='sm'
							sx={{
								backgroundColor: 'var(--joy-palette-background-body)',
							}}
						>
							{tags.map(tagOption => (
								<Option key={tagOption} value={tagOption}>
									{tagOption}
								</Option>
							))}
						</Select>
					</FormControl>
				)}
				<Stack direction={'row'} spacing={2}>
					<Button
						variant='outlined'
						onClick={clearFilters}
						color='danger'
						sx={{
							flexGrow: 1,
						}}
					>
						Очистить
					</Button>
					<Button
						color='primary'
						onClick={handleRefetch}
						sx={{
							flexGrow: 1,
						}}
					>
						Найти
					</Button>
				</Stack>
			</Box>
		</Drawer>
	);
}

export default BlogsFilterDrawer;
