/* eslint-disable react/prop-types */
import { Box, Grid, Typography, Avatar, Card, CardContent, Button } from '@mui/material';
import useAuth from '../hooks/useAuth';
import Blog from './Blog';
import { useNavigate } from 'react-router-dom';
import getActivityCounts from '../utils/BlogActivityCounts';

const SearchResult = ({ searchResults, searchType }) => {
    const { auth } = useAuth();
    const navigate = useNavigate();

    if (searchResults && searchResults.length === 0) {
        return (
            <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                No results found.
            </Typography>
        );
    }

    const renderResults = () => {
        switch (searchType) {
            case 'user':
                return (
                    <Grid container spacing={4}>
                        {searchResults?.map((user, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card elevation={3} sx={{ display: 'flex', alignItems: 'center', padding: 4 }}>
                                    <Avatar
                                        alt={user.name}
                                        src={user.profileImg === 'default.png' ? '/default-avatar.png' : user.profileImg}
                                        sx={{ width: 64, height: 64, marginRight: 2 }}
                                    />
                                    <CardContent>
                                        <Typography variant="h6" fontWeight="bold">
                                            {user.name}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {user.email}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                            {user.about}
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            sx={{ mt: 1 }}
                                            onClick={() => navigate(`/public/profile/${user.userId}`)}
                                        >
                                            View Profile
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                );
            case 'blog':
            case 'tag':
                return (
                    <Box flex={4} p={2} sx={{ display: { xs: 'none', sm: 'block' } }}>
                        {searchResults?.map((blog, index) => {
                            return <Blog key={index} blog={blog} {...getActivityCounts(blog?.activities, auth?.id)} />;
                        })}
                    </Box>
                );
            case 'category':
                return (
                    <Grid container spacing={4}>
                        {searchResults?.map((category, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card elevation={3} sx={{ padding: 2 }}>
                                    <CardContent>
                                        <Typography variant="h6" fontWeight="bold">
                                            {category?.title}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                            {category?.description}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                            {category?.subscribers?.length} Subscribers
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            sx={{ mt: 1 }}
                                            onClick={() => navigate(`/topic/${category?.categoryId}`)}
                                        >
                                            View Details
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                );
            default:
                return null;
        }
    };

    return (
        <Grid container spacing={4}>
            {renderResults()}
        </Grid>
    );
};

export default SearchResult;
