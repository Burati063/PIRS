import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {Link} from 'react-router-dom';
const apiKey = import.meta.env.VITE_API_URL

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function SignInAsUser({redirectUrl}) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const token = localStorage.getItem('token');
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const data ={
      Email : email,
      Password : password
    };
  //   fetch(`https://localhost:7077/Account/login?email=${email}&password=${password}`,{
  //     method : 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'      
  //     },
  //     body:JSON.stringify(data)
  //   }).then((response) => {
  //     return response.json();
  //   }).then((response) =>{
  //     localStorage.setItem("token", response.token);
  //     localStorage.setItem("userId", response.user.id);
  //   }).then((response) => {
  //     console.log(response);
  //     const role = response.role;
  //     alert("Redirecting to the " + role.toLowerCase() + " dashboard...");

  //     window.location.href = role === "User" ? "./udashboard" : role === "Contractor" ? "./ContDashboard" : "./Company";
  //   }).catch(() => {
  //     alert("Invalid email or password");
  //   })
  // };

  fetch(`${apiKey}/Account/login?email=${email}&password=${password}`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
  .then((response) => {
    if (!response.ok) {
      throw new Error('Invalid email or password');
    }
    return response.json();
  })
  .then((response) => {
    localStorage.setItem('token', response.token);
    localStorage.setItem('userId', response.user.id);
    const role = response.role;
    localStorage.setItem('AuthInfo',true);
    window.location.href = ((redirectUrl==null)|| (redirectUrl==""))?
      role === 'User'
        ? '../'
        : role === 'Contractor'
        ? '/ContDashboard'
        : '/Company':`/${redirectUrl}`;
  })
  .catch((error) => {
    alert(error.message);
  });
};

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" noValidate onSubmit={handleFormSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={handleEmailChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={handlePasswordChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 1 }}
            >
              Sign In
            </Button>
          <Link to="/choosecreate">Create account</Link>
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary" align="center">
          {'Copyright © '}
          <Link color="inherit">
            EthioRush
          </Link>{' '}
          {new Date().getFullYear()}
          {'.'}
        </Typography>
      </Container>
    </ThemeProvider>
  );
}