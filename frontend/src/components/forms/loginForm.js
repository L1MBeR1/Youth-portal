import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { setCookie} from '../../cookie/cookieUtils';
import { login } from '../../api.js';

import Card from '@mui/joy/Card';
import Box from '@mui/joy/Box';
import Stack from '@mui/joy/Stack';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import FormHelperText from '@mui/joy/FormHelperText';
import IconButton from '@mui/joy/IconButton';

import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';

import {jwtDecode} from 'jwt-decode';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      const token = data.access_token;
      console.log(token)
      if (token) {
        setCookie('token', token, { expires: 1 / 12 });
        const decoded = jwtDecode(token);
        if (decoded.roles.includes('admin')) {
          navigate('/admin');
        } else if (decoded.roles.includes('moderator')) {
          navigate('/moderator');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      setError('Ошибка авторизации. Пожалуйста, проверьте свои данные.');
      console.error('Login failed', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
      <Card
        sx={{
          width: '100%',
          maxWidth: '450px',
        }}
      >
        <form onSubmit={handleSubmit}>
          <Stack spacing={1.5}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography level="h4">Вход в аккаунт</Typography>
            </Box>
            {error && (
              <Typography level="body-sm" color="danger">
                {error}
              </Typography>
            )}
            <FormControl>
              <FormLabel>Почта</FormLabel>
              <Input
                placeholder="Введите почту"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Пароль</FormLabel>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Введите пароль"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                endDecorator={
                  <IconButton color="neutral" onClick={togglePasswordVisibility}>
                    {showPassword ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                  </IconButton>
                }
              />
              <FormHelperText>
                <Link to="/recovery">Забыли пароль?</Link>
              </FormHelperText>
            </FormControl>
            <Button type="submit">Войти</Button>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                paddingTop: '5px',
                gap: '5px',
              }}
            >
              <Typography level="body-sm">Нет аккаунта?</Typography>
              <Link to="/registration">
                <Typography level="body-sm">Зарегистрироваться</Typography>
              </Link>
            </Box>
            
          </Stack>
        </form>
      </Card>
  );
}

export default LoginForm;