import PropTypes from 'prop-types';
import BlogFeedContext from '../context/BlogFeedContext';

const BlogFeedProvider = ({ children }) => {

  return (
    <BlogFeedContext.Provider value={{ blogs, hasMore, loading, changeFeedType, fetchBlogs }}>
      {children}
    </BlogFeedContext.Provider>
  );
};

BlogFeedProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default BlogFeedProvider;
