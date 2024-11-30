import { Box, styled } from "@mui/material";

const FormWrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.05)',
    width: '100%',
    maxWidth: 400,
}));

export default FormWrapper;
