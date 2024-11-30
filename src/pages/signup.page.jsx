import { useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { ToastContainer, toast } from 'react-toastify';
import {
  Container,
  Avatar,
  CssBaseline,
  TextField,
  Typography,
  Box,
  Grid,
} from '@mui/material';
import Wrapper from '../ui/Wrapper';
import FormWrapper from '../ui/FormWrapper';
import StyledButton from '../ui/StyledButton';
import StyledLink from '../ui/StyledLink';
import axios from '../api/axios';
import { REGISTER_URL } from '../commons/AppConstant';




const Signup = () => {
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const authDetails = {
      username: formData.get('username'),
      email: formData.get('email'),
      password: formData.get('password'),
      repeatPassword: formData.get('repeatPassword'),
    };

    // Validation
    const emailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;

    if (!authDetails.email) return toast.error('Enter email!');
    if (!emailRegex.test(authDetails.email)) return toast.error('Invalid email format!');
    if (!passwordRegex.test(authDetails.password)) {
      return toast.error('Password must be 8-20 chars with numbers, uppercase, and lowercase letters.');
    }
    if (authDetails.password !== authDetails.repeatPassword) {
      return toast.error('Passwords do not match!');
    }

    // Server call
    try {
      const response = await axios.post(REGISTER_URL, authDetails);
      if (response.status === 200) {
        toast.success('Account created successfully!');
        setTimeout(() => navigate('/login'), 1000);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong!');
    }
  };

  return (
    <Wrapper>
      <ToastContainer />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <FormWrapper>
          <Avatar sx={{ bgcolor: '#007BFF' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" fontWeight="bold" mt={2}>
            Sign Up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              InputProps={{ style: { borderRadius: '8px' } }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              InputProps={{ style: { borderRadius: '8px' } }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              InputProps={{ style: { borderRadius: '8px' } }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="repeatPassword"
              label="Repeat Password"
              type="password"
              id="repeatPassword"
              autoComplete="new-password"
              InputProps={{ style: { borderRadius: '8px' } }}
            />
            <StyledButton type="submit" fullWidth variant="contained">
              Sign Up
            </StyledButton>
            <Grid container>
              <Grid item xs>
                <StyledLink href="#" variant="body2">
                  Sign up with Google
                </StyledLink>
              </Grid>
              <Grid item>
                <StyledLink href="#" variant="body2">
                  Sign up with GitHub
                </StyledLink>
              </Grid>
            </Grid>
          </Box>
        </FormWrapper>
        <Box mt={4} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <StyledLink to="/login" variant="body2">
              Sign In
            </StyledLink>
          </Typography>
        </Box>
      </Container>
    </Wrapper>
  );
};

export default Signup;
