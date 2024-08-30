import { FormatAlignLeft, Fullscreen, Image } from '@mui/icons-material'; // Иконки из MUI
import { Box, Card, Grid, Typography } from '@mui/joy';
import { Typography as MuiTypography } from '@mui/material';
import React from 'react';
import { useDrag } from 'react-dnd';

const ItemTypes = {
	TEMPLATE: 'template',
};

function DraggableCard({ title, description, type, icon }) {
	const [{ isDragging }, drag] = useDrag({
		type: ItemTypes.TEMPLATE,
		item: { type, title, description },
		collect: monitor => ({
			isDragging: monitor.isDragging(),
		}),
	});

	return (
		<Card
			ref={drag}
			variant='outlined'
			sx={{
				p: 2,
				opacity: isDragging ? 0.5 : 1,
				cursor: 'move',
				display: 'flex',
				alignItems: 'center',
				gap: 2,
				borderRadius: 2,
				boxShadow: 'md',
			}}
		>
			<Box
				sx={{
					minWidth: 40,
					minHeight: 40,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				{icon}
			</Box>
			<Box>
				<MuiTypography variant='subtitle1' sx={{ mb: 0.5, fontWeight: 'bold' }}>
					{title}
				</MuiTypography>
				<MuiTypography variant='body2' sx={{ color: 'text.secondary' }}>
					{description}
				</MuiTypography>
			</Box>
		</Card>
	);
}

function ToolsSidebar() {
	return (
		<Card
			variant='outlined'
			sx={{
				p: 3,
				bgcolor: 'background.level1',
				boxShadow: 'md',
				borderRadius: 2,
				width: { xs: '100%', sm: 320 },
			}}
		>
			<Typography
				level='h2'
				sx={{ mb: 3, fontSize: '1.5rem', fontWeight: 'bold' }}
			>
				Container Templates
			</Typography>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<DraggableCard
						title='Two-Column Text'
						description='A layout with two columns of text, perfect for showcasing information.'
						type='two-column-text'
						icon={<FormatAlignLeft color='action' />}
					/>
				</Grid>
				<Grid item xs={12}>
					<DraggableCard
						title='Picture and Text'
						description='A layout with an image on one side and text on the other.'
						type='picture-and-text'
						icon={<Image color='action' />}
					/>
				</Grid>
				<Grid item xs={12}>
					<DraggableCard
						title='Full-Width Image'
						description='A layout with a full-width image, great for hero sections or featured content.'
						type='full-width-image'
						icon={<Fullscreen color='action' />}
					/>
				</Grid>
			</Grid>
		</Card>
	);
}

export default ToolsSidebar;
