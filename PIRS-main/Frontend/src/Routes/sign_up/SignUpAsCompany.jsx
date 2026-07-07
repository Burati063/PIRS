import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import {Link} from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
const apiKey = import.meta.env.VITE_API_URL

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit">
        EthioRush
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignUp() {
  const [username, setUsername] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [imageData,setImageData]= React.useState(new FormData());
  const [formula,setFormula] = React.useState('50');
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  function handleImageChange(event) {
    console.log('Handle image change')
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('imgFile', file)
    setImageData(formData);

}
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const handleFormulaChange = (event) => {
    setFormula(event.target.value)
  }
  const handleSignUp = async (event) => {

    const data = {
      username: username,
      // firstName: firstName,
      // lastName: lastName,
      email: email,
      password: password,
      name: firstName,
      formula:formula,
    };

    event.preventDefault();

  fetch(`${apiKey}/Account/signup?roleName=Company&password=${password}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body:JSON.stringify(data)
    })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        console.log(response)
        localStorage.setItem("token", response.token);
        localStorage.setItem("userId", response.user.id);
        fetch(`${apiKey}/Images/PostCompanyLogo?id=${response.user.id}`, {
          method: 'POST',
          body: imageData
      })
      .then(response => response.json())
      .then(data => {
          console.log(data);
      })
      .catch((error) => {
          console.error('Error:', error);
      });
      })
      .then(() => {
        // alert("Account Created. Redirecting to the Sign In...");
        const role = response.role 
        window.location.href = ((redirectUrl==null)|| (redirectUrl==""))?
        role === 'User'
          ? '../'
          : role === 'Contractor'
          ? '/ContDashboard'
          : '/Company':`/${redirectUrl}`;
      })
      .catch((error) => {
        console.error(error);
        alert("Sign up failed. Please try again.");
      })
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
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSignUp} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Username"
                  autoFocus
                  value={username}
                  onChange={handleUsernameChange}
                />
              </Grid>
{/*               
            <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="First Name"
                  autoFocus
                  value={firstName}
                  onChange={handleFirstNameChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Last Name"
                  autoFocus
                  value={lastName}
                  onChange={handleLastNameChange}
                /> 
              </Grid>*/}
              <Grid item xs={12}>
                <TextField
                  autoComplete="formula"
                  name="formula"
                  required
                  fullWidth
                  id="formula"
                  label="formula to calculate award amount 'u-upvotes' and 'd-number of days'"
                  autoFocus
                  value={formula}
                  onChange={handleFormulaChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={handleEmailChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={handlePasswordChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                Upload Company Logo
                    <input
                        accept="image/*"
                        style={{   clip: 'rect(0 0 0 0)',
                        clipPath: 'inset(50%)',
                        height: 1,
                        overflow: 'hidden',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        whiteSpace: 'nowrap',
                        width: 1,}}
                        id="hidden-file-input"
                        type="file"
                        onChange={handleImageChange}
                    />
                </Button>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 1 }}
            >
              Sign Up
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
