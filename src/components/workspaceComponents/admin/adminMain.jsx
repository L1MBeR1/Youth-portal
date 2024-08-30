import React from 'react';

import Box from '@mui/joy/Box';

import Blogs from '../moderator/sections/blogsSection';
import News from '../moderator/sections/newsSection';
import Podcasts from '../moderator/sections/podcastsSection';
import Bloggers from './sections/bloggersSection';
import Events from './sections/eventsSection';
import Moderators from './sections/moderatorsSection';
import Organizations from './sections/organizationsSection';
import Projects from './sections/projectsSection';

function AdminMain({ section }) {
	const getContent = section => {
		switch (section) {
			// case 'statistics':
			//   return
			case 'moderators':
				return <Moderators />;
			case 'organizations':
				return <Organizations />;
			case 'projects':
				return <Projects />;
			case 'events':
				return <Events />;
			case 'podcasts':
				return <Podcasts />;
			case 'blogs':
				return <Blogs />;
			case 'news':
				return <News />;
			case 'bloggers':
				return <Bloggers />;
			default:
				return '';
		}
	};
	return (
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
			{getContent(section)}
		</Box>
	);
}

export default AdminMain;
