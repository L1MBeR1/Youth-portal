import { Avatar, Badge, Box, IconButton, Stack, Typography } from '@mui/joy';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import useProfile from '../../../hooks/useProfile';
import useUser from '../../../hooks/useUser';

import EditIcon from '@mui/icons-material/Edit';
import { removeToken } from '../../../utils/authUtils/tokenStorage';
function PublicAccountSection() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const { data: profileData } = useProfile();
	const { data: userData, isLoading } = useUser(profileData?.user_id);

	useEffect(() => {
		if (!profileData) {
			const handleLogout = async () => {
				removeToken();
				navigate('/login');
				queryClient.removeQueries(['profile']);
			};
			handleLogout();
		}
	}, [profileData, navigate, queryClient]);

	return (
		<Box>
			<Stack direction={'column'} spacing={4}>
				<Typography level='title-xl'>Аккаунт</Typography>
				{!isLoading && profileData && (
					<>
						<Stack direction={'row'}>
							<Stack direction={'column'}>
								<Stack spacing={1}>
									<Typography level='body-sm'>Картинка профиля</Typography>
									<Badge
										anchorOrigin={{
											vertical: 'bottom',
											horizontal: 'right',
										}}
										badgeContent={
											<IconButton
												size='sm'
												sx={{ borderRadius: '100%' }}
												variant='solid'
												color='primary'
											>
												<EditIcon />
											</IconButton>
										}
										badgeInset='14%'
										sx={{ '--Badge-paddingX': '0px' }}
									>
										<Avatar
											src={userData?.profile_image_uri}
											sx={{
												cursor: 'pointer',
												'--Avatar-ringSize': '10px',
												'--Avatar-size': '200px',
											}}
										/>
									</Badge>
								</Stack>
							</Stack>
							<Stack direction={'column'}></Stack>
						</Stack>
					</>
				)}
			</Stack>
		</Box>
	);
}

export default PublicAccountSection;
