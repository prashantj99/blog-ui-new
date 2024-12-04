import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CssBaseline, IconButton, Stack, Typography } from '@mui/material';
import { Close, DarkMode, LightMode } from '@mui/icons-material'; // Add icons for toggle button
import JsonToHtmlParser from '../commons/JsonToHtmlParser';
import calculateReadTime from '../utils/calculate_read_time';
import formatRelativeTime from '../utils/date_formatter';
import useReadMoreBlog from '../hooks/useReadMoreBlog';
import Comments from './Comments';
import UserProfileCard from './UserProfileCard ';
import useFetchUserFollowers from '../hooks/useFetchUserFollowers';
import useAuth from '../hooks/useAuth';

const BlogPost = () => {
  const { blog, isReadMode, setIsReadMode } = useReadMoreBlog();
  const { auth } = useAuth();
  const { fetchFollowers, followUser, unfollowUser } = useFetchUserFollowers();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);

  useEffect(() => {
    const fetchInitialFollowers = async () => {
      const followers = await fetchFollowers(blog?.user?.userId);
      setFollowerCount(followers?.length);
      const isUserFollowing = followers.some(follower => follower?.userId === auth?.id);
      setIsFollowing(isUserFollowing);
    };

    fetchInitialFollowers();
  }, [auth?.id, blog?.user?.userId]);

  const handleToggleFollow = async () => {
    if (isFollowing) {
      await unfollowUser(blog?.user.userId);
      setFollowerCount(followerCount - 1);
    } else {
      await followUser(blog?.user.userId);
      setFollowerCount(followerCount + 1);
    }
    setIsFollowing(!isFollowing);
  };

  const navigate = useNavigate();
  const handleProfileLinkClick = () => {
    navigate(`/public/profile/${blog?.user?.userId}`);
  };

  const [showComments, setShowComments] = useState(false);
  const toggleComments = () => setShowComments(prev => !prev);

  // Function to toggle read mode
  const toggleReadMode = () => setIsReadMode(prev => !prev);

  return (
    <div>
      <CssBaseline />
      <Stack justifyContent={'center'} alignItems={'center'} padding={10}>
        <Typography variant="h4" component="div" align="center" sx={{ color: isReadMode ? '#4E2C2D' : '#000' }}>
          {blog?.title}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={1} sx={{ my: 1 }}>
          <Typography variant="body2" color={isReadMode ? '#4E2C2D' : 'text.secondary'}>
            {blog?.user?.name}
          </Typography>
          <Typography variant="body2" color={isReadMode ? '#4E2C2D' : 'text.secondary'}>
            •
          </Typography>
          <Typography variant="body2" color={isReadMode ? '#4E2C2D' : 'text.secondary'}>
            {calculateReadTime(blog?.content)} min read
          </Typography>
          <Typography variant="body2" color={isReadMode ? '#4E2C2D' : 'text.secondary'}>
            • {blog?.lastUpdated && formatRelativeTime(blog?.lastUpdated)}
          </Typography>
        </Stack>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4, width: '80%' }}>
          {blog?.user?.userId !== auth?.id ? (
            <UserProfileCard user={blog?.user} followerCount={followerCount} isFollowing={isFollowing} handleToggleFollow={handleToggleFollow}>
              <Typography variant='a' padding={1} onClick={handleProfileLinkClick} sx={{ cursor: 'pointer' }}>
                {blog?.user?.name}
              </Typography>
            </UserProfileCard>
          ) : (
            <Typography variant='a' padding={1} sx={{ cursor: 'pointer' }}>
              <img alt="Travis Howard" src="/src/assets/user-svgrepo-com.svg" width={24} height={24} />
            </Typography>
          )}
          <Box padding={2}>
            <IconButton aria-label="toggle-read-mode" onClick={toggleReadMode} sx={{ marginRight: 1 }}>
              {isReadMode ? <LightMode sx={{ color: '#FF6F61' }} /> : <DarkMode sx={{ color: '#FF6F61' }} />} {/* Toggle icon with warm color */}
            </IconButton>
            <IconButton aria-label="comments" onClick={toggleComments}>
              <img src='/src/assets/edit-3-svgrepo-com.svg' width={24} height={24} />
            </IconButton>
            <IconButton aria-label="comments" onClick={toggleComments}>
              <img src='/src/assets/comment-2-svgrepo-com.svg' width={24} height={24} />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ width: '80%' }}>
          <img src={blog?.banner} alt="banner" width="100%" style={{ maxHeight: '500px', objectFit: 'cover' }} />
          <Typography variant="body1" color={isReadMode ? '#4E2C2D' : 'text.secondary'} mt={2} >
            {blog?.description}
          </Typography>
        </Box>

        <Box sx={{ width: '80%' }} m={3}>
          <JsonToHtmlParser editorJsData={blog?.content ? blog?.content : []} />
        </Box>

        <Stack direction="row" spacing={1} m={2}>
          {blog?.tags && blog?.tags.map(({ id, name }) => (
            <Box
              key={id}
              sx={{
                position: "relative",
                display: "inline-block",
                borderRadius: "16px",
                backgroundColor: isReadMode ? '#F6D5B3' : '#f5f5f5', // Warm background color for tags
                padding: "6px 12px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: isReadMode ? '#FFB189' : '#e0e0e0',
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: isReadMode ? '#4E2C2D' : '#424242',
                  whiteSpace: "nowrap",
                }}
              >
                {name}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Stack>

      {/* Overlay */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '500px',
          height: '100%',
          backgroundColor: 'white',
          borderLeft: '1px solid #ddd',
          boxShadow: '0 0 10px rgba(0,0,0,0.2)',
          display: showComments ? 'block' : 'none',
          zIndex: 1300,
          overflowY: 'auto',
          transition: '0.3s ease',
          padding: 5,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton aria-label="close" onClick={toggleComments} sx={{ color: 'text.primary' }}>
            <Close />
          </IconButton>
        </Box>
        {blog && <Comments postId={blog?.id} />}
      </Box>
    </div>
  );
};

export default BlogPost;
