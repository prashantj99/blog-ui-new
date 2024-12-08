import { createContext, useContext } from 'react';

export const BlogContext = createContext({});

const useBlog = () => useContext(BlogContext);

export default useBlog;
