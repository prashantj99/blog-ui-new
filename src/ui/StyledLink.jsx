import { styled } from "@mui/material";
import { Link } from "react-router-dom";

const StyledLink = styled(Link)(({ theme }) => ({
    color: theme.palette.primary.main,
    fontWeight: 600,
    '&:hover': {
        textDecoration: 'underline',
    },
    transition: 'color 0.3s ease',
}));
export default StyledLink;