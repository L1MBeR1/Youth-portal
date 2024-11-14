import React, { useState } from 'react';
import { Box, Button, Card, Typography, FormControl, FormLabel, Textarea, Select, Option, Stack, Snackbar } from '@mui/joy';

import { createReport } from '../../api/reports';
import { getToken } from '../../utils/authUtils/tokenStorage';
import { useNavigate } from 'react-router-dom';


export default function ReportResourceForm({ resourceType, resourceId }) {
    const [reason, setReason] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    const getAndCheckToken = async () => {
        const { token, needsRedirect } = await getToken();
        if (needsRedirect) {
            navigate('/login');
        }
        return token;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reason) {
            // TODO: тут сообщение (например, тост) об ошибке, что нужно выбрать причину
        }

        const token = await getAndCheckToken();
        createReport(token, resourceType, resourceId, reason, description);

        // TODO: тут сообщение об успешной отправке

        // Сброс формы
        setReason('');
        setDescription('');
    };



    return (
        <Card variant="plain" sx={{ width: '100%', maxWidth: 500, mx: 'auto', p: 2, color: '#fff' }}>
            <form onSubmit={handleSubmit}>
                <Stack spacing={2}>
                    <FormControl>
                        <FormLabel>Причина жалобы *</FormLabel>
                        <Select value={reason} onChange={(e, newValue) => setReason(newValue)} placeholder="Выберите причину" required>
                            <Option value="inappropriate">Неподобающий контент</Option>
                            <Option value="copyright">Нарушение авторских прав</Option>
                            <Option value="misinformation">Дезинформация</Option>
                        </Select>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Дополнительные детали (необязательно)</FormLabel>
                        <Textarea
                            placeholder="Описание жалобы."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </FormControl>
                    <Button type="submit" fullWidth>Отправить жалобу</Button>
                </Stack>
            </form>
        </Card>
    );
}
