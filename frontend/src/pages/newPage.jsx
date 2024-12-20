import React from 'react';
import { useParams } from 'react-router-dom';
import { getNew } from '../api/newsApi.js';
import usePublicationById from '../hooks/usePublicationById.js';

import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';

import AspectRatio from '@mui/joy/AspectRatio';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';

import DOMPurify from 'dompurify';
import { CommentSection } from '../components/comments/commentsSection.jsx';

import ScrollButton from '../components/buttons/scrollButton.jsx';
import { PublicationStatistic } from '../components/publicationsComponents/publicationStatistic.jsx';
import useProfile from '../hooks/useProfile.js';
import { mainMargin } from '../themes/margins.js';

function NewsPage() {
	const { id } = useParams();
	const { data, isFetching } = usePublicationById('news', getNew, id);
	console.log(data);

	const { data: profileData } = useProfile();

	const createMarkup = html => {
		return { __html: DOMPurify.sanitize(html) };
	};
	return (
		<Box
			sx={{
				position: 'relative',
				display: 'flex',
				flexDirection: 'column',
				flexGrow: 1,
				marginX: mainMargin,
			}}
		>
			{' '}
			{isFetching || !data ? (
				<></>
			) : (
				<Card
					variant='plain'
					sx={{
						marginTop: '20px',
						'--Card-radius': '20px',
						p: '20px',
					}}
				>
					<Box sx={{ padding: { xs: '0px', sm: '20px' } }}>
						<ScrollButton type='top' />
						<ScrollButton type='bottom' />
						<Stack spacing={3}>
							<AspectRatio maxHeight={'350px'}>
								<img src={data.cover_uri} alt={data.title} />
							</AspectRatio>
							<Stack
								direction='row'
								justifyContent='center'
								alignItems='center'
								spacing={2}
							>
								<Typography level='publications-h1'>{data.title}</Typography>
							</Stack>
							<Box>
								<Typography level='body-lg'>
									<Box dangerouslySetInnerHTML={createMarkup(data.content)} />
								</Typography>
							</Box>
							<Box>
								<PublicationStatistic
									id={data.id}
									liked={data.is_liked}
									likes={data.likes}
									reposts={data.reposts}
									views={data.views}
									profileData={profileData}
								/>
							</Box>
							<CommentSection
								type={'news'}
								id={data.id}
								profileData={profileData}
							/>
						</Stack>
					</Box>
				</Card>
			)}
		</Box>
	);
}

export default NewsPage;
