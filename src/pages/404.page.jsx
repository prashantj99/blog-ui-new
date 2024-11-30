import { Box, Typography, CssBaseline } from "@mui/material";

const NotFoundPage = () => {
    return (
        <>
            <CssBaseline />
            <Box
                sx={{
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    p: 2,
                }}
            >

                <img src='/src/assets/404.png' width='400px' height='auto'/>
                <Typography variant="h5" sx={{ mt: 2, mb: 4 }}>
                    Page Not Found
                </Typography>
                <Typography variant="p" sx={{ mb: 4 }}>
                    Your search has ventured beyond the known universe.
                </Typography>
            </Box>
        </>
    );
};

export default NotFoundPage;
