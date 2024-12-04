/* eslint-disable react/prop-types */
import { useParams } from 'react-router-dom';
import ReadMoreContext from '../context/ReadMoreBlogContext';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useEffect, useState } from 'react';
import { BASE_URL } from '../commons/AppConstant';

const ReadMoreProvider = ({ children }) => {
    const { id } = useParams();
    const axiosPrivate = useAxiosPrivate();
    const [blog, setBlog] = useState({});
    const [currentBlogId, setCurrentBlogId] = useState(id);
    const [isReadMode, setIsReadMode] = useState(false);

    //fetch current blog 
    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        const fetchBlog = async () => {
            try {
                const response = await axiosPrivate.get(`/post/${currentBlogId}`, { signal });
                const { postId, title, content, bannerUrl, draft, lastUpdated, description, category, tags, user } = response.data;
                setBlog({ ...response.data });

                setBlog({
                    id: postId,
                    title: title,
                    description: description,
                    content: JSON.parse(content),
                    prevBanner: bannerUrl,
                    banner: `${BASE_URL}/file/name/${bannerUrl}`,
                    categoryId: parseInt(category?.categoryId),
                    categoryName: category?.title,
                    tags: tags,
                    draft: draft,
                    lastUpdated: lastUpdated,
                    user: user,
                });
                console.log(blog);

            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.log('Error fetching blog:', error);
                }
            }
        };

        fetchBlog();

        return () => {
            controller.abort();
        };

    }, [id])

    return (
        <ReadMoreContext.Provider value={{ blog, setBlog, setCurrentBlogId, isReadMode, setIsReadMode }}>
            <div style={{ backgroundColor: isReadMode ? '#F3E0C4' : 'white', color: isReadMode ? '#4E2C2D' : '#000', transition: 'all 0.3s ease' }}>
                {children}
            </div>
        </ReadMoreContext.Provider>
    )
}

export default ReadMoreProvider
