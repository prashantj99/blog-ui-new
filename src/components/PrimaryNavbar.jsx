import { Box, AppBar, Toolbar, IconButton, Typography, Avatar, Badge, Button, Tooltip } from "@mui/material";
import { styled } from "@mui/system";
import { Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import CustomSearchBar from "./CustomSearchBar";
import NotificationMenu from "./NotificationMenu";

const Logo = styled("img")({
  height: "40px",
  marginRight: "20px",
  cursor: "pointer",
});

const Icons = styled(Box)(({ theme }) => ({
  display: "none",
  gap: "20px",
  alignItems: "center",
  [theme.breakpoints.up("sm")]: {
    display: "flex",
  },
}));

const UserProfileBox = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: "10px",
  alignItems: "center",
  [theme.breakpoints.up("sm")]: {
    display: "none",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: "25px",
  fontWeight: "600",
  padding: theme.spacing(1, 2),
  textTransform: "capitalize",
}));

export default function PrimaryNavbar() {
  const navigate = useNavigate();
  const { auth: { name, accessToken } } = useAuth();

  const userProfileClick = () => navigate("/profile/info");
  const handleHomeClick = () => navigate("/feed");

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "white", color: "black", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)", padding: "0 20px" }}>
      <Toolbar>
        <Logo src="/src/assets/logo.png" alt="Logo" onClick={handleHomeClick} />
        <Box sx={{ flexGrow: 1 }}>
          {accessToken && <CustomSearchBar />}
        </Box>
        {
          accessToken ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2 }}>
                <Tooltip title="Edit Post" arrow>
                  <Badge color="error" sx={{ cursor: 'pointer' }} onClick={() => navigate('/editor')}>
                    <Edit />
                  </Badge>
                </Tooltip>
                <NotificationMenu />
              </Box>
              <Tooltip title="View Profile" arrow>

                <Box
                  onClick={userProfileClick}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#f0f0f0',
                      borderRadius: '10px',
                    },
                    padding: '5px 10px',
                    marginTop: 1,
                    transition: 'background-color 0.3s',
                  }}
                >
                  <Avatar
                    src="/src/assets/user-svgrepo-com.svg"
                    sx={{
                      width: 30,
                      height: 30,
                      '&:hover': {
                        borderColor: '#0056b3',
                      },
                    }}
                  />
                  <Typography variant="body2" fontWeight="bold" sx={{ fontSize: '14px' }}>
                    {name}
                  </Typography>
                </Box>
              </Tooltip>
            </>
          ) : (
            <Icons>
              <StyledButton variant="contained" sx={{ backgroundColor: "#007BFF", color: "#fff", "&:hover": { backgroundColor: "#0056b3" } }} onClick={() => navigate("/login")}>
                Log In
              </StyledButton>
              <StyledButton variant="outlined" sx={{ color: "#007BFF", borderColor: "#007BFF", "&:hover": { backgroundColor: "#f0f8ff", borderColor: "#0056b3" } }} onClick={() => navigate("/signup")}>
                Sign Up
              </StyledButton>
            </Icons>
          )}
      </Toolbar>
    </AppBar>
  );
}
