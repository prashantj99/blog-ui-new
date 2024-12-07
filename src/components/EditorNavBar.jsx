import { AppBar, Box, Button, Toolbar, Typography, styled } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useBlog from '../hooks/useBlog.jsx';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import ScheduleIcon from '@mui/icons-material/Schedule';
import formatRelativeTime from '../utils/date_formatter.js';

const CustomIconButton = styled(Button)(({ theme }) => ({
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.paper,
    textTransform: 'none',
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1, 2),
    boxShadow: theme.shadows[1],
}));

const Icons = styled(Box)({
    display: 'flex',
    gap: '16px',
});

const StyledToolbar = styled(Toolbar)({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 16px',
});

export default function EditorNavBar() {
    const navigate = useNavigate();
    const { setBlogState, blogState: { title }, saveDraft, publish, savingState } = useBlog();
    const { drafting, publishing } = savingState;

    const [lastSaved, setLastSaved] = useState(null);

    const handleSaveDraft = () => {
        setBlogState((prev) => ({ ...prev, draft: true }));
        saveDraft();
        setLastSaved(new Date().toISOString()); // Update last saved time
    };

    const handlePublish = () => {
        setBlogState((prev) => ({ ...prev, draft: false }));
        publish();
    };

    return (
        <AppBar position="sticky" sx={{ backgroundColor: 'white', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', color: 'black' }}>
            <ToastContainer />
            <StyledToolbar>
                {/* Logo */}
                <Box
                    component="img"
                    src="/src/assets/logo.png"
                    alt="Logo"
                    sx={{
                        height: 24,
                        cursor: 'pointer',
                    }}
                    onClick={() => navigate('/feed')}
                />

                {/* Title */}
                <Box sx={{ flex: 1, textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                        {title || 'Untitled Blog'}
                    </Typography>
                    {lastSaved && (
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>
                            Last saved: {formatRelativeTime(lastSaved)}
                        </Typography>
                    )}
                </Box>

                {/* Action Buttons */}
                <Icons>
                    <CustomIconButton
                        startIcon={<ScheduleIcon />}
                        onClick={handleSaveDraft}
                        disabled={drafting || publishing}
                    >
                        {drafting ? 'Saving...' : 'Save'}
                    </CustomIconButton>
                    <Button
                        variant="contained"
                        startIcon={<PublishedWithChangesIcon />}
                        onClick={handlePublish}
                        disabled={drafting || publishing}
                        sx={{
                            textTransform: 'none',
                            borderRadius: 2,
                            padding: '8px 24px',
                            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        {publishing ? 'Publishing...' : 'Publish'}
                    </Button>
                </Icons>
            </StyledToolbar>
        </AppBar>
    );
}
