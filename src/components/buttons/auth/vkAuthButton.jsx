import Button from '@mui/joy/Button';
import React from 'react';
import { vkTokens } from '../../../api/authApi';
import vkLogo from '../../../img/VKLogo.svg';

export const VkAuthButton = ({
	label,
	variant,
	navigate,
	setErrorMessage,
	setIsLoading,
}) => {
	const handleSubmit = async () => {
		setIsLoading(true);
		setErrorMessage('');

		try {
			const response = await vkTokens();
			console.log(response);
			if (response && response.status === 'success') {
				const {
					client_id,
					code_challenge,
					code_challenge_method,
					code_verifier,
					state,
				} = response;

				sessionStorage.setItem('code_verifier', code_verifier);
				sessionStorage.setItem('state', state);
				const redirect_uri = process.env.REACT_APP_VK_REDIRECT_URL;
				const vkAuthUrl = `https://id.vk.com/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&state=${state}&code_challenge=${code_challenge}&code_challenge_method=${code_challenge_method}&scope=email`;

				window.location.href = vkAuthUrl;
				console.log(vkAuthUrl);
			} else {
				throw new Error('Ошибка авторизации');
			}
		} catch (error) {
			console.error(error);
			setErrorMessage('Ошибка при авторизации через ВКонтакте');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button
			onClick={() => handleSubmit()}
			variant={variant}
			startDecorator={<img width='20px' src={vkLogo} alt='ВКонтакте' />}
		>
			{label}
		</Button>
	);
};
