import React, { useRef, useState } from 'react';
import { Box, Typography, Input, Textarea, Button, Card } from '@mui/joy';
import QuillEditor from './QuillEditor';
import Quill from 'quill';

function BlogCreatorV2() {
    const Delta = Quill.import('delta');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');

    const handleChildData = (data) => {
        console.log("Данные от дочернего компонента:", data);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Сохранение данных (title, description, content) через API
    };


    const [range, setRange] = useState();
    const [lastChange, setLastChange] = useState();
    const [readOnly, setReadOnly] = useState(false);

    // Use a ref to access the quill instance directly
    const quillRef = useRef();

    return (
        <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: { xs: 3, md: 6 }, display: 'grid', gap: 3, gridTemplateColumns: { md: '3fr 1fr' } }}>
            <Card variant="outlined" sx={{ p: 3, bgcolor: 'background.level1', boxShadow: 'md', borderRadius: 2 }}>
                <Typography level="h1" sx={{ mb: 2, fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 'bold' }}>
                    Create a New Blog Post
                </Typography>
                <Typography level="body1" sx={{ color: 'text.tertiary', mb: 4, fontSize: { xs: '0.875rem', md: '1rem' } }}>
                    Fill out the form below to publish a new blog post. The more details you provide, the better your post will be!
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Box sx={{ display: 'grid', gap: 3 }}>
                        <Box>
                            <Typography level="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                                Title
                            </Typography>
                            <Input
                                fullWidth
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter a title for your blog post"
                                sx={{ padding: 1.5, borderRadius: 1, boxShadow: 'inset 0 0 0 1px #ddd' }}
                            />
                        </Box>
                        <Box>
                            <Typography level="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                                Description
                            </Typography>
                            <Textarea
                                minRows={3}
                                fullWidth
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Provide a brief description of your blog post"
                                sx={{ padding: 1.5, borderRadius: 1, boxShadow: 'inset 0 0 0 1px #ddd' }}
                            />
                        </Box>
                        <Box>
                            <Typography level="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                                Content
                            </Typography>
                            <QuillEditor
                                ref={quillRef}
                                onDataSend={handleChildData}
                                readOnly={readOnly}
                                defaultValue={new Delta()
                                    .insert('Hello')
                                    .insert('\n', { header: 1 })
                                    .insert('Some ')
                                    .insert('initial', { bold: true })
                                    .insert(' ')
                                    .insert('content', { underline: true })
                                    .insert('\n')}
                                onSelectionChange={setRange}
                                onTextChange={setLastChange}
                            />
                            <div class="controls">
                                <label>
                                    Read Only:{' '}
                                    <input
                                        type="checkbox"
                                        value={readOnly}
                                        onChange={(e) => setReadOnly(e.target.checked)}
                                    />
                                </label>
                                <button
                                    className="controls-right"
                                    type="button"
                                    onClick={() => {
                                        alert(quillRef.current?.getLength());
                                    }}
                                >
                                    Get Content Length
                                </button>
                            </div>
                            <div className="state">
                                <div className="state-title">Current Range:</div>
                                {range ? JSON.stringify(range) : 'Empty'}
                            </div>
                            <div className="state">
                                <div className="state-title">Last Change:</div>
                                {lastChange ? JSON.stringify(lastChange.ops) : 'Empty'}
                            </div>
                            {/* <QuillEditor onUpdate={handleSaveContent} /> */}
                        </Box>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ mt: 2, py: 1.5, borderRadius: 1, boxShadow: '0 4px 6px rgba(0,0,0,0.1)', '&:hover': { boxShadow: '0 6px 10px rgba(0,0,0,0.2)' } }}
                        >
                            Publish Blog Post
                        </Button>
                    </Box>
                </form>
            </Card>
        </Box>
    );
}

export default BlogCreatorV2;
