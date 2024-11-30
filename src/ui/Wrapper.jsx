import { Box, styled } from "@mui/material";

const Wrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: '#f4f7fc',
}));
export default Wrapper;