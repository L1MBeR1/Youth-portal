import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';

import Stack from '@mui/joy/Stack';

import ModeratorMain from '../components/workspaceComponents/moderator/moderatorMain';
import ModeratorSidebar from '../components/workspaceComponents/moderator/moderatorSidebar';
import Header from '../components/workspaceComponents/shared/workSpaceHeader';
function Moderator() {
	const [section, setSection] = useState('blogs');
	const [open, setOpen] = useState(false);

	const queryClient = useQueryClient();

	useEffect(() => {
		return () => {
			console.log('Удаление кэша модератора');
			queryClient.removeQueries({
				predicate: query => {
					return query.meta?.tags?.includes('service');
				},
			});
		};
	}, [queryClient]);

	return (
		<Stack
			sx={{
				minHeight: '100vh',
				overflow: 'hidden',
				maxHeight: '100vh',
			}}
		>
			<Header setOpen={setOpen} open={open} />
			<main className='layout-main'>
				<Stack
					direction='row'
					sx={{
						flexGrow: 1,
						overflow: 'hidden',
					}}
				>
					<ModeratorSidebar
						selectedSection={section}
						setSection={setSection}
						open={open}
						setOpen={setOpen}
					/>
					<ModeratorMain section={section} />
				</Stack>
			</main>
		</Stack>
	);
}

export default Moderator;
