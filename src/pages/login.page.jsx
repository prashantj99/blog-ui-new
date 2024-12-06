import { useLocation, useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { ToastContainer, toast } from 'react-toastify';
import {
  Container,
  Avatar,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
  Grid,
} from '@mui/material';

import Wrapper from '../ui/Wrapper';
import FormWrapper from '../ui/FormWrapper';
import StyledButton from '../ui/StyledButton';
import StyledLink from '../ui/StyledLink';

import axios from '../api/axios';
import { LOGIN_URL } from '../commons/AppConstant';
import useAuth from '../hooks/useAuth';
import { useEffect } from 'react';


// Component
const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth, isAuthenticated, setIsAuthenticated } = useAuth();
  const from = location.state?.from?.pathname || '/feed';

  // Sync authentication state with localStorage
  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
  }, [isAuthenticated]);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const authDetails = {
      email: formData.get('email'),
      password: formData.get('password'),
    };

    // Validation
    const emailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;

    if (!authDetails.email) return toast.error('Enter email!');
    if (!emailRegex.test(authDetails.email)) return toast.error('Invalid email format!');
    if (!passwordRegex.test(authDetails.password)) {
      return toast.error('Password must be 8-20 chars with numbers, uppercase, and lowercase letters.');
    }

    // Send authentication request
    try {
      const response = await axios.post(LOGIN_URL, authDetails);
      setAuth(response.data);
      console.log(response.data);
      navigate(from, { replace: true });
    } catch (err) {
      const message = err?.response?.status === 404
        ? 'Incorrect email or password!'
        : 'Something went wrong!';
      toast.error(message);
    }
  };

  // JSX
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
            Sign In
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
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
              autoComplete="current-password"
              InputProps={{ style: { borderRadius: '8px' } }}
            />
            <FormControlLabel
              control={<Checkbox color="primary" />}
              label="Remember me"
              onChange={() => setIsAuthenticated((prev) => !prev)}
              checked={isAuthenticated}
            />
            <StyledButton type="submit" fullWidth variant="contained">
              Sign In
            </StyledButton>
            <Grid container>
              <Grid item xs>
                <StyledLink to="/forgotpassword" variant="body2">
                  Forgot password?
                </StyledLink>
              </Grid>
              <Grid item>
                <StyledLink to="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </StyledLink>
              </Grid>
            </Grid>
          </Box>
        </FormWrapper>
        <Box mt={4} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            {'Copyright © '}
            <StyledLink href="#" underline="none">
              .blog
            </StyledLink>{' '}
            {new Date().getFullYear()}
            {'.'}
          </Typography>
        </Box>
      </Container>
    </Wrapper>
  );
};

export default Login;
