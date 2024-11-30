import { Button, styled } from "@mui/material";

const StyledButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(3, 0, 2),
    padding: theme.spacing(1.5),
    fontSize: '1rem',
    fontWeight: 600,
    backgroundColor: '#007BFF',
    color: '#fff',
    borderRadius: '50px',
    '&:hover': {
        backgroundColor: '#0056b3',
    },
    transition: 'background-color 0.3s ease',
}));

export default StyledButton;  
