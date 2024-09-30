import { Avatar, Badge, Box, IconButton, Stack, Typography } from '@mui/joy';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import EditIcon from '@mui/icons-material/Edit';
import usePersonalData from '../../../hooks/usePersonalData';
import { removeToken } from '../../../utils/authUtils/tokenStorage';
import ChangeProfileImage from '../modals/changeProfileImage';
function PublicAccountSection() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const { data: userData, isLoading } = usePersonalData();

	useEffect(() => {
		if (!isLoading && !userData) {
			const handleLogout = async () => {
				removeToken();
				navigate('/login');
				queryClient.removeQueries(['profile']);
				return true;
			};
			handleLogout();
		}
	}, [isLoading, userData, navigate, queryClient]);

	const [changeProfileImageOpen, setChangeProfileImageOpen] = useState(false);
	return (
		<>
			<ChangeProfileImage
				id={userData?.id}
				open={changeProfileImageOpen}
				setOpen={setChangeProfileImageOpen}
			/>

			<Box>
				<Stack direction={'column'} spacing={4}>
					<Typography level='title-xl'>Аккаунт</Typography>
					{!isLoading && userData && (
						<>
							<Stack direction={'row'}>
								<Stack direction={'column'}>
									<Stack spacing={1}>
										<Typography level='body-sm'>Картинка профиля</Typography>
										<Badge
											onClick={() => {
												setChangeProfileImageOpen(true);
											}}
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
		</>
	);
}

export default PublicAccountSection;
