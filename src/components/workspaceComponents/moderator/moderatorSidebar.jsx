import React, { useState } from 'react';

import Box from '@mui/joy/Box';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';

import PodcastsIcon from '@mui/icons-material/Podcasts';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';

function ModeratorSidebar({ selectedSection, setSection, setOpen, open }) {
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
						flexGrow: 1,
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
								selected={selectedSection === 'blogs'}
								onClick={() => handleSetSection('blogs')}
							>
								<TextSnippetIcon />
								<ListItemContent>
									<Typography level='title-sm'>Блоги</Typography>
								</ListItemContent>
							</ListItemButton>
						</ListItem>
						<ListItem>
							<ListItemButton
								selected={selectedSection === 'news'}
								onClick={() => handleSetSection('news')}
							>
								<NewspaperIcon />
								<ListItemContent>
									<Typography level='title-sm'>Новости</Typography>
								</ListItemContent>
							</ListItemButton>
						</ListItem>
						<ListItem>
							<ListItemButton
								selected={selectedSection === 'podcasts'}
								onClick={() => handleSetSection('podcasts')}
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
		</>
	);
}

export default ModeratorSidebar;
