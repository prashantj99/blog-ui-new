/* eslint-disable react/prop-types */
import {
  Avatar,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PersonOffIcon from "@mui/icons-material/PersonOff";

const ListUsers = ({ users }) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ padding: 2 }}>
      {users.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            marginTop: 4,
            color: "text.secondary",
          }}
        >
          <PersonOffIcon sx={{ fontSize: 50, color: "gray" }} />
          <Typography variant="h6" mt={2}>
            No users available
          </Typography>
        </Box>
      ) : (
        <List>
          {users.map((user) => (
            <Box key={user.id} sx={{ marginBottom: 2 }}>
              <ListItem
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  "&:hover": {
                    backgroundColor: "action.hover",
                    borderRadius: 1,
                  },
                  padding: 1,
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    src='/src/assets/user-svgrepo-com.svg'
                    alt={user.name}
                    sx={{
                      width: 24,
                      height: 24,
                      "&:hover": { cursor: "pointer", transform: "scale(1.1)" },
                    }}
                    onClick={() => navigate(`/public/profile/${user?.userId}`)}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      component="a"
                      href={`/public/profile/${user?.userId}`}
                      sx={{
                        textDecoration: "none",
                        color: "primary.main",
                        fontWeight: 600,
                        fontSize: "1rem",
                        "&:hover": { textDecoration: "underline" },
                      }}
                    >
                      {user.name}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      {user.about}
                    </Typography>
                  }
                />
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    textTransform: "capitalize",
                    borderRadius: 2,
                    fontWeight: 500,
                    "&:hover": { backgroundColor: "primary.light" },
                  }}
                  onClick={() => navigate(`/public/profile/${user?.userId}`)}
                >
                  Follow
                </Button>
              </ListItem>
              <Divider />
            </Box>
          ))}
        </List>
      )}
    </Box>
  );
};

export default ListUsers;
