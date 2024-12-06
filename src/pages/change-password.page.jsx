import {
  Avatar,
  CssBaseline,
  TextField,
  Typography,
  Stack,
  Box,
} from '@mui/material';
import StyledButton from '../ui/StyledButton';
import Wrapper from '../ui/Wrapper';
import FormWrapper from '../ui/FormWrapper';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import useAuth from '../hooks/useAuth';
import { CHANGE_PASSWORD_URL } from '../commons/AppConstant';

const ChangePasswordPage = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!sessionStorage.getItem('password_reset_token')) {
      navigate('/login');
    }

    const formData = new FormData(event.currentTarget);
    const authDetails = {
      new_password: formData.get('new_password'),
      repeat_password: formData.get('repeat_password'),
      token: auth.forgotPasswordToken,
    };

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;

    if (!passwordRegex.test(authDetails.new_password)) {
      return toast.error(
        'Password must be 8-20 characters, including uppercase, lowercase, and a digit.'
      );
    }

    if (authDetails.new_password !== authDetails.repeat_password) {
      return toast.error("Passwords don't match.");
    }

    sessionStorage.removeItem('password_reset_token');

    try {
      await axios.post(CHANGE_PASSWORD_URL, authDetails);
      setAuth((prev) => ({ ...prev, forgotPasswordToken: null }));
      navigate('/login');
    } catch (err) {
      toast.error('Failed to update the password.');
    }
  };

  return (
    <Wrapper>
      <ToastContainer />
      <FormWrapper maxWidth="xs">
        <CssBaseline />
        <Stack alignItems="center" spacing={2}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h5">Change Password</Typography>
        </Stack>
        <Box component="form" noValidate onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="new_password"
            label="New Password"
            type="password"
            id="password1"
            autoFocus
            InputProps={{ style: { borderRadius: '8px' } }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="repeat_password"
            label="Confirm Password"
            type="password"
            id="password2"
          />
          <StyledButton type="submit" fullWidth variant="contained">
            Submit
          </StyledButton>
        </Box>
      </FormWrapper>
    </Wrapper>
  );
};

export default ChangePasswordPage;
