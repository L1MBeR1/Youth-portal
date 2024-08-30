import { Sheet } from '@mui/joy';
import React from 'react';

import BlogSections from './sections/blogsSections';

function MyContentMain({ section }) {
	const getContent = section => {
		switch (section) {
			case 'blogs':
				return <BlogSections />;
			// case 'news':
			// 	return <PublicAccountSection />;
			// case 'podcasts':
			// 	return <SecuritySection />;
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
