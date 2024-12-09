import { Notifications } from '@mui/icons-material';
import {
    Badge,
    CircularProgress,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Menu,
    Skeleton,
    Tooltip,
    Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { BASE_URL } from '../commons/AppConstant';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import formatRelativeTime from './../utils/date_formatter';

export default function NotificationMenu() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [pageNumber, setPageNumber] = useState(0);
    const [isLastPage, setIsLastPage] = useState(false);
    const [loading, setLoading] = useState(false);
    const axiosPrivate = useAxiosPrivate();

    const fetchNotifications = useCallback(async (page) => {
        setLoading(true);
        try {
            const response = await axiosPrivate.get(`${BASE_URL}/notifications?pageNumber=${page}&pageSize=10`);
            const { notifications: newNotifications, isLastPage: lastPage } = response.data;
            setNotifications(prev => (page === 0 ? newNotifications : [...prev, ...newNotifications]));
            setIsLastPage(lastPage);
            if (page === 0) {
                setUnreadCount(newNotifications.filter(notif => !notif.isRead).length);
            }
        } catch (error) {
            console.error('Error fetching notifications', error);
        } finally {
            setLoading(false);
        }
    }, [axiosPrivate]);

    useEffect(() => {
        fetchNotifications(pageNumber);
    }, [pageNumber, fetchNotifications]);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleMarkAsRead = useCallback(async (notificationId) => {
        await axiosPrivate.post(`${BASE_URL}/notifications/${notificationId}/read`);
        fetchNotifications(0);
        setUnreadCount(prevCount => prevCount - 1);
    }, [axiosPrivate, fetchNotifications]);

    const loadMoreNotifications = useCallback(() => {
        if (!isLastPage && !loading) {
            fetchNotifications(pageNumber + 1);
            setPageNumber(prev => prev + 1);
        }
    }, [fetchNotifications, isLastPage, loading, pageNumber]);

    return (
        <>
            <Tooltip title="Notifications" arrow>
                <IconButton onClick={handleMenuOpen}>
                    <Badge badgeContent={unreadCount} color="error">
                        <Notifications />
                    </Badge>
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    sx: {
                        width: 360,
                        maxHeight: 500,
                        overflow: 'auto',
                        boxShadow: 3,
                        borderRadius: 2,
                    },
                }}
            >
                {loading && notifications.length === 0 ? (
                    Array.from({ length: 5 }).map((_, index) => (
                        <Skeleton key={index} variant="rectangular" height={60} sx={{ margin: 1, borderRadius: 1 }} />
                    ))
                ) : (
                    <List>
                        {notifications.length === 0 && (
                            <Typography
                                variant="body1"
                                color="textSecondary"
                                textAlign="center"
                                sx={{ padding: 2 }}
                            >
                                No new notifications
                            </Typography>
                        )}
                        {notifications.map(notification => (
                            <ListItem
                                key={notification.id}
                                button
                                onClick={() => handleMarkAsRead(notification.id)}
                                sx={{
                                    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                                    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                                }}
                            >
                                <ListItemText
                                    primary={notification.message}
                                    secondary={formatRelativeTime(notification.createdAt)}
                                    primaryTypographyProps={{ fontWeight: notification.isRead ? 'normal' : 'bold' }}
                                />
                            </ListItem>
                        ))}
                        {!isLastPage && (
                            <ListItem
                                onClick={loadMoreNotifications}
                                sx={{
                                    justifyContent: 'center',
                                    color: 'primary.main',
                                    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                                }}
                            >
                                <Typography variant="body2">Load more</Typography>
                            </ListItem>
                        )}
                        {loading && (
                            <ListItem sx={{ justifyContent: 'center' }}>
                                <CircularProgress size={24} />
                            </ListItem>
                        )}
                    </List>
                )}
            </Menu>
        </>
    );
}
