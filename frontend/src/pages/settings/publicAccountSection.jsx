import {
	Avatar,
	Badge,
	Box,
	Button,
	IconButton,
	Stack,
	Typography,
} from '@mui/joy';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import EditIcon from '@mui/icons-material/Edit';
import ChangeNickname from '../../components/settingsComponents/modals/changeNickname';
import ChangeProfileImage from '../../components/settingsComponents/modals/changeProfileImage';
import usePersonalData from '../../hooks/usePersonalData';
import { removeToken } from '../../utils/authUtils/tokenStorage';
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
	const [changeNicknameOpen, setChangeNicknameOpen] = useState(false);
	return (
		<>
			<ChangeProfileImage
				id={userData?.id}
				open={changeProfileImageOpen}
				setOpen={setChangeProfileImageOpen}
			/>
			<ChangeNickname
				id={userData?.id}
				open={changeNicknameOpen}
				setOpen={setChangeNicknameOpen}
			/>
			<Box>
				<Stack direction={'column'} spacing={4}>
					<Typography level='title-xl'>Публичный профиль</Typography>
					{!isLoading && userData && (
						<>
							<Stack
								flexGrow={1}
								justifyContent={'space-between'}
								gap={2.5}
								sx={{
									flexDirection: { xs: 'column-reverse', mdx: 'row' },
								}}
							>
								<Stack direction={'row'}>
									<Stack spacing={1.5}>
										<Typography level='title-lg'>Отображаемое имя</Typography>

										<Stack spacing={2} direction={'row'} alignItems={'center'}>
											<Typography>{userData?.nickname}</Typography>
											<Button
												size='sm'
												onClick={() => {
													setChangeNicknameOpen(true);
												}}
											>
												Изменить
											</Button>
										</Stack>
									</Stack>
								</Stack>
								<Stack direction={'column'} spacing={1}>
									<Typography level='title-md'>Картинка профиля</Typography>
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
										sx={{ '--Badge-paddingX': '0px', maxWidth: 'fit-content' }}
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
						</>
					)}
				</Stack>
			</Box>
		</>
	);
}

export default PublicAccountSection;
