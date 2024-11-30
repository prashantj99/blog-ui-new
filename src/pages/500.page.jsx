import { Container, Typography, Box} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

function InternalServerError() {
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="md">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent:'center'
          }}
        >  
          <img src='/src/assets/500_error.png'></img>
          <Typography variant="h5" component="div" gutterBottom>
            Internal Server Error
          </Typography>
          <Typography variant="p" gutterBottom>
            Sorry, something went wrong on our end. Please try again later.
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default InternalServerError;
