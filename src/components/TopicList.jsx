import {
    List,
    ListItem,
    ListItemText,
    Button,
    Typography,
    Box,
    ListItemAvatar,
    Avatar,
    Divider,
} from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import { Link } from "react-router-dom";
import useBlogCategory from "../hooks/useBlogCategory";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import { SUBSCRIBE_TOPIC_URL } from "../commons/AppConstant";
import formatNumber from "../utils/number_formatter";

const TopicsList = () => {
    const { categories, setCategories } = useBlogCategory();
    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();

    const handleFollowClick = async (category) => {
        const isFollowing = category.subscribers.includes(auth.id);

        try {
            await axiosPrivate.post(SUBSCRIBE_TOPIC_URL, {
                userId: auth.id,
                categoryId: category.categoryId,
            });

            // Update local state to reflect the change
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
            console.log(error);
        }
    };

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

            <List disablePadding>
                {categories
                    .sort((a, b) => a.title.localeCompare(b.title))
                    .slice(0, 4)
                    .map((category) => (
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
