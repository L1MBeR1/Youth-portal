import React from 'react';

import Box from '@mui/joy/Box';

import Blogs from './sections/blogsSection';
import Podcasts from './sections/podcastsSection';
import News from './sections/newsSection';

function ModeratorMain({ section }) {
	const getContent = section => {
		switch (section) {
			case 'podcasts':
				return <Podcasts />;
			case 'blogs':
				return <Blogs />;
			case 'news':
				return <News />;
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

export default ModeratorMain;
