import { Box, Button, Card, Input, Textarea, Typography } from '@mui/joy';
import React from 'react';
import ContentArea from './ContentArea';
import ToolsSidebar from './ToolsSidebar';

function BlogCreator() {
	return (
		<Box
			sx={{
				maxWidth: '1200px',
				margin: '0 auto',
				padding: { xs: 3, md: 6 },
				display: 'grid',
				gap: 3,
				gridTemplateColumns: { md: '3fr 1fr' },
			}}
		>
			<Card
				variant='outlined'
				sx={{
					p: 3,
					bgcolor: 'background.level1',
					boxShadow: 'md',
					borderRadius: 2,
				}}
			>
				<Typography
					level='h1'
					sx={{
						mb: 2,
						fontSize: { xs: '1.5rem', md: '2rem' },
						fontWeight: 'bold',
					}}
				>
					Create a New Blog Post
				</Typography>
				<Typography
					level='body1'
					sx={{
						color: 'text.tertiary',
						mb: 4,
						fontSize: { xs: '0.875rem', md: '1rem' },
					}}
				>
					Fill out the form below to publish a new blog post. The more details
					you provide, the better your post will be!
				</Typography>
				<form>
					<Box sx={{ display: 'grid', gap: 3 }}>
						<Box>
							<Typography level='body2' sx={{ mb: 1, fontWeight: 'bold' }}>
								Title
							</Typography>
							<Input
								fullWidth
								placeholder='Enter a title for your blog post'
								sx={{
									padding: 1.5,
									borderRadius: 1,
									boxShadow: 'inset 0 0 0 1px #ddd',
								}}
							/>
						</Box>
						<Box>
							<Typography level='body2' sx={{ mb: 1, fontWeight: 'bold' }}>
								Description
							</Typography>
							<Textarea
								minRows={3}
								fullWidth
								placeholder='Provide a brief description of your blog post'
								sx={{
									padding: 1.5,
									borderRadius: 1,
									boxShadow: 'inset 0 0 0 1px #ddd',
								}}
							/>
						</Box>
						<Box>
							<Typography level='body2' sx={{ mb: 1, fontWeight: 'bold' }}>
								Content
							</Typography>
							<ContentArea />
						</Box>
						<Button
							type='submit'
							variant='contained'
							color='primary'
							sx={{
								mt: 2,
								py: 1.5,
								borderRadius: 1,
								boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
								'&:hover': { boxShadow: '0 6px 10px rgba(0,0,0,0.2)' },
							}}
						>
							Publish Blog Post
						</Button>
					</Box>
				</form>
			</Card>
			<ToolsSidebar />
		</Box>
	);
}

export default BlogCreator;
