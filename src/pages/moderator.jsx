import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';

import Stack from '@mui/joy/Stack';

import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';

import NewspaperIcon from '@mui/icons-material/Newspaper';
import PodcastsIcon from '@mui/icons-material/Podcasts';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import { Box } from '@mui/joy';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/workspaceComponents/shared/workSpaceHeader';
function Moderator() {
	const navigate = useNavigate();
	const location = useLocation();
	const handleNavigate = path => {
		navigate(path);
	};
	const isActive = path => location.pathname.startsWith(path);
	const [open, setOpen] = useState(false);

	const queryClient = useQueryClient();

	useEffect(() => {
		return () => {
			console.log('Удаление кэша модератора');
			queryClient.removeQueries({
				predicate: query => {
					return query.meta?.tags?.includes('service');
				},
			});
		};
	}, [queryClient]);

	return (
		<Stack
			sx={{
				minHeight: '100vh',
				overflow: 'hidden',
				maxHeight: '100vh',
			}}
		>
			<Header setOpen={setOpen} open={open} />
			<main className='layout-main'>
				<Stack
					direction='row'
					sx={{
						flexGrow: 1,
						overflow: 'hidden',
					}}
				>
					<Sheet
						sx={{
							position: { xs: 'fixed', md: 'sticky' },
							transform: {
								xs: `translateX(calc(100% * (${open ? 1 : 0} - 1)))`,
								md: 'none',
							},
							transition: 'transform 0.4s, width 0.4s',
							zIndex: 1000,
							height: '100dvh',
							top: 0,
							flexShrink: 0,
							display: 'flex',
							borderRight: '1px solid',
							borderColor: 'divider',
						}}
					>
						<Sheet
							sx={{
								maxWidth: 'fit-content',
								flexGrow: 1,
								background: 'var(--joy-palette-main-background)',
								p: 2,
								flexShrink: 0,
								display: 'flex',
								flexDirection: 'column',
								gap: 2,
								minWidth: '200px',
							}}
						>
							<Typography level='h4'>Модератор</Typography>
							<List
								size='sm'
								sx={{
									gap: 1,
									'--List-nestedInsetStart': '30px',
									'--ListItem-radius': theme => theme.vars.radius.sm,
								}}
							>
								<ListItem>
									<ListItemButton
										selected={isActive('/moderator/blogs')}
										onClick={() => handleNavigate('/moderator/blogs')}
									>
										<TextSnippetIcon />
										<ListItemContent>
											<Typography level='title-sm'>Блоги</Typography>
										</ListItemContent>
									</ListItemButton>
								</ListItem>
								<ListItem>
									<ListItemButton
										selected={isActive('/moderator/news')}
										onClick={() => handleNavigate('/moderator/news')}
									>
										<NewspaperIcon />
										<ListItemContent>
											<Typography level='title-sm'>Новости</Typography>
										</ListItemContent>
									</ListItemButton>
								</ListItem>
								<ListItem>
									<ListItemButton
										selected={isActive('/moderator/podcasts')}
										onClick={() => handleNavigate('/moderator/podcasts')}
									>
										<PodcastsIcon />
										<ListItemContent>
											<Typography level='title-sm'>Подкасты</Typography>
										</ListItemContent>
									</ListItemButton>
								</ListItem>
							</List>
						</Sheet>
					</Sheet>
					<Box
						sx={{
							display: open ? { xs: 'block', md: 'none' } : 'none',
							position: 'fixed',
							zIndex: 999,
							top: 0,
							left: 0,
							width: '100vw',
							height: '100vh',
							opacity: open ? 0.2 : 0,
							backgroundColor: 'black',
							transition: 'opacity 0.4s',
							// transform: open ? 'translateX(250px)' : 'translateX(-50%)',
						}}
						onClick={() => setOpen(false)}
					/>
					<Box
						sx={{
							flexGrow: 1,
							display: 'flex',
							flexDirection: 'column',
							gap: 2,
							padding: { xs: '15px 10px', sm: '10px 20px', md: '30px 45px' },
							maxHeight: '100%',
							overflowY: { xs: 'scroll', sm: 'hidden' },
						}}
					>
						<Outlet />
					</Box>
				</Stack>
			</main>
		</Stack>
	);
}

export default Moderator;
