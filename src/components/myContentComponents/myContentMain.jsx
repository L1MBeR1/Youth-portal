import { Sheet } from '@mui/joy';
import React from 'react';

import BlogSection from './sections/blogsSection';
import PodcastsSection from './sections/podcastsSection';

function MyContentMain({ section }) {
	const getContent = section => {
		switch (section) {
			case 'blogs':
				return <BlogSection />;
			// case 'news':
			// 	return <PublicAccountSection />;
			case 'podcasts':
				return <PodcastsSection />;
			default:
				return '';
		}
	};
	return (
		<Sheet
			sx={{
				flexGrow: 1,
				borderRadius: '30px',
				padding: '25px',
			}}
		>
			{getContent(section)}
		</Sheet>
	);
}

export default MyContentMain;
