import React from 'react';
import { Skeleton, Card, CardHeader, CardContent, CardActions } from '@mui/material';

const FeedShimmer = ({ count = 5 }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <Card key={index} sx={{ margin: 5 }}>
                    <CardHeader
                        avatar={<Skeleton variant="circular" width={40} height={40} />}
                        action={<Skeleton variant="circular" width={30} height={30} />}
                        title={<Skeleton width="60%" />}
                        subheader={<Skeleton width="40%" />}
                    />
                    <Skeleton variant="rectangular" height={200} />
                    <CardContent>
                        <Skeleton width="80%" />
                        <Skeleton width="60%" />
                    </CardContent>
                    <CardActions>
                        <Skeleton variant="rectangular" width={100} height={30} sx={{ marginRight: 2 }} />
                        <Skeleton variant="rectangular" width={100} height={30} />
                    </CardActions>
                </Card>
            ))}
        </>
    );
};

export default FeedShimmer;
