import React from 'react';

import Button from '@mui/joy/Button';

import { vkAuth } from '../../../api/authApi';
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
			const response = await vkAuth();
			if (response) {
				navigate('/');
			} else {
				throw new Error('Ошибка авторизации');
			}
		} catch (error) {
			console.error(error);
			setErrorMessage(
				error.message || 'Произошла ошибка авторизации через ВКонтакте'
			);
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
