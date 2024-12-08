import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import PersonIcon from "@mui/icons-material/Person";
import useAuth from "../hooks/useAuth";

export const navigationItems = () => [
    {
        label: "Trending",
        icon: <WhatshotIcon />,
        color: "error.main", // Red color for "Trending"
        to: "/feed/tending",
    },
    {
        label: "Following",
        icon: <SubscriptionsIcon />,
        color: "warning.main", // Yellow for "Following"
        to: `/feed/following`,
    },
    {
        label: "Liked",
        icon: <FavoriteBorderIcon />,
        color: "secondary.main", // Purple for "Liked"
        to: "/feed/liked",
    },
    {
        label: "Saved Blogs",
        icon: <BookmarksIcon />,
        color: "info.main", // Blue for "Saved Blogs"
        to: "/feed/bookmarked",
    },
    {
        label: "Profile",
        icon: <PersonIcon />,
        color: "success.main", // Green for "Profile"
        to: "/profile/info",
    },
];

export const Navigation = () => {
    const location = useLocation();
    return (
        <>
            {navigationItems().map((item, index) => {
                const isActive = location.pathname === item.to; // Check if the route is active

                return (
                    <ListItemButton
                        key={index}
                        component={Link}
                        to={item.to}
                        sx={{
                            "&:hover": {
                                backgroundColor: "rgba(0, 123, 255, 0.1)",
                                borderRadius: "8px",
                            },
                            backgroundColor: isActive ? "rgba(0, 123, 255, 0.2)" : "transparent", // Highlight active link
                            borderRadius: "8px",
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                color: isActive ? "primary.main" : item.color, // Primary color for active icon
                                transition: "color 0.3s",
                            }}
                        >
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText
                            primary={item.label}
                            sx={{
                                fontWeight: isActive ? 700 : 600, // Bold text for active link
                                color: isActive ? "primary.main" : "text.primary",
                                transition: "color 0.3s",
                            }}
                        />
                    </ListItemButton>
                );
            })}
        </>
    );
};
