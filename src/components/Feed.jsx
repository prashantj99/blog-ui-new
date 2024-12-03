import Box from '@mui/material/Box';
import Blog from './Blog';
import useBlogFeed from '../hooks/useBlogFeed';
import useAuth from '../hooks/useAuth';
import FeedShimmer from './FeedShimmer';
import { Typography } from '@mui/material';
import getActivityCounts from '../utils/BlogActivityCounts';

const Feed = () => {
  const { blogs, loading, hasMore } = useBlogFeed();
  const { auth } = useAuth();

  return (
    <Box flex={4} p={2} sx={{ display: { xs: 'none', sm: 'block' } }}>
      {blogs.length > 0 ? (
        blogs.map((blog) => {
          const { likes, bookmarks, liked, bookmarked } = getActivityCounts(blog.activities, auth.id);
          return (
            <Blog
              key={blog.postId}  // Use a unique key for each blog
              blog={blog}
              likes={likes}
              bookmarks={bookmarks}
              liked={liked}
              bookmarked={bookmarked}
            />
          );
        })
      ) : (
        !loading && <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100vh" // Adjust based on your layout
          bgcolor="background.paper"
        >
          <Typography
            variant="h6"
            color="text.secondary"
            textAlign="center"
            sx={{
              border: '1px dashed gray',
              padding: '16px',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9',
            }}
          >
            No blogs to display
          </Typography>
        </Box>
      )}
      {loading && hasMore && <FeedShimmer />}
    </Box>
  );
};

export default Feed;
