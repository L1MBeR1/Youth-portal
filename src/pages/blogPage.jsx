import React from 'react';
import { useParams } from 'react-router-dom';
import { getBlog } from '../api/blogsApi.js';
import { formatDate } from '../utils/timeAndDate/formatDate.js';

import usePublicationById from '../hooks/usePublicationById.js';

import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import Stack from '@mui/joy/Stack';
import Avatar from '@mui/joy/Avatar';
import Typography from '@mui/joy/Typography';

import VisibilityIcon from '@mui/icons-material/Visibility';

import DOMPurify from 'dompurify';
import { CommentSection } from '../components/comments/commentsSection.jsx';
import { PublicationStatistic } from '../components/publicationsComponents/publicationStatistic .jsx';
function BlogPage() {
	const { id } = useParams();
	const { data, isFetching } = usePublicationById('blog', getBlog, id);
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
				marginX: { xs: '10px', md: '10%', lg: '15%' },
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
						p: 0,
					}}
				>
					<Stack spacing={3} marginTop={2}>
						<Stack direction={'row'} justifyContent={'space-between'}>
							<Stack direction={'column'} spacing={2}>
								<Typography level='h1' fontSize={'45px'}>
									{data.title}
								</Typography>
								<Stack direction={'row'} spacing={2}>
									<Typography level='body-md'>
										{formatDate(data.created_at)}
									</Typography>
									<Stack direction={'row'} spacing={0.75} alignItems={'center'}>
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
						<PublicationStatistic
							id={data.id}
							liked={data.is_liked}
							likes={data.likes}
							reposts={data.reposts}
							views={data.views}
						/>
						<CommentSection type={'blog'} id={data.id} />
					</Stack>
				</Card>
			)}
		</Box>
	);
}

export default BlogPage;
