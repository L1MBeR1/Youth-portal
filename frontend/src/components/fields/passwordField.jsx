import emojiStrip from 'emoji-strip';
import React, { useState } from 'react';

import FormControl from '@mui/joy/FormControl';
import FormHelperText from '@mui/joy/FormHelperText';
import FormLabel from '@mui/joy/FormLabel';
import IconButton from '@mui/joy/IconButton';
import Input from '@mui/joy/Input';

import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';

function PasswordField({ error, label, password, setPassword }) {
	const [showPassword, setShowPassword] = useState(false);

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	const handlePasswordChange = e => {
		const filteredValue = emojiStrip(e.target.value);
		setPassword(filteredValue);
	};

	return (
		<FormControl error={Boolean(error)}>
			<FormLabel>{label}</FormLabel>
			<Input
				type={showPassword ? 'text' : 'password'}
				placeholder='Введите пароль'
				required
				value={password}
				onChange={handlePasswordChange}
				endDecorator={
					<IconButton color='neutral' onClick={togglePasswordVisibility}>
						{showPassword ? (
							<VisibilityOffRoundedIcon />
						) : (
							<VisibilityRoundedIcon />
						)}
					</IconButton>
				}
			/>
			<FormHelperText>{error}</FormHelperText>
		</FormControl>
	);
}

export default PasswordField;
