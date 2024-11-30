import React, { useState, useRef, useContext } from 'react';
import 'react-quill/dist/quill.snow.css';
import { Box, TextField, CssBaseline, Stack, Typography, Chip, Button } from '@mui/material';
import { EditorContext } from '../pages/editor.page';
import '../commons/BlogTextEditor.css';
import { AddPhotoAlternate } from '@mui/icons-material';
import CategorySelect from './CategorySelect';
import QuillEditor from './QuillEditor';

const BlogTextEditor = () => {
    const { EditorState, setEditorState } = useContext(EditorContext);
    const titleRef = useRef('');
    const descriptionRef = useRef('');

    const [tags, setTags] = useState(EditorState.tags || []);
    const newTagRef = useRef(null);

    const handleFileSelect = (event) => {
        setEditorState({ ...EditorState, banner: URL.createObjectURL(event.target.files[0]), bannerFile: event.target.files[0] });
    };

    const handleAddTag = () => {
        const newTag = newTagRef.current.value.trim();
        if (newTag.length >= 3 && !tags.includes(newTag) && tags.length < 5) {
            const updatedTags = [...tags, newTag];
            setTags(updatedTags);
            setEditorState(prevState => ({
                ...prevState,
                tags: updatedTags,
            }));
            newTagRef.current.value = '';
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        const updatedTags = tags.filter(tag => tag !== tagToRemove);
        setTags(updatedTags);
        setEditorState(prevState => ({
            ...prevState,
            tags: updatedTags,
        }));
    };

    return (
        <>
            <CssBaseline />
            <Stack spacing={2} justifyContent="space-between" direction={{ sm: 'column', md: 'row' }}>
                <Box flex={3} p={3} sx={{ minWidth: '50%', pt: 1 }}>
                    <TextField
                        variant="outlined"
                        sx={{ width: '100%', mb: 5 }}
                        placeholder="Blog Title"
                        inputRef={titleRef}
                        defaultValue={EditorState.title}
                        onChange={e => setEditorState(prevState => ({ ...prevState, title: e.target.value }))}
                    />
                    <TextField
                        variant="outlined"
                        sx={{ width: '100%', mb: 5 }}
                        placeholder="Add a small description or introduction about your blog..."
                        inputRef={descriptionRef}
                        defaultValue={EditorState.description}
                        onChange={e => setEditorState(prevState => ({ ...prevState, description: e.target.value }))}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 5, p: 0, flexDirection: 'column', border: '1px dashed black' }}>
                        {EditorState.banner ? (
                            <>
                                <img src={EditorState.banner} alt="Cover" style={{ width: '100%', height: '80%' }} />
                                <Button variant="outlined" component="label" startIcon={<AddPhotoAlternate />} sx={{ width: '50%' }}>
                                    Change Cover Photo
                                    <input type="file" hidden onChange={handleFileSelect} />
                                </Button>
                            </>
                        ) : (
                            <Button variant="outlined" component="label" startIcon={<AddPhotoAlternate />} sx={{ m: 10 }}>
                                Add Cover Photo
                                <input type="file" hidden onChange={handleFileSelect} />
                            </Button>
                        )}
                    </Box>
                    <Box>
                        {tags.map(tag => (
                            <Chip key={tag} label={tag} onDelete={() => handleRemoveTag(tag)} sx={{ mr: 1, mb: 1 }} style={{ backgroundColor: '#40739e', color: 'white' }} />
                        ))}
                        <TextField
                            label="Tags"
                            inputRef={newTagRef}
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    handleAddTag();
                                }
                            }}
                            sx={{ minWidth: '150px', width: '100%', mb: 3 }}
                        />
                    </Box>
                    <CategorySelect />
                    <Box sx={{ padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px', height: '400px' }}>
                        <QuillEditor />
                    </Box>
                </Box>
                <Box flex={3} p={2}>
                    <Typography variant='h3' align='left' mb={2}>
                        {EditorState.title && EditorState.title.length > 0 ? EditorState.title : 'New Blog'}
                    </Typography>
                    <Typography variant='h6' align='left' mb={2}>
                        {EditorState.description && EditorState.description.length > 0 ? EditorState.description : ''}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 0, flexDirection: 'column' }}>
                        {EditorState.banner ? (
                            <img src={EditorState.banner} alt="Cover" style={{ width: '100%', height: '80%' }} />
                        ) : (
                            ""
                        )}
                    </Box>
                    <div className='preview-container' sx={{ width: '100%' }} dangerouslySetInnerHTML={{ __html: EditorState.content }} />
                </Box>
            </Stack>
        </>
    );
};

export default BlogTextEditor;
