import { Outlet } from "react-router-dom";
import ProfileSidebar from "../components/ProfileSidebar"
import { Box, CssBaseline } from '@mui/material';
import { ToastContainer } from "react-toastify";
import UserAccountProvider from '../Providers/UserAccountProvider'

const ProfilePage = () => {

  return (
    <UserAccountProvider>
      <CssBaseline />
      <ToastContainer />
      <Box sx={{ position: 'relative', width: '100%', display: 'flex' }}>
        <ProfileSidebar />
        <Box sx={{ flexGrow: 1, ml: 0, padding: 10 }}>
          <Outlet />
        </Box>
      </Box>
    </UserAccountProvider>
  )
}

export default ProfilePage
