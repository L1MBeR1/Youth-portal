import React, { useState } from 'react';
import validator from 'validator';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import FormHelperText from '@mui/joy/FormHelperText';
import CircularProgress from '@mui/joy/CircularProgress';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

function EmailField({ email, setEmail, setEmailStatus, setEmailError }) {
  const [emailStatus, localSetEmailStatus] = useState('');
  const [emailError, localSetEmailError] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleEmailBlur = () => {
    localSetEmailStatus('Loading');
    setEmailStatus('Loading');
    if (email.length === 0) {
      localSetEmailStatus('');
      setEmailStatus('');
    } else if (!validator.isEmail(email)) {
      localSetEmailStatus('Invalid');
      setEmailStatus('Invalid');
      localSetEmailError('Неправильная почта');
      setEmailError('Неправильная почта');
    } else {
      localSetEmailStatus('Valid');
      setEmailStatus('Valid');
    }
  };

  const handleEmailFocus = () => {
    localSetEmailStatus('');
    setEmailStatus('');
    localSetEmailError('');
    setEmailError('');
  };

  return (
    <FormControl error={Boolean(emailError)}>
      <FormLabel>Почта</FormLabel>
      <Input
        placeholder="Введите почту"
        required
        value={email}
        onChange={handleEmailChange}
        onBlur={handleEmailBlur}
        onFocus={handleEmailFocus}
        endDecorator={
          emailStatus === 'Valid' ? (
            <CheckCircleOutlinedIcon style={{ color: 'green' }} />
          ) : emailStatus === 'Invalid' ? (
            <ErrorOutlineOutlinedIcon style={{ color: 'red' }} />
          ) : emailStatus === 'Loading' ? (
            <CircularProgress size={20} />
          ) : null
        }
      />
      <FormHelperText>{emailError}</FormHelperText>
    </FormControl>
  );
}

export default EmailField;