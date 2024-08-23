import React, { useState } from 'react';
import { Box, Typography, Input, Textarea, Button, Card, IconButton } from '@mui/joy';
import QuillEditor from './QuillEditor.jsx';
import { addBlog } from '../../../api/blogsApi.js';
import { uploadFile } from '../../../api/files.js';
import { getToken } from '../../../utils/authUtils/tokenStorage.js';
import UploadIcon from '@mui/icons-material/Upload';

function BlogCreator() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [coverImage, setCoverImage] = useState(null);
    const [coverImageUrl, setCoverImageUrl] = useState('');

    const handleChildData = (data) => {
        console.log("Данные от дочернего компонента:", data);
        setContent(data);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverImage(file);
            setCoverImageUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { token, needsRedirect } = await getToken();
        console.log('Title:', title);
        console.log('Description:', description);
        console.log('Content HTML:', content);
        
        let coverImageUri = '';
        if (coverImage) {
            coverImageUri = await uploadFile({
                contentType: 'blogs', 
                contentId: `${Math.round( Math.random()*100000)}`, 
                file: coverImage
            }); 
        }

        // console.log(coverImageUri);

        const response = await addBlog(token, {
            "title": title,
            "description": {
                "desc": description,
                "meta": [
                    "Что-то", "сделать", "с тегами"
                ]
            },
            "content": content,
            "cover_uri": coverImageUri
        });

        if (response) {
            alert(response.message);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: '#fff',
                padding: { xs: 3, md: 6 },
            }}
        >
            <Card
                variant="outlined"
                sx={{
                    width: '100%',
                    maxWidth: '800px',
                    p: { xs: 3, md: 4 },
                    bgcolor: '#fff',
                    borderRadius: 2,
                    boxShadow: 'none',
                }}
            >
                <Typography level="h1" sx={{ mb: 3, fontSize: { xs: '1.75rem', md: '2.25rem' }, fontWeight: 600 }}>
                    Создайте новый блог
                </Typography>
                <Typography level="body1" sx={{ color: 'text.primary', mb: 4, fontSize: { xs: '0.95rem', md: '1.05rem' } }}>
                    Заполните форму ниже, чтобы опубликовать новое сообщение в блоге. Чем больше деталей вы предоставляете, тем лучше будет ваш пост!
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Box sx={{ display: 'grid', gap: 4 }}>
                        <Box>
                            <Typography level="body2" sx={{ mb: 1, fontWeight: 500 }}>
                                Заголовок
                            </Typography>
                            <Input
                                fullWidth
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Введите заголовок для блога"
                                sx={{ bgcolor: '#fff', padding: 2, borderRadius: 1 }}
                            />
                        </Box>
                        <Box>
                            <Typography level="body2" sx={{ mb: 1, fontWeight: 500 }}>
                                Описание
                            </Typography>
                            <Textarea
                                minRows={4}
                                fullWidth
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Предоставьте краткое описание вашего блога"
                                sx={{ bgcolor: '#fff', padding: 2, borderRadius: 1 }}
                            />
                        </Box>
                        <Box>
                            <Typography level="body2" sx={{ mb: 1, fontWeight: 500 }}>
                                Содержание
                            </Typography>
                            <QuillEditor value={content} onDataSend={handleChildData}/>
                        </Box>
                        <Box>
                            <Typography level="body2" sx={{ mb: 1, fontWeight: 500 }}>
                                Картинка обложки
                            </Typography>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                sx={{ mb: 2 }}
                            />
                            {coverImageUrl && (
                                <img src={coverImageUrl} alt="Cover Preview" style={{ maxWidth: '100%', height: 'auto' }} />
                            )}
                        </Box>
                        <Button
                            type="submit"
                            variant="solid"
                            color="primary"
                            sx={{ mt: 3, py: 2, borderRadius: 1, boxShadow: 'none' }}
                        >
                            Опубликовать
                        </Button>
                    </Box>
                </form>
            </Card>
        </Box>
    );
}

export default BlogCreator;
