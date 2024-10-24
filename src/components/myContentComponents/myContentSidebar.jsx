import {
	Box,
	List,
	ListItem,
	ListItemButton,
	ListItemContent,
	Sheet,
	Typography,
} from '@mui/joy';
import React from 'react';

import NewspaperIcon from '@mui/icons-material/Newspaper';
import PodcastsIcon from '@mui/icons-material/Podcasts';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';

function MyContentSidebar({ selectedSection, setSection, roles = [] }) {
	const handleSetSection = section => {
		setSection(section);
	};

	return (
		<Sheet
			sx={{
				borderRadius: '30px',
				padding: '25px',
				minWidth: '300px',
			}}
		>
			<Box
				sx={{
					marginLeft: '5px',
				}}
			>
				<Typography level='title-lg'>Мой контент</Typography>
			</Box>
			<List
				size='sm'
				sx={{
					marginTop: '10px',
					gap: 1,
					'--List-nestedInsetStart': '30px',
					'--ListItem-radius': theme => theme.vars.radius.sm,
				}}
			>
				{roles && (
					<>
						{roles.includes('blogger') && (
							<>
								<ListItem>
									<ListItemButton
										selected={selectedSection === 'blogs'}
										onClick={() => handleSetSection('blogs')}
									>
										<TextSnippetIcon />
										<ListItemContent>
											<Typography level='body-md'>Блоги</Typography>
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
											<Typography level='body-md'>Подкасты</Typography>
										</ListItemContent>
									</ListItemButton>
								</ListItem>
							</>
						)}
						{roles.includes('news_creator') && (
							<ListItem>
								<ListItemButton
									disabled
									selected={selectedSection === 'news'}
									onClick={() => handleSetSection('news')}
								>
									<NewspaperIcon />
									<ListItemContent>
										<Typography level='body-md'>Новости</Typography>
									</ListItemContent>
								</ListItemButton>
							</ListItem>
						)}
					</>
				)}
			</List>
		</Sheet>
	);
}

export default MyContentSidebar;
