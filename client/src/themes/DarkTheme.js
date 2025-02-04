import { createTheme } from '@mui/material/styles';

const DarkTheme = createTheme({
    palette: {
        primary: {
            main: '#1a1a1a', // Dark AppBar color (for Admin/Staff)
        },
        secondary: {
            main: '#E6F2FF', // Pink link color (for Admin/Staff)
        },
        background: {
            default: "#333"
        }
    },
    typography: {
        fontFamily: 'Poppins, Arial, sans-serif', // Correct place for defining font family
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    '&.MuiButton-colorAccent': {
                        backgroundColor: '#C6487E', // Your custom Accent color
                        color: '#FFFFFF',  // Ensure text is visible on the Accent background
                        '&:hover': {
                            backgroundColor: '#A43A6D',  // Slightly darker shade for hover effect
                        },
                    },
                },
            },
        },
    },
});

export default DarkTheme;