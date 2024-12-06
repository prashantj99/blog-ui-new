/* eslint-disable react-hooks/exhaustive-deps */
import { useParams } from "react-router-dom";
import ListBlogs from "./ListBlogs";
import { BASE_URL } from "../commons/AppConstant";
import { useCallback, useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Box, CircularProgress, Typography } from "@mui/material";

const PublishedBlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const axiosPrivate = useAxiosPrivate();
    const { userId } = useParams();

    // Fetch blogs using pagination
    const fetchBlogs = useCallback(async () => {
        if (!hasMore || loading) return;
        setLoading(true);

        try {
            const URL = `${BASE_URL}/post/published/${userId}/false?pageNumber=${page}`;
            const response = await axiosPrivate.get(URL);

            const fetchedBlogs = response?.data?.posts || [];
            setHasMore(!response?.data?.isLastPage); // Check if it's the last page
            setBlogs((prevBlogs) => [...prevBlogs, ...fetchedBlogs]);
        } catch (err) {
            console.error("Error fetching blogs:", err);
        } finally {
            setLoading(false);
        }
    }, [axiosPrivate, userId, page, hasMore, loading]);

    // Trigger `fetchBlogs` when page number changes
    useEffect(() => {
        fetchBlogs();
    }, [page]);

    // Reset blogs and state when `userId` changes
    useEffect(() => {
        setBlogs([]);
        setPage(0);
        setHasMore(true);
    }, [userId]);

    // Infinite scrolling with debounced listener
    useEffect(() => {
        const handleScroll = () => {
            if (
                hasMore &&
                !loading &&
                window.innerHeight + document.documentElement.scrollTop + 100 >=
                document.documentElement.scrollHeight
            ) {
                setPage((prevPage) => prevPage + 1);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [hasMore, loading]);

    return (
        <Box sx={{ maxHeight: "100vh", overflowY: "auto", px: 2, py: 3 }}>
            {blogs.length > 0 ? (
                <ListBlogs blogs={blogs} />
            ) : !loading ? (
                <Typography textAlign="center" variant="body1" color="textSecondary">
                    No blogs published yet.
                </Typography>
            ) : null}
            {loading && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                    <CircularProgress size={24} />
                </Box>
            )}
        </Box>
    );
};

export default PublishedBlogList;
