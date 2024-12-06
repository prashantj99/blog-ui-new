import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    Avatar,
    CssBaseline,
    TextField,
    Link,
    Typography,
    Stack,
    Grid,
    styled,
    Paper,
} from '@mui/material';
import Wrapper from '../ui/Wrapper';
import StyledButton from '../ui/StyledButton';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { ToastContainer, toast } from 'react-toastify';
import axios from '../api/axios';
import ReCAPTCHA from 'react-google-recaptcha';
import {
    EMAIL_VERIFY_FORM,
    OTP_VERIFY_FORM,
    RECAPTCHA_SITE_KEY,
    VERIFY_EMAIL_URL,
    VERIFY_OTP_URL,
} from '../commons/AppConstant';
import useAuth from '../hooks/useAuth';

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: theme.shadows[5],
    maxWidth: 400,
    width: '100%',
}));

const FormBody = styled('form')(({ theme }) => ({
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
}));

export default function ResetPasswordPage() {
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const [capVal, setCapVal] = useState(null);
    const captcha = useRef(null);
    const [formType, setFormType] = useState(EMAIL_VERIFY_FORM);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const emailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;

        const authDetails = {
            email: formData.get('email'),
            captcha: captcha.current.getValue(),
            otp: formData.get('otp'),
        };

        captcha.current.reset();

        if (!authDetails.email.length) {
            return toast.error('Please enter an email.');
        }

        if (!emailRegex.test(authDetails.email)) {
            return toast.error('Invalid email format.');
        }

        try {
            const serverRoute = formType === EMAIL_VERIFY_FORM ? VERIFY_EMAIL_URL : VERIFY_OTP_URL;
            const response = await axios.post(serverRoute, authDetails);

            if (response.data === 'verified' && formType === EMAIL_VERIFY_FORM) {
                setFormType(OTP_VERIFY_FORM);
            } else {
                setAuth((prev) => ({ ...prev, forgotPasswordToken: response.data }));
                navigate('/changepassword');
            }
        } catch (err) {
            console.error(err);
            toast.error('Something went wrong. Please try again.');
        }
    };

    return (
        <Wrapper>
            <ToastContainer />
            <CssBaseline />
            <StyledPaper elevation={6}>
                <Stack alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Reset Password
                    </Typography>
                </Stack>
                <FormBody onSubmit={handleSubmit}>
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
                    {formType === OTP_VERIFY_FORM && (
                        <TextField
                            variant="outlined"
                            fullWidth
                            name="otp"
                            label="OTP"
                            type="text"
                            id="otp"
                            required
                        />
                    )}
                    <ReCAPTCHA
                        sitekey={RECAPTCHA_SITE_KEY}
                        onChange={(val) => setCapVal(val)}
                        ref={captcha}
                        style={{ display: formType === EMAIL_VERIFY_FORM ? 'block' : 'none' }}
                    />
                    <StyledButton
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={!capVal && formType === EMAIL_VERIFY_FORM}
                    >
                        {formType === EMAIL_VERIFY_FORM ? 'Send OTP' : 'Verify OTP'}
                    </StyledButton>
                </FormBody>
                <Grid container justifyContent="space-between" sx={{ marginTop: 2 }}>
                    <Grid item>
                        <Link href="/login" variant="body2">
                            Back to Login
                        </Link>
                    </Grid>
                    <Grid item>
                        <Link href="/signup" variant="body2">
                            Don't have an account? Sign Up
                        </Link>
                    </Grid>
                </Grid>
                <Typography variant="body2" color="textSecondary" align="center" sx={{ marginTop: 4 }}>
                    © {new Date().getFullYear()}{' '}
                    <Link color="inherit" href="#">
                        .blog
                    </Link>{' '}
                    All rights reserved.
                </Typography>
            </StyledPaper>
        </Wrapper>
    );
}
