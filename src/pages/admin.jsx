import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';

import Stack from '@mui/joy/Stack';

import Box from '@mui/joy/Box';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';

import ArticleIcon from '@mui/icons-material/Article';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import EventIcon from '@mui/icons-material/Event';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PublishIcon from '@mui/icons-material/Publish';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import ShieldIcon from '@mui/icons-material/Shield';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Toggler from '../components/toggler';
import Header from '../components/workspaceComponents/shared/workSpaceHeader';
function Admin() {
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
			console.log('Удаление кэша админа');
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
							color='neutral'
							sx={{
								background: 'var(--joy-palette-main-background)',
								maxWidth: 'fit-content',
								flexGrow: 1,
								p: 2,
								flexShrink: 0,
								display: 'flex',
								flexDirection: 'column',
								gap: 2,
								minWidth: '200px',
							}}
						>
							<Typography level='h4'>Администратор</Typography>
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
										selected={isActive('/admin/moderators')}
										onClick={() => handleNavigate('/admin/moderators')}
									>
										<ShieldIcon />
										<ListItemContent>
											<Typography level='title-sm'>Модераторы</Typography>
										</ListItemContent>
									</ListItemButton>
								</ListItem>
								<ListItem>
									<ListItemButton
										selected={isActive('/admin/bloggers')}
										onClick={() => handleNavigate('/admin/bloggers')}
									>
										<ArticleIcon />
										<ListItemContent>
											<Typography level='title-sm'>Блогеры</Typography>
										</ListItemContent>
									</ListItemButton>
								</ListItem>
								<ListItem>
									<ListItemButton
										selected={isActive('/admin/projects')}
										onClick={() => handleNavigate('/admin/projects')}
									>
										<DesignServicesIcon />
										<ListItemContent>
											<Typography level='title-sm'>Проекты</Typography>
										</ListItemContent>
									</ListItemButton>
								</ListItem>
								<ListItem>
									<ListItemButton
										selected={isActive('/admin/reports')}
										onClick={() => handleNavigate('/admin/reports')}
									>
										<ReportProblemIcon />
										<ListItemContent>
											<Typography level='title-sm'>Жалобы</Typography>
										</ListItemContent>
									</ListItemButton>
								</ListItem>
								<ListItem>
									<ListItemButton
										selected={isActive('/admin/events')}
										onClick={() => handleNavigate('/admin/events')}
									>
										<EventIcon />
										<ListItemContent>
											<Typography level='title-sm'>Мероприятия</Typography>
										</ListItemContent>
									</ListItemButton>
								</ListItem>
								<ListItem nested>
									<Toggler
										renderToggle={({ open, setOpen }) => (
											<ListItemButton onClick={() => setOpen(!open)}>
												<PublishIcon />
												<ListItemContent>
													<Typography level='title-sm'>Публикации</Typography>
												</ListItemContent>
												<KeyboardArrowDownIcon
													sx={{ transform: open ? 'rotate(180deg)' : 'none' }}
												/>
											</ListItemButton>
										)}
									>
										<List sx={{ gap: 0.5 }}>
											<ListItem sx={{ mt: 0.5 }}>
												<ListItemButton
													selected={isActive('/admin/blogs')}
													onClick={() => handleNavigate('/admin/blogs')}
												>
													Блоги
												</ListItemButton>
											</ListItem>
											<ListItem>
												<ListItemButton
													selected={isActive('/admin/news')}
													onClick={() => handleNavigate('/admin/news')}
												>
													Новости
												</ListItemButton>
											</ListItem>
											<ListItem>
												<ListItemButton
													selected={isActive('/admin/podcasts')}
													onClick={() => handleNavigate('/admin/podcasts')}
												>
													Подкасты
												</ListItemButton>
											</ListItem>
										</List>
									</Toggler>
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

export default Admin;
