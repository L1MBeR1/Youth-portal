import React, { useState } from 'react';

import Box from '@mui/joy/Box';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';

import ArticleIcon from '@mui/icons-material/Article';
import BusinessIcon from '@mui/icons-material/Business';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import EventIcon from '@mui/icons-material/Event';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PublishIcon from '@mui/icons-material/Publish';
import ShieldIcon from '@mui/icons-material/Shield';

function Toggler({ defaultExpanded = false, renderToggle, children }) {
	const [open, setOpen] = useState(defaultExpanded);

	return (
		<>
			{renderToggle({ open, setOpen })}
			<Box
				sx={{
					display: 'grid',
					gridTemplateRows: open ? '1fr' : '0fr',
					transition: '0.3s ease',
					'& > *': {
						overflow: 'hidden',
					},
				}}
			>
				{children}
			</Box>
		</>
	);
}

function SuSidebar({ selectedSection, setSection, setOpen, open }) {
	const handleSetSection = section => {
		setSection(section);
		setOpen(false);
	};
	return (
		<>
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
						background: 'var(--joy-palette-main-background)',
						flexGrow: 1,
						p: 2,
						flexShrink: 0,
						display: 'flex',
						flexDirection: 'column',
						gap: 2,
						minWidth: '200px',
					}}
				>
					<Typography level='h4'>Superuser</Typography>
					<List
						size='sm'
						sx={{
							gap: 1,
							'--List-nestedInsetStart': '30px',
							'--ListItem-radius': theme => theme.vars.radius.sm,
						}}
					>
						{/* <ListItem>
            <ListItemButton selected={selectedSection === 'statistics'} onClick={() => handleSetSection('statistics')}>
                <BarChartIcon />
                <ListItemContent>
                <Typography level="title-sm">Статистика</Typography>
                </ListItemContent>
            </ListItemButton>
            </ListItem> */}
						<ListItem>
							<ListItemButton
								selected={selectedSection === 'moderators'}
								onClick={() => handleSetSection('moderators')}
							>
								<ShieldIcon />
								<ListItemContent>
									<Typography level='title-sm'>Модераторы</Typography>
								</ListItemContent>
							</ListItemButton>
						</ListItem>
						<ListItem>
							<ListItemButton
								selected={selectedSection === 'bloggers'}
								onClick={() => handleSetSection('bloggers')}
							>
								<ArticleIcon />
								<ListItemContent>
									<Typography level='title-sm'>Блогеры</Typography>
								</ListItemContent>
							</ListItemButton>
						</ListItem>
						<ListItem>
							<ListItemButton
								selected={selectedSection === 'organizations'}
								onClick={() => handleSetSection('organizations')}
							>
								<BusinessIcon />
								<ListItemContent>
									<Typography level='title-sm'>Организации</Typography>
								</ListItemContent>
							</ListItemButton>
						</ListItem>
						<ListItem>
							<ListItemButton
								selected={selectedSection === 'projects'}
								onClick={() => handleSetSection('projects')}
							>
								<DesignServicesIcon />
								<ListItemContent>
									<Typography level='title-sm'>Проекты</Typography>
								</ListItemContent>
							</ListItemButton>
						</ListItem>
						<ListItem>
							<ListItemButton
								selected={selectedSection === 'events'}
								onClick={() => handleSetSection('events')}
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
											selected={selectedSection === 'blogs'}
											onClick={() => handleSetSection('blogs')}
										>
											Блоги
										</ListItemButton>
									</ListItem>
									<ListItem>
										<ListItemButton
											selected={selectedSection === 'news'}
											onClick={() => handleSetSection('news')}
										>
											Новости
										</ListItemButton>
									</ListItem>
									<ListItem>
										<ListItemButton
											selected={selectedSection === 'podcasts'}
											onClick={() => handleSetSection('podcasts')}
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
		</>
	);
}

export default SuSidebar;
