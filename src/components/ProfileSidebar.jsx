import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Box,
  Stack,
  Divider,
} from "@mui/material";
import {
  ExitToApp,
  Info,
  PendingActions,
  Public,
  Publish,
  QueryStats,
} from "@mui/icons-material";
import useLogout from "../hooks/useLogout";
import useAccount from "../hooks/useAccount";

const ProfileSidebar = () => {
  const menuItems = [
    { text: "Personal Information", icon: <Info />, link: "./info" },
    { text: "Published Blogs", icon: <Publish />, link: "./blogs/1" },
    { text: "Draft", icon: <PendingActions />, link: "./blogs/0" },
    { text: "Community Stats", icon: <QueryStats />, link: "./stats" },
    { text: "Social Networks", icon: <Public />, link: "./accounts" },
  ];

  const logout = useLogout();
  const navigate = useNavigate();
  const location = useLocation();
  const { user: { name } } = useAccount();

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 300,
        p: 5,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        position: "relative",
      }}
    >
      <Stack
        spacing={2}
        direction="column"
        justifyContent="center"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Avatar
          alt={name}
          src="/src/assets/user-svgrepo-com.svg"
          sx={{
            width: 42,
            height: 42,
            padding: "10px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        />
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {name}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", fontStyle: "italic" }}
        >
          1.2k Followers
        </Typography>
      </Stack>
      <Divider />
      <List sx={{ mt: 2 }}>
        {menuItems.map((item, index) => (
          <ListItem
            component={Link}
            to={item.link}
            key={index}
            button
            sx={{
              mb: 1,
              p: 1.5,
              borderRadius: 1,
              bgcolor: location.pathname.includes(item.link) ? "primary.light" : "transparent",
              color: location.pathname.includes(item.link) ? "primary.contrastText" : "text.primary",
              "&:hover": {
                bgcolor: "action.hover",
                transform: "scale(1.02)",
              },
              transition: "0.2s",
            }}
          >
            <ListItemIcon
              sx={{
                color: location.pathname.includes(item.link) ? "primary.contrastText" : "primary.main",
                minWidth: 36,
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                sx: {
                  fontSize: "1rem",
                  fontWeight: 500,
                  color: location.pathname.includes(item.link)
                    ? "primary.contrastText"
                    : "inherit",
                },
              }}
            />
          </ListItem>
        ))}
        <ListItem
          onClick={handleLogout}
          sx={{
            mt: 2,
            p: 1.5,
            borderRadius: 1,
            "&:hover": { bgcolor: "error.light", transform: "scale(1.02)" },
            transition: "0.2s",
          }}
        >
          <ListItemIcon
            sx={{
              color: "error.main",
              minWidth: 36,
            }}
          >
            <ExitToApp />
          </ListItemIcon>
          <ListItemText
            primary="Sign Out"
            primaryTypographyProps={{
              sx: { fontSize: "1rem", fontWeight: 500, color: "error.main", cursor: "pointer" },
            }}
          />
        </ListItem>
      </List>
    </Box>
  );
};

export default ProfileSidebar;
