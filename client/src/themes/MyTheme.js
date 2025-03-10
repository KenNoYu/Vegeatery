// https://mui.com/material-ui/customization/color/
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#FFFFFF',
        },
        secondary: {
            main: '#E6F2FF',
        },
        Accent: {
            main: '#C6487E',
        },
        Accent2: {
            main: '#65914D',
        },
        Accent3: {
            main: '#F7E35B',
        },
        primaryText: {
            main: '#292827',
        },
        secondaryText: {
            main: '#585858',
        },
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

export default theme;