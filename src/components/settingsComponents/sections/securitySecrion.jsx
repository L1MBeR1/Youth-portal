import React, { useEffect, useState } from 'react';
import { Box, Stack, Typography, Button } from '@mui/joy';

import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import usePersonalData from '../../../hooks/usePersonalData';

import { logoutFunc } from '../../../utils/authUtils/logout';
import ChangePassword from '../modals/changePassword';
function SecuritySection() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const { data: userData, isLoading } = usePersonalData();

	useEffect(() => {
		if (!isLoading && !userData) {
			const handleLogout = async () => {
				await logoutFunc();
				navigate('/login');
				queryClient.removeQueries(['profile']);
				return true;
			};
			handleLogout();
		}
	}, [isLoading, userData, navigate, queryClient]);

	const [changePasswordOpen, setChangePasswordOpen] = useState(false);

	return (
		<>
			<Box>
				<ChangePassword
					id={userData?.id}
					open={changePasswordOpen}
					setOpen={setChangePasswordOpen}
				/>
				<Stack direction={'column'} spacing={3}>
					<Stack direction={'column'} spacing={1.5}>
						<Typography level='title-xl'>Пароль</Typography>
						<Typography level='body-md'>
							Надежный пароль — ключ к безопасности вашего аккаунта. Регулярная
							смена пароля поможет защитить ваши данные от несанкционированного
							доступа.
						</Typography>
						<Box>
							<Button
								size='md'
								onClick={() => {
									setChangePasswordOpen(true);
								}}
							>
								Изменить пароль
							</Button>
						</Box>
					</Stack>
				</Stack>
			</Box>
		</>
	);
}

export default SecuritySection;
