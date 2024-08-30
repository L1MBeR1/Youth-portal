import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';

import Stack from '@mui/joy/Stack';

import Header from '../components/workspaceComponents/shared/workSpaceHeader';
import SuMain from '../components/workspaceComponents/superUser/suMain';
import SuSidebar from '../components/workspaceComponents/superUser/suSidebar';
function Admin() {
	const [section, setSection] = useState('moderators');
	const [open, setOpen] = useState(false);

	const queryClient = useQueryClient();

	useEffect(() => {
		return () => {
			console.log('Удаление кэша админа');
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
					<SuSidebar
						selectedSection={section}
						setSection={setSection}
						open={open}
						setOpen={setOpen}
					/>
					<SuMain section={section} />
				</Stack>
			</main>
		</Stack>
	);
}

export default Admin;
