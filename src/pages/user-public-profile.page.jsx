/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
    Avatar,
    Box,
    Stack,
    Typography,
    Tabs,
    Tab,
    ListItem,
    ListItemText,
    List,
    Button,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import PublishedBlogList from "../components/PublishedBlogList";
import FollowersList from "../components/FollwersList";
import useUserProfile from "../hooks/useUserProfile";
import useAuth from "../hooks/useAuth";
import useFetchUserFollowers from "../hooks/useFetchUserFollowers";
import formatNumber from "../utils/number_formatter";

const UserPublicProfilePage = () => {
    const { userId } = useParams();
    const fetchUser = useUserProfile();
    const { auth } = useAuth();
    const { fetchFollowers, followUser, unfollowUser } = useFetchUserFollowers();

    const [user, setUser] = useState({});
    const [selectedTab, setSelectedTab] = useState(0);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followerCount, setFollowerCount] = useState(0);
    const [followers, setFollowers] = useState([]);

    useEffect(() => {
        if (!userId) return;
        const getUser = async () => {
            try {
                const user = await fetchUser(userId);
                setUser(user || {});
            } catch (err) {
                console.error(err);
            }
        };
        getUser();
    }, [userId]);

    useEffect(() => {
        if (!user?.userId) return;

        const fetchInitialFollowers = async () => {
            const followers = await fetchFollowers(user?.userId);
            setFollowerCount(followers?.length || 0);
            setFollowers(followers || []);
            setIsFollowing(followers.some((follower) => follower?.userId === auth?.id));
        };

        fetchInitialFollowers();
    }, [auth?.id, user?.userId]);

    const handleToggleFollow = async () => {
        if (user?.userId === auth?.id) {
            toast.error("You cannot follow yourself!");
            return;
        }
        if (isFollowing) {
            await unfollowUser(user?.userId);
            setFollowerCount((prev) => prev - 1);
        } else {
            await followUser(user?.userId);
            setFollowerCount((prev) => prev + 1);
        }
        setIsFollowing(!isFollowing);
    };

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    return (
        <>
            <ToastContainer />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 4,
                    px: 4,
                    py: 6,
                    maxWidth: "1200px",
                    margin: "0 auto",
                }}
            >
                {/* Sidebar */}
                <Box
                    sx={{
                        flexBasis: { xs: "100%", md: "25%" },
                        backgroundColor: "white",
                        borderRadius: "8px",
                        padding: 3,
                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <Stack spacing={3} alignItems="center">
                        <Avatar
                            alt={user?.name || "User"}
                            src={user?.profilePicture || "/src/assets/user-svgrepo-com.svg"}
                            sx={{ width: 80, height: 80 }}
                        />
                        <Typography variant="h5" fontWeight="bold" textAlign="center">
                            {user?.name || "Anonymous User"}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" textAlign="center">
                            {user?.about || "No bio available."}
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            fontWeight="medium"
                            textAlign="center"
                        >
                            {formatNumber(followerCount)} Followers
                        </Typography>
                        <Button
                            variant={isFollowing ? "contained" : "outlined"}
                            color="primary"
                            onClick={handleToggleFollow}
                            fullWidth
                            sx={{ borderRadius: "20px" }}
                        >
                            {isFollowing ? "Following" : "Follow"}
                        </Button>
                        <List>
                            {user?.accounts?.map((account) => (
                                <ListItem
                                    key={account?.accountId}
                                    component="a"
                                    href={account?.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                        padding: 0,
                                        marginBottom: 1,
                                        "&:hover": { color: "primary.main" },
                                    }}
                                >
                                    <ListItemText
                                        primary={`@${account?.platform}`}
                                        primaryTypographyProps={{
                                            fontSize: "0.875rem",
                                            fontWeight: 500,
                                        }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Stack>
                </Box>

                {/* Main Content */}
                <Box sx={{ flex: 1 }}>
                    <Tabs
                        value={selectedTab}
                        onChange={handleTabChange}
                        variant="scrollable"
                        sx={{
                            marginBottom: 3,
                            ".MuiTabs-indicator": {
                                backgroundColor: "primary.main",
                                height: 4,
                            },
                            ".MuiTab-root": {
                                textTransform: "none",
                                fontWeight: 600,
                            },
                        }}
                    >
                        <Tab label="Published Blogs" />
                        <Tab label="Followers" />
                    </Tabs>
                    <Box>
                        {selectedTab === 0 && <PublishedBlogList user={user} />}
                        {selectedTab === 1 && <FollowersList followers={followers} />}
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default UserPublicProfilePage;
