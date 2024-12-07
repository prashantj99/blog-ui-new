import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../commons/AppConstant';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import ListBlogs from './ListBlogs';

const UserBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [page, setPage] = useState(0);
    const [isLastPage, setLastPage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const axiosPrivate = useAxiosPrivate();
    const { status } = useParams();
    const { auth } = useAuth();

    const fetchBlogs = async (signal) => {
        setLoading(true);
        setError(null);
        try {
            console.log(status);

            const URL = `${BASE_URL}/post/published/${auth?.id}/${status}?pageNumber=${page}`;
            const response = await axiosPrivate.get(URL, { signal });
            setLastPage(response?.data?.isLastPage);
            setBlogs((prev) => [...prev, ...response?.data?.posts]);
        } catch (err) {
            if (signal.aborted) return; // Ignore abort errors
            setError('Failed to fetch blogs. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        if (!isLastPage) {
            fetchBlogs(signal);
        }

        return () => controller.abort(); // Cleanup
    }, [page, status, isLastPage]); // Fetch blogs when page or status changes

    const handleInfiniteScroll = () => {
        if (
            !isLastPage &&
            window.innerHeight + document.documentElement.scrollTop + 1 >=
            document.documentElement.scrollHeight
        ) {
            setPage((prev) => prev + 1);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleInfiniteScroll);
        return () => {
            window.removeEventListener('scroll', handleInfiniteScroll);
        };
    }, [isLastPage]);

    useEffect(() => {
        console.log("status : " + status);
        setBlogs([]);
        setPage(0);
        setLastPage(false);
    }, [status]); // Fetch blogs when status changes

    return (
        <>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            <ListBlogs blogs={blogs} />
        </>
    );
};

export default UserBlogs;