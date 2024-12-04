import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Box, CardMedia, List, ListItem, ListItemText } from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { nanoid } from 'nanoid';

const parseEditorJsJson = (blocks) => {
    if (!blocks) {
        throw new Error('Invalid Editor.js data');
    }

    return blocks.map((block, index) => {
        const key = `${block.type}-${index}`;

        switch (block.type) {
            case 'paragraph':
                return <Typography key={key} variant="body1" gutterBottom mt={2}>{block.data.text}</Typography>;
            case 'header':
                return <Typography key={key} variant={`h${block.data.level}`} gutterBottom mt={2}>{block.data.text}</Typography>;
            case 'list':
                return (
                    <List
                        key={key}
                        component={block.data.style === 'ordered' ? 'ol' : 'ul'}
                        sx={{
                            listStyleType: block.data.style === 'ordered' ? 'decimal' : 'disc',
                            pl: 2,
                            fontSize: '18px',
                            '& .MuiListItem-root': {
                                display: 'list-item',
                                paddingLeft: 0,
                                paddingTop: 0.5,
                                paddingBottom: 0.5,
                            },
                        }}
                    >
                        {block.data.items.map((item, itemIndex) => (
                            <ListItem key={`${key}-${itemIndex}`}>
                                <ListItemText primary={item} />
                            </ListItem>
                        ))}
                    </List>
                );
            case 'image':
                return (
                    <CardMedia
                        key={key}
                        component="img"
                        image={block.data.file.url}
                        alt={block.data.caption || ''}
                        sx={{ mt: 2 }}
                    />
                );
            case 'quote':
                return (
                    <Box
                        key={key}
                        component="blockquote"
                        sx={{ borderLeft: '5px solid', paddingLeft: 2, margin: 2 }}
                        aria-label="quote"
                    >
                        <Typography variant="body1">{block.data.text}</Typography>
                        {block.data.caption && (
                            <Typography variant="caption" component="cite">{block.data.caption}</Typography>
                        )}
                    </Box>
                );
            case 'code':
                return (
                    <Box key={key} component="pre" sx={{ overflowX: 'auto', borderRadius: 1 }}>
                        <SyntaxHighlighter language="javascript" style={tomorrow}>
                            {block.data.code}
                        </SyntaxHighlighter>
                    </Box>
                );
            default:
                return (
                    <Box key={key} sx={{ backgroundColor: '#f5f5f5', padding: 2, borderRadius: 1 }}>
                        <Typography variant="body2" color="error">
                            Unknown block type: {block.type}
                        </Typography>
                    </Box>
                );
        }
    });
};

const JsonToHtmlParser = ({ editorJsData }) => {
    return parseEditorJsJson(editorJsData);
};

JsonToHtmlParser.propTypes = {
    editorJsData: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.string.isRequired,
            data: PropTypes.object.isRequired,
        })
    ).isRequired,
};

export default JsonToHtmlParser;
