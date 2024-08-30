import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import MyContentMain from '../components/myContentComponents/myContentMain';
import MyContentSidebar from '../components/myContentComponents/myContentSidebar';

import { Stack } from '@mui/joy';
import useProfile from '../hooks/useProfile';
import { mainMargin } from '../themes/mainMargin';
import { logoutFunc } from '../utils/authUtils/logout';

function MyContent() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const [section, setSection] = useState(null);
	const { data: profileData, isLoading } = useProfile();

	useEffect(() => {
		if (!isLoading && !profileData) {
			const handleLogout = async () => {
				await logoutFunc();
				navigate('/login');
				queryClient.removeQueries(['profile']);
				return true;
			};
			handleLogout();
		}
	}, [isLoading, profileData, navigate, queryClient]);

	useEffect(() => {
		if (profileData) {
			if (profileData.roles.includes('blogger')) {
				setSection('blogs');
			} else if (profileData.roles.includes('news_creator')) {
				setSection('news');
			} else {
				setSection(null);
			}
		}
	}, [profileData]);

	return (
		<Stack
			sx={{
				flexDirection: { xs: 'column', md: 'row' },
				marginX: mainMargin,
				marginTop: '40px',
				gap: '20px',
			}}
		>
			<MyContentSidebar
				selectedSection={section}
				setSection={setSection}
				roles={profileData?.roles}
			/>
			<MyContentMain section={section} />
		</Stack>
	);
}

export default MyContent;
