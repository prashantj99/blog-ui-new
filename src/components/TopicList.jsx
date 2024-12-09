import {
    List,
    ListItem,
    ListItemText,
    Button,
    Typography,
    Box,
    ListItemAvatar,
    Avatar,
    Skeleton,
} from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import { Link } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import { BASE_URL, SUBSCRIBE_TOPIC_URL } from "../commons/AppConstant";
import formatNumber from "../utils/number_formatter";
import { useEffect, useState } from "react";
import axios from "axios";

const TopicsList = () => {
    const [categories, setCategories] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();

    const handleFollowClick = async (category) => {
        const isFollowing = category?.subscribers?.includes(auth.id);

        try {
            await axiosPrivate.post(SUBSCRIBE_TOPIC_URL, {
                userId: auth.id,
                categoryId: category?.categoryId,
            });

            setCategories((prevCategories) =>
                prevCategories.map((cat) =>
                    cat.categoryId === category.categoryId
                        ? {
                            ...cat,
                            subscribers: isFollowing
                                ? cat.subscribers.filter((subId) => subId !== auth.id)
                                : [...cat.subscribers, auth.id],
                        }
                        : cat
                )
            );
        } catch (error) {
            setErrorMessage("Failed to update subscription. Please try again.");
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/category/page?pageNumber=0&pageSize=4`);
                setCategories(response?.data?.categories);
                setErrorMessage('');
            } catch (err) {
                console.log(err);
                setErrorMessage("Unable to fetch topics! Reload the page.");
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        return (
            <Box sx={{ width: "100%", maxWidth: 400, margin: "auto", mt: 2 }}>
                <Typography
                    variant="h6"
                    component="h2"
                    sx={{
                        mb: 2,
                        textAlign: "center",
                        fontWeight: 700,
                        color: "text.primary",
                    }}
                >
                    Topics to Follow
                </Typography>
                <List disablePadding>
                    {Array.from({ length: 4 }).map((_, index) => (
                        <ListItem
                            key={index}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                py: 1.5,
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                                <Skeleton variant="circular" width={40} height={40} />
                                <Box sx={{ ml: 2, flex: 1 }}>
                                    <Skeleton variant="text" width="60%" />
                                    <Skeleton variant="text" width="40%" />
                                </Box>
                            </Box>
                            <Skeleton variant="rectangular" width={80} height={36} sx={{ borderRadius: "16px" }} />
                        </ListItem>
                    ))}
                </List>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                width: "100%",
                bgcolor: "background.paper",
                p: 2,
                mt: 2,
                maxWidth: 400,
                margin: "auto",
            }}
        >
            <Typography
                variant="h6"
                component="h2"
                sx={{
                    mb: 2,
                    textAlign: "center",
                    fontWeight: 700,
                    color: "text.primary",
                }}
            >
                Topics to Follow
            </Typography>

            {errorMessage && (
                <Typography color="error" sx={{ textAlign: "center", mb: 2 }}>
                    {errorMessage}
                </Typography>
            )}

            <List disablePadding>
                {categories &&
                    categories
                        ?.sort((a, b) => a.title.localeCompare(b.title))
                        ?.slice(0, 4)
                        ?.map((category) => (
                            <ListItem
                                key={category.categoryId}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    py: 1.5,
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: "primary.light" }}>
                                            <ArticleIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={category.title}
                                        secondary={`${category.description} ・ ${formatNumber(
                                            category.subscribers.length
                                        )} followers`}
                                        sx={{
                                            ml: 2,
                                        }}
                                    />
                                </Box>
                                <Button
                                    variant={category?.subscribers?.includes(auth.id) ? "outlined" : "contained"}
                                    color={category?.subscribers?.includes(auth.id) ? "info" : "success"}
                                    size="small"
                                    sx={{
                                        textTransform: "capitalize",
                                        fontWeight: 600,
                                        fontSize: "0.8rem",
                                        px: 3,
                                        borderRadius: "16px",
                                    }}
                                    onClick={() => handleFollowClick(category)}
                                >
                                    {category.subscribers.includes(auth.id) ? "Unfollow" : "Follow"}
                                </Button>
                            </ListItem>
                        ))}
                <ListItem
                    sx={{
                        justifyContent: "center",
                    }}
                >
                    <Link
                        to={`/topics`}
                        style={{
                            textDecoration: "none",
                            fontWeight: 600,
                            color: "#1976d2",
                            fontSize: "0.9rem",
                        }}
                    >
                        See more topics
                    </Link>
                </ListItem>
            </List>
        </Box>
    );
};

export default TopicsList;
