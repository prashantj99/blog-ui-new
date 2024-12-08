import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Blog from './Blog';
import FeedShimmer from './FeedShimmer';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useParams } from 'react-router-dom';
import getActivityCounts from '../utils/BlogActivityCounts';
import { BASE_URL } from '../commons/AppConstant';

const Feed = () => {
  const { feedType } = useParams(); // Extract feed type from URL
  const { auth } = useAuth(); // User authentication data
  const axiosPrivate = useAxiosPrivate(); // Axios instance with authentication headers

  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // Fetch blogs based on `feedType` and `page`
  const fetchBlogs = useCallback(async () => {
    if (loading || !hasMore) return; // Avoid duplicate requests

    setLoading(true);
    try {
      // Build the API URL dynamically
      let url = `${BASE_URL}`;
      if (feedType === 'trending') url += '/post/trending';
      else if (feedType === 'liked' || feedType === 'bookmarked') url += `/activity/${feedType}`;
      else if (feedType === 'following') url += `/post/following`;
      else url += `/post/page`;
      url += `?pageNumber=${page}`;

      const response = await axiosPrivate.get(url);
      setBlogs((prevBlogs) => [...prevBlogs, ...response.data.posts]); // Append new blogs
      setHasMore(!response.data.isLastPage); // Update pagination flag
    } catch (err) {
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  }, [feedType, page, hasMore, loading, axiosPrivate]);

  // Reset state when `feedType` changes
  useEffect(() => {
    setBlogs([]);
    setPage(0);
    setHasMore(true);
  }, [feedType]);

  // Fetch blogs when `page` or `feedType` changes
  useEffect(() => {
    fetchBlogs();
  }, [page, fetchBlogs]);

  // Infinite scroll logic with debounce
  useEffect(() => {
    const debounce = (fn, delay) => {
      let timeoutId;
      return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
      };
    };

    const handleInfiniteScroll = debounce(() => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight &&
        hasMore &&
        !loading
      ) {
        setPage((prevPage) => prevPage + 1); // Load next page
      }
    }, 200);

    window.addEventListener('scroll', handleInfiniteScroll);
    return () => window.removeEventListener('scroll', handleInfiniteScroll);
  }, [loading, hasMore]);

  return (
    <Box flex={4} p={2} sx={{ display: { xs: 'none', sm: 'block' } }}>
      {/* Render Blogs */}
      {blogs.length > 0 ? (
        blogs.map((blog) => {
          const { likes, bookmarks, liked, bookmarked } = getActivityCounts(
            blog.activities,
            auth.id
          );
          return (
            <Blog
              key={blog.postId}
              blog={blog}
              likes={likes}
              bookmarks={bookmarks}
              liked={liked}
              bookmarked={bookmarked}
            />
          );
        })
      ) : (
        // No Blogs Found Message
        !loading && (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100vh"
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
        )
      )}

      {/* Show Loading Indicator */}
      {loading && hasMore && <FeedShimmer />}
    </Box>
  );
};

export default Feed;
