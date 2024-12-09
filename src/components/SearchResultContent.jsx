/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useCallback, useState } from 'react';
import { Container, Grid, Typography, Box, CircularProgress, Alert } from '@mui/material';
import SearchResult from '../components/SearchResult';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useLocation } from 'react-router-dom';
import { BASE_URL } from '../commons/AppConstant';

const SearchResultContent = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(null);
    const axiosPrivate = useAxiosPrivate();
    const location = useLocation();
    const [keyword, setKeyword] = useState('');
    const [searchType, setSearchType] = useState('blog');

    console.log(searchType);


    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const type = params.get('type');
        const keyword = params.get('keyword');

        if (type && keyword) {
            setKeyword(keyword);
            setSearchType(type);
        }
    }, [location.search]);

    const search = useCallback(async () => {
        setLoading(true);
        setError(null); // Reset error before making the request
        try {
            let url = `${BASE_URL}/search/results`;
            const response = await axiosPrivate.get(url, {
                params: {
                    type: searchType,
                    keyword,
                    pageNumber: page,
                },
            });
            console.log(response.data.results);
            setSearchResults(prevResults => [...prevResults, ...response.data.results]);
            setHasMore(!response.data.isLastPage);
        } catch (error) {
            console.error('Error searching:', error);
            setError('An error occurred while fetching search results.');
        } finally {
            setLoading(false);
        }
    }, [axiosPrivate, searchType, keyword, page]);

    useEffect(() => {
        if (keyword && searchType) {
            setSearchResults([]);
            setPage(0); // Reset pagination on new search
            search();
        }
    }, [keyword, searchType]);

    useEffect(() => {
        if (page > 0) {
            search(); // Load more results on page increment
        }
    }, [page]);

    const handleScroll = useCallback(() => {
        if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight) {
            if (hasMore && !loading) {
                setPage(prev => prev + 1);
            }
        }
    }, [hasMore, loading]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Box sx={{ mb: 2, position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 10, py: 2 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Search Results for{' '}
                    <Typography
                        variant="h5"
                        component="span"
                        sx={{ color: 'primary.main', fontWeight: 'bold' }}
                    >
                        "{keyword}"
                    </Typography>{' '}
                    in {searchType}s
                </Typography>
            </Box>

            {/* Error Message */}
            {error && (
                <Box sx={{ mt: 2 }}>
                    <Alert severity="error">{error}</Alert>
                </Box>
            )}

            {/* Search Results */}
            {searchResults.length > 0 ? (
                <Grid container spacing={3} sx={{ mt: 2 }}>
                    <SearchResult searchResults={searchResults} searchType={searchType} />
                </Grid>
            ) : (
                !loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <Typography variant="body1" color="textSecondary">
                            No results found for "{keyword}". Try searching for something else!
                        </Typography>
                    </Box>
                )
            )}

            {/* Loading Indicator */}
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress color="primary" />
                </Box>
            )}

            {/* Infinite Scroll End Indicator */}
            {!hasMore && !loading && searchResults.length > 0 && (
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Typography variant="body2" color="textSecondary">
                        You’ve reached the end of the results.
                    </Typography>
                </Box>
            )}
        </Container>
    );
};

export default SearchResultContent;
