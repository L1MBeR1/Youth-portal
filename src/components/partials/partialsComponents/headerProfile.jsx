import React from 'react';
import { Link } from 'react-router-dom';
import useProfile from '../../../hooks/useProfile.js';

import Box from '@mui/joy/Box';
import CircularProgress from '@mui/joy/CircularProgress';
import IconButton from '@mui/joy/IconButton';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import DrawerAvatar from './drawerAvatar.jsx';
import MenuAvatar from './menuAvatar.jsx';

import { Button, Typography } from '@mui/joy';

function HeaderProfile() {
	const { data: profileData, isLoading } = useProfile();

	return (
		<Box
			sx={{
				display: 'flex',
				flexGrow: 1,
				minWidth: '39px',
				justifyContent: 'center',
				alignContent: 'center',
			}}
		>
			{/* <CircularProgress color="neutral"size="sm" variant="solid" /> */}
			{isLoading ? (
				<CircularProgress
					color='neutral'
					size='sm'
					sx={{ '--CircularProgress-size': '30px' }}
				/>
			) : profileData ? (
				<>
					<DrawerAvatar
						img={profileData.profile_image_uri}
						id={profileData.user_id}
						roles={profileData.roles}
						nickname={profileData.nickname}
					/>
					<MenuAvatar
						img={profileData.profile_image_uri}
						id={profileData.user_id}
						roles={profileData.roles}
					/>
				</>
			) : (
				<Link to='/login'>
					<Box sx={{ display: { xs: 'none', mdx: 'block' } }}>
						<Button
							color={'primary'}
							sx={{
								borderRadius: '50px',
							}}
						>
							<Typography
								level={'headerButton'}
								textColor={'var(--joy-palette-staticColors-mainLight)'}
							>
								Войти в аккаунт
							</Typography>
						</Button>
					</Box>
					<Box sx={{ display: { xs: 'block', mdx: 'none' } }}>
						<IconButton
							size='lg'
							sx={{
								borderRadius: '10px',
							}}
						>
							<AccountCircleIcon />
						</IconButton>
					</Box>
				</Link>
			)}
		</Box>
	);
}
export default HeaderProfile;
