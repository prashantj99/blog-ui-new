/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import {
    Avatar, Card, CardActions, CardContent, CardHeader, CardMedia, IconButton, Stack, Typography, Tooltip, Divider, Button
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ShareIcon from '@mui/icons-material/Share';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import { Bookmark, Comment, Favorite, FavoriteBorder } from '@mui/icons-material';
import { BASE_URL } from '../commons/AppConstant';
import formatRelativeTime from '../utils/date_formatter';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from '../hooks/useAuth';
import { useState } from 'react';
import formatNumber from '../utils/number_formatter';
import { useNavigate } from 'react-router-dom';
import Comments from './Comments';

const Blog = ({ blog, likes, bookmarks, liked, bookmarked }) => {
    const { postId, title, description, bannerUrl, lastUpdated, user: { name } } = blog;
    const [isLiked, setIsLiked] = useState(liked);
    const [isBookmarked, setIsBookmarked] = useState(bookmarked);
    const [likeCount, setLikeCount] = useState(likes);
    const [bookmarkCount, setBookmarkCount] = useState(bookmarks);
    const [showComments, setShowComments] = useState(false);

    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();

    const toggleComments = () => setShowComments(prev => !prev);

    const handleLike = async () => {
        try {
            await axiosPrivate.post(`${BASE_URL}/activity/like/post/${postId}`, null, {
                params: { userId: auth.id },
            });
            setIsLiked(!isLiked);
            setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
        } catch (err) {
            console.error("Error liking the post", err);
        }
    };

    const handleBookmark = async () => {
        try {
            await axiosPrivate.post(`${BASE_URL}/activity/bookmark/post/${postId}`, null, {
                params: { userId: auth.id },
            });
            setIsBookmarked(!isBookmarked);
            setBookmarkCount(prev => isBookmarked ? prev - 1 : prev + 1);
        } catch (err) {
            console.error("Error bookmarking the post", err);
        }
    };

    const handleReadMoreClick = () => {
        navigate(`/read-more/${postId}`);
    };

    const handlePublicProfileClick = () => {
        navigate(`/public/profile/${blog?.user?.userId}`);
    };

    return (
        <Card sx={{ margin: 2, borderRadius: 2, boxShadow: 2, transition: 'transform 0.3s ease', '&:hover': { transform: 'scale(1.02)' }, overflow: 'hidden' }}>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: 'primary.main', cursor: 'pointer', border: '2px solid #ffffff', '&:hover': { transform: 'scale(1.1)' } }} aria-label="recipe" onClick={handlePublicProfileClick}>
                        {name[0]?.toUpperCase()}
                    </Avatar>
                }
                action={
                    <IconButton aria-label="settings" sx={{ color: 'text.primary', '&:hover': { color: 'secondary.main' } }}>
                        <MoreVertIcon />
                    </IconButton>
                }
                title={name?.charAt(0).toUpperCase() + name?.slice(1)}
                subheader={formatRelativeTime(lastUpdated)}
                sx={{ paddingBottom: 0 }}
            />
            <CardMedia
                component="img"
                height={220}
                image={`${BASE_URL}/file/name/${bannerUrl}`}
                alt="blog_banner"
                sx={{ objectFit: 'cover', borderTopLeftRadius: 2, borderTopRightRadius: 2 }}
            />
            <CardContent sx={{ paddingTop: 1 }}>
                <Typography variant="h6" color="text.primary" sx={{ fontWeight: 'bold', lineHeight: 1.4 }}>
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, lineHeight: 1.5 }}>
                    {description}
                </Typography>
            </CardContent>
            <Divider sx={{ marginBottom: 1 }} />
            <CardActions sx={{ display: 'flex', justifyContent: 'space-between', paddingX: 2, paddingBottom: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title={isLiked ? "Unlike" : "Like"} arrow>
                        <IconButton aria-label="like" onClick={handleLike} sx={{ color: isLiked ? 'red' : 'inherit' }}>
                            {isLiked ? <Favorite /> : <FavoriteBorder />}
                        </IconButton>
                    </Tooltip>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        {formatNumber(likeCount)}
                    </Typography>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title={isBookmarked ? "Remove Bookmark" : "Bookmark"} arrow>
                        <IconButton aria-label="bookmark" onClick={handleBookmark} sx={{ color: isBookmarked ? 'skyblue' : 'inherit' }}>
                            {isBookmarked ? <Bookmark /> : <Bookmark />}
                        </IconButton>
                    </Tooltip>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        {formatNumber(bookmarkCount)}
                    </Typography>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title="Share" arrow>
                        <IconButton aria-label="share">
                            <ShareIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Read More" arrow>
                        <IconButton aria-label="read more" onClick={handleReadMoreClick}>
                            <ReadMoreIcon color="primary" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Comments" arrow>
                        <IconButton aria-label="comments" onClick={toggleComments}>
                            <Comment color="primary" />
                        </IconButton>
                    </Tooltip>
                </div>
            </CardActions>
            {showComments && (
                <Stack spacing={2} justifyContent={'center'} alignItems={'center'}>
                    <Comments postId={postId} />
                </Stack>
            )}
        </Card>
    );
};

Blog.propTypes = {
    blog: PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        bannerUrl: PropTypes.string.isRequired,
        lastUpdated: PropTypes.string.isRequired,
        postId: PropTypes.number.isRequired,
        user: PropTypes.shape({
            name: PropTypes.string.isRequired
        }).isRequired
    }).isRequired,
    likes: PropTypes.number.isRequired,
    bookmarks: PropTypes.number.isRequired,
    liked: PropTypes.bool.isRequired,
    bookmarked: PropTypes.bool.isRequired,
};

export default Blog;
