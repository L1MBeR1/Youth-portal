import React from 'react';
import { useParams } from 'react-router-dom';
import { getBlog } from '../api/blogsApi.js';
import { formatDate } from '../utils/timeAndDate/formatDate.js';

import usePublicationById from '../hooks/usePublicationById.js';

import AspectRatio from '@mui/joy/AspectRatio';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';

import VisibilityIcon from '@mui/icons-material/Visibility';

import DOMPurify from 'dompurify';

import { CommentSection } from '../components/comments/commentsSection.jsx';
import ScrollButton from '../components/common/scrollButton.jsx';
import { PublicationStatistic } from '../components/publicationsComponents/publicationStatistic.jsx';
import useProfile from '../hooks/useProfile.js';
import { mainMargin } from '../themes/mainMargin.js';

function BlogPage() {
	const { id } = useParams();
	const { data, isFetching } = usePublicationById('blog', getBlog, id);
	const { data: profileData } = useProfile();

	console.log(data);

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
						<Stack spacing={3} marginTop={2}>
							<Stack direction={'row'} justifyContent={'space-between'}>
								<Stack direction={'column'} spacing={2}>
									<Typography level='publications-h1'>{data.title}</Typography>
									<Stack direction={'row'} spacing={2}>
										<Typography level='body-md'>
											{formatDate(data.created_at)}
										</Typography>
										<Stack
											direction={'row'}
											spacing={0.75}
											alignItems={'center'}
										>
											<VisibilityIcon fontSize='14px' />
											<Typography level='body-md'>{data.views}</Typography>
										</Stack>
									</Stack>
								</Stack>
								<Stack direction={'column'}>
									<Stack direction={'row'} alignItems={'center'} spacing={2}>
										<Avatar
											size='lg'
											src={data.profile_image_uri}
											alt={data.nickname}
										/>
										<Typography level='title-md'>{data.nickname}</Typography>
									</Stack>
								</Stack>
							</Stack>
							<AspectRatio maxHeight={'350px'}>
								<img src={data.cover_uri} alt={data.title} />
							</AspectRatio>
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
								type={'blog'}
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

export default BlogPage;
