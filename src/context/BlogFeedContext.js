import { createContext } from 'react';

const BlogFeedContext = createContext({
  blogs: [],
  hasMore: false,
  loading: false,
  changeFeedType: () => {},
});

export default BlogFeedContext;
