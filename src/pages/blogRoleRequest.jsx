import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import usePersonalData from '../hooks/usePersonalData';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import DOMPurify from 'dompurify';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../utils/authUtils/tokenStorage';

import { mainMargin } from '../themes/mainMargin.js';
import {
    Button,
    FormControl,
    FormLabel,
} from '@mui/joy';
import { requestBloggerRole } from '../api/usersApi.js';


function RoleRequest() {
    const { data: userData } = usePersonalData();
    const [moveButtonDown, setMoveButtonDown] = useState(false);
    const textareaRef = useRef(null);

    const [text, setText] = useState('');
    const [isLoadingUpdate] = useState(false);
    const navigate = useNavigate();

    const handleTextChange = (event) => {
        const value = event.target.value;
        setText(value);
        setMoveButtonDown(value.length > 30 || value.includes('\n'));
    };

    useEffect(() => {
        if (moveButtonDown) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        } else {
            textareaRef.current.style.height = 'auto';
        }
    }, [text, moveButtonDown]);

    const handleSubmit = async () => {
        const sanitizedText = DOMPurify.sanitize(text);
        console.log(sanitizedText);
        const { token, needsRedirect } = await getToken();
        if (needsRedirect) {
            navigate('/login');
        }
        let response;

        response = await requestBloggerRole(
            userData.user_id,
            token,
            sanitizedText
        );

        if (response) {
            setText('');
            setMoveButtonDown(false);
            console.log(response);
        }
    };

    return (
        <Box
            sx={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                marginX: mainMargin,
            }}
        >
            {' '}

            <Card
                variant='plain'
                sx={{
                    marginTop: '20px',
                    '--Card-radius': '20px',
                    p: '20px',
                }}
            >
                <Box sx={{ padding: { xs: '0px', sm: '20px' } }}>
                    <Stack spacing={3}>
                        <Typography level='publications-h1'>Запрос на роль блогера</Typography>
                        <FormControl sx={{ maxWidth: '1000px' }}>
                            <FormLabel>О себе</FormLabel>

                            <Sheet
                                sx={{
                                    position: 'relative',
                                    width: '100%',
                                    outline: '1px solid black',
                                    borderRadius: '20px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    background: 'var(--joy-palette-main-background)',
                                    padding: { xs: '4px 20px', md: '12px 20px' },
                                }}
                            >
                                <textarea
                                    placeholder='Введите информацию о себе'
                                    value={text}
                                    maxLength={1500}
                                    onChange={handleTextChange}
                                    ref={textareaRef}
                                    style={{
                                        fontFamily: 'inter',
                                        fontSize: 'clamp(0.85rem, 3vw, 1rem)',
                                        resize: 'none',
                                        width: '100%',
                                        padding: '0',
                                        paddingTop: '7px',
                                        paddingBottom: moveButtonDown ? '10px' : '0',
                                        boxSizing: 'border-box',
                                        minHeight: '40px',
                                        border: 'none',
                                        outline: 'none',
                                        background: 'var(--joy-palette-main-background)',
                                        overflow: 'hidden',
                                    }}
                                    rows={1}
                                />
                                <Typography
                                    level="body-xs"
                                    sx={{ ml: 'auto', textAlign: 'right', color: '#888' }}>
                                    {text.length} / 1500 символов
                                </Typography>

                            </Sheet>
                        </FormControl>

                        <Stack direction={'row'} spacing={4}>
                            <Box>
                                <Button
                                    loading={isLoadingUpdate}
                                    onClick={() => {
                                        handleSubmit();
                                    }}
                                >
                                    Отправить
                                </Button>
                            </Box>
                            <Box>
                                <Button
                                    variant='soft'>
                                    Назад
                                </Button>
                            </Box>
                        </Stack>
                    </Stack>
                </Box>
            </Card>

        </Box>
    );
}

export default RoleRequest;



