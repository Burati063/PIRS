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


const defaultTheme = createTheme();

export default function SignUp() {

  const [username, setUsername] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [hiringCompanies, setHiringCompanies] = React.useState([]);
  const [selectedCompany, setSelectedCompany] = React.useState('');



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

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const handleCompanySelection = (company) => {
    console.log(company);
    setSelectedCompany(company);
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    const data = {
      username: username,
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      name: firstName,
      hiringCompanyId:selectedCompany.user.id
    };
    console.log(data);
    fetch(`${apiKey}/Account/signup?roleName=Contractor&password=${password}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        localStorage.setItem("token", response.token);
        localStorage.setItem("userId", response.user.id);
        // alert("Account Created. Redirecting to the Sign In...");
        const role = response.role 
        window.location.href = ((redirectUrl==null)|| (redirectUrl==""))?
        role === 'User'
          ? '../'
          : role === 'Contractor'
          ? '/ContDashboard'
          : '/Company':`/${redirectUrl}`;
      })
      .catch(() => {
        alert("Sign up failed. Please try again.");
      });
    };
    React.useEffect(() => {
      // Fetch the list of hiring companies from the server
      fetch(`${apiKey}/User/users-with-roles?roleName=Company`)
        .then((response) => response.json())
        .then((data) => {
          setHiringCompanies(data);
        })
        .catch((error) => {
          console.error('Error fetching hiring companies:', error);
        });
    }, [])
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
              <div className="dropdown text-center">
              <p>Hiring Company:</p> 
              <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
               {selectedCompany && selectedCompany.user.name}
              </button>
              <ul className="dropdown-menu">
                {hiringCompanies.map((company) => (
                  <li key={company.user.id} className='d-flex flex-direction-column'>
                    <Avatar src={apiKey+"/"+company.user.logo}></Avatar>
                    <a className="dropdown-item" onClick={() => handleCompanySelection(company)}>
                      {company.user.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
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
