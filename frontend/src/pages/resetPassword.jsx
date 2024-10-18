import { Box, CircularProgress } from '@mui/joy';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { postValidateEmailToken } from '../api/authApi';
import ResetPasswordForm from '../components/forms/resetPasswordForm';

function ResetPassword() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(true);
	const token = searchParams.get('token');

	useEffect(() => {
		const validateToken = async () => {
			if (!token) {
				navigate('/404');
				return;
			}

			try {
				const response = await postValidateEmailToken(token);
				console.log(response);
				setIsLoading(false);
			} catch (error) {
				navigate('/404');
			}
		};

		validateToken();
	}, [token, navigate]);
	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				flexGrow: '1',
				mx: '15px',
				minHeight: '70vh',
			}}
		>
			{isLoading ? (
				<CircularProgress size='lg' />
			) : (
				<ResetPasswordForm token={token} />
			)}
		</Box>
	);
}

export default ResetPassword;
