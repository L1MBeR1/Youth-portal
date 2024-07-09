import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Card from '@mui/joy/Card';
import Box from '@mui/joy/Box';
import Stack from '@mui/joy/Stack';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import IconButton from '@mui/joy/IconButton';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import Sheet from '@mui/joy/Sheet';

import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';

import PasswordField from '../components/formComponents/passwordField';
import EmailField from '../components/formComponents/emailField';

function Registration() {
  const [email, setEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState('');
  const [emailError, setEmailError] = useState('');

  const [password, setPassword] = useState('');
  
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [passwordRepeatError, setPasswordRepeatError] = useState('');

  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    specialChar: false,
    uppercase: false,
  });


  useEffect(() => {
    setPasswordCriteria({
      length: password.length >= 8,
      specialChar: /[!@#$%^&*]/.test(password),
      uppercase: /[A-ZА-Я]/.test(password),
    });
  }, [password]);

  useEffect(() => {
    if (!(password===passwordRepeat)&&!(password.length===0)&&!(passwordRepeat.length===0)){
      setPasswordRepeatError('Пароли не совпадают')
    }
    else{
      setPasswordRepeatError('')
    }
  }, [password,passwordRepeat]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (emailStatus === 'Valid' && passwordCriteria.length && passwordCriteria.specialChar && passwordCriteria.uppercase) {
      // Do something with email and password
      console.log("Email:", email);
      console.log("Password:", password);
    } else {
      console.log("Invalid email or password");
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '50px 10px',
      }}
    >
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
              <Typography level="h4">Регистрация</Typography>
            </Box>
            <EmailField
              email={email}
              setEmail={setEmail}
              setEmailStatus={setEmailStatus}
              setEmailError={setEmailError}
            />
            <PasswordField
              lable='Пароль'
              password={password}
              setPassword={setPassword}
            />
            <Sheet>
              <Typography level="body-xs">Пароль должен содержать:</Typography>
              <List size="sm" sx={{ "--List-gap": "-5px" }}>
                <ListItem>
                  {passwordCriteria.length ? <CheckCircleOutlinedIcon style={{ color: 'green' }} /> : <CircleOutlinedIcon />}
                  <Typography level="body-xs">длину больше 8 символов</Typography>
                </ListItem>
                <ListItem>
                  {passwordCriteria.specialChar ? <CheckCircleOutlinedIcon style={{ color: 'green' }} /> : <CircleOutlinedIcon />}
                  <Typography level="body-xs">специальные символы (например, !, @, #, $, %, ^, &, *)</Typography>
                </ListItem>
                <ListItem>
                  {passwordCriteria.uppercase ? <CheckCircleOutlinedIcon style={{ color: 'green' }} /> : <CircleOutlinedIcon />}
                  <Typography level="body-xs">одну заглавную букву</Typography>
                </ListItem>
              </List>
            </Sheet>
            <PasswordField
              lable='Повторите пароль'
              password={passwordRepeat}
              setPassword={setPasswordRepeat}
              error={passwordRepeatError}
            />
            <Button type="submit">Зарегистрироваться</Button>
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
              <Typography level="body-sm">Уже есть аккаунт?</Typography>
              <Link to="/login">
                <Typography level="body-sm">Войти в аккаунт</Typography>
              </Link>
            </Box>
          </Stack>
        </form>
      </Card>
    </Box>
  );
}

export default Registration;
