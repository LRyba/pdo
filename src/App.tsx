import { Box, Typography, ThemeProvider, Button, Stack } from '@mui/material';
import { lightTheme } from './components/Theme';

function App() {


  return (
    <ThemeProvider theme={lightTheme}>
      <Box display="flex" justifyContent="center" minHeight="100vh" bgcolor='#E5E4D7'>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" border="2px solid red" margin="2rem 1rem">
          <Typography variant="h4" color="secondary" textAlign="center">
            Kuponik
          </Typography>
          <Button variant="contained" color="primary">
            Get Started
          </Button>
        </Box>
        {/* <Stack spacing={2} >

        </Stack> */}
      </Box>
    </ThemeProvider >
  );
}

export default App;