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
import { FormControl,InputLabel,Select,MenuItem } from '@mui/material';
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

  const [coord,setCoord] = React.useState( {
    latitude: 0.0,
    longitude: 0.1,
    altitude: 0.0,
    accuracy: 0.2,
    altitudeAccuracy: 0.0,
    heading: 0.0,
    speed: 0.0
  })


  React.useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos)=>{
      setCoord(pos.coords)
      // fetch(`${apiKey}/Report/Sort?GeoCoordinate.Latitude=${pos.coords.latitude}&GeoCoordinate.Longitude=${pos.coords.longitude}&GeoCoordinate.Altitude=${pos.coords.altitude || 0}&GeoCoordinate.HorizontalAccuracy=${pos.coords.accuracy || 0}&GeoCoordinate.VerticalAccuracy=${pos.coords.altitudeAccuracy || 0}&GeoCoordinate.Speed=${pos.coords.speed || 0}&GeoCoordinate.Course=${pos.coords.heading || 0}&GeoCoordinate.IsUnknown=true&Status=${ reportStatus || 0}`)
      //   .then(response => response.json())
      //   .then(data => setReports(data));
    },(err)=>console.log(err))
    }, []);

    
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [userId, setUserId] = React.useState(localStorage.getItem('userId'));
    const [companyId, setCompanyId] = React.useState('');
    const [contractorId, setContractorId] = React.useState('');
    const [locationId, setLocationId] = React.useState('');
    const [altitude, setAltitude] = React.useState('');
    const [course, setCourse] = React.useState('');
    const [horizontalAccuracy, setHorizontalAccuracy] = React.useState('');
    const [verticalAccuracy, setVerticalAccuracy] = React.useState('');
    // const [awardAmount, setAwardAmount] = React.useState('');
    // const [selectedDate, setSelectedDate] = useState(new Date());
    const [picture, setPicture] = React.useState(null);
    const [isUnknown, setIsUnknown] = React.useState('');
    const [selectedCompany, setSelectedCompany] = React.useState('');
    const [hiringCompanies, setHiringCompanies] = React.useState([]);
    const [imageData,setImageData]= React.useState(new FormData());

  
    const handleTitleChange = (event) => {
      setTitle(event.target.value);
    };
  
    const handleDescriptionChange = (event) => {
      setDescription(event.target.value);
    };
  
    const handleUserIdChange = (event) => {
      setUserId(event.target.value);
    };
  
    const handleCompanyIdChange = (event) => {
      setCompanyId(event.target.value);
    };
  
    const handleContractorIdChange = (event) => {
      setContractorId(event.target.value);
    };
  
    const handleLocationIdChange = (event) => {
      setLocationId(event.target.value);
    };
  
    const handleAltitudeChange = (event) => {
      setAltitude(event.target.value);
    };
  
    const handleCourseChange = (event) => {
      setCourse(event.target.value);
    };
  
    const handleHorizontalAccuracyChange = (event) => {
      setHorizontalAccuracy(event.target.value);
    };
  
    const handleVerticalAccuracyChange = (event) => {
      setVerticalAccuracy(event.target.value);
    };

    const handleDateChange = (date) => {
      setSelectedDate(date);
    };
  
    const handlePictureChange = (event) => {
      // Handle file upload and set the picture state
      const file = event.target.files[0];
      setPicture(file);
    };
    const handleCompanySelection = (company) => {      
      setSelectedCompany(hiringCompanies.find((c)=>c.user.id==company));
      setSelectedCompany(hiringCompanies.find((c)=>c.user.id==company));
      setCompanyId(company)
      // setCompanyId(company.user.id);
    };
    const handleIsUnknownChange = (event) => {
      setIsUnknown(event.target.value);
    };
    function handleImageChange(event) {
      console.log('Handle image change')
      const files = Array.from(event.target.files);

      setImageData(files);
  
  }
    const handleFormSubmit = async (event) => {
      event.preventDefault();

      navigator.geolocation.getCurrentPosition((pos)=>{
        setCoord(pos.coords);
        let formData = new FormData();

        formData.append('location.Latitude', pos.coords.latitude);
        formData.append('userId', userId ? userId : null);
        formData.append('location.IsUnknown', true);
        formData.append('location.VerticalAccuracy', pos.coords.accuracy);
        formData.append('location.LocationId', 0);
        formData.append('location.Speed', 0.1);
        formData.append('upvotes', JSON.stringify({
          id: 0,
          userId: 'string'
        }));
        formData.append('reportId', 0);
        formData.append('title', title ? title : null);
        formData.append('description', description ? description : null);
        formData.append('userId', userId ? userId : null);
        formData.append('companyId', companyId ? companyId : null);
        formData.append('contractorId', contractorId ? contractorId : null);
        formData.append('awardAmount', 0);
        formData.append('status', 0);
        formData.append('dateTime', '2015-05-16T05:50:06');
        formData.append('upvotes',  null);
        formData.append('location.Course', 0.1);
        formData.append('awardAmount', 2);
        if (imageData) {
          for (let i = 0; i < imageData.length; i++) {
              formData.append(`pictures`, imageData[i],imageData[i].name);
          }
        }
        formData.append('location.HorizontalAccuracy', pos.coords.accuracy);
        formData.append('location.Longitude', pos.coords.longitude);
        formData.append('location.Altitude',pos.coords.altitude || 0.1);
        //formData.append('Authorization',localStorage.getItem('token'));

        console.log('Form data before sending')
        console.log(formData,localStorage.getItem('token'));
        fetch(`${apiKey}/Report`, {      
          method: 'POST',
          body: formData
        }).then((response) => {
          console.log(response)
          return response.json();
       
        }).then((response) => {
          alert("Report Created...");
          window.location.href = "./reports";
        }).catch((e) => {
          alert("Invalid input");
          console.log(e);
        })

       
      },(err)=>console.log(err))
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
            Create Report
          </Typography>
          <Box component="form" noValidate onSubmit={handleFormSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="title"
                  required
                  fullWidth
                  id="name"
                  label="Title"
                  autoFocus
                  value={title}
                  onChange={handleTitleChange}
                />
              </Grid>
            <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="description"
                  required
                  fullWidth
                  id="name"
                  label="Description"
                  autoFocus
                  value={description}
                  onChange={handleDescriptionChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="User Id"
                  autoFocus
                  value={userId}
                  onChange={handleUserIdChange}
                />
              </Grid>
              {/* <Grid item xs={12}>
              <div className="dropdown text-center">
              <p> Company:</p> 
              <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
               {selectedCompany && selectedCompany.user.name}
              </button>
              <ul className="dropdown-menu">
                {hiringCompanies.map((company) => (
                  <li key={company.user.id} className='d-flex flex-direction-column'>
                    <Avatar src={`${apiKey}/`+company.user.logo}></Avatar>
                    <a className="dropdown-item" onClick={() => handleCompanySelection(company)}>
                      {company.user.userName}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
              </Grid> */}
              <Grid item xs={12}>
              <Box sx={{maxWidth:300, width:"100%"}}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Company</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      // value={selectedCompany && selectedCompany.user.id}
                      // value={selectedCompany==''? <> <Avatar src={"https://localhost:7077/"+selectedCompany.user.logo}></Avatar> {selectedCompany.user.name}</>:<></>}
                      label="Company"
                      onChange={(event)=>{handleCompanySelection(event.target.value)}}
                      >
                      { 
                      hiringCompanies.map((company)=>
                        <MenuItem value={company.user.id} >
                          <Box sx={{display:"flex" ,gap:".5rem", alignItems:"center"}}>
                            <Avatar src={apiKey+"/"+company.user.logo}></Avatar>
                            <Typography>
                              {company.user.userName}
                            </Typography>
                          </Box>
                        </MenuItem>)
                      }
                    </Select>
                  </FormControl>
                  </Box>
              </Grid>

              {/* <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="LocationId"
                  label="Location Id"
                  type="LocationId"
                  id="LocationId"
                  autoComplete="new-LocationId"
                  value={locationId}
                  onChange={handleLocationIdChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="Altitude"
                  label="Altitude"
                  type="Altitude"
                  id="Altitude"
                  autoComplete="new-Altitude"
                  value={altitude}
                  onChange={handleAltitudeChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="Course"
                  label="Course"
                  type="Course"
                  id="Course"
                  autoComplete="new-Course"
                  value={course}
                  onChange={handleCourseChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="HorizontalAccuracy"
                  label="Horizontal Accuracy"
                  type="HorizontalAccuracy"
                  id="HorizontalAccuracy"
                  autoComplete="new-HorizontalAccuracy"
                  value={horizontalAccuracy}
                  onChange={handleHorizontalAccuracyChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="VerticalAccuracy"
                  label="Vertical Accuracy"
                  type="VerticalAccuracy"
                  id="VerticalAccuracy"
                  autoComplete="new-VerticalAccuracy"
                  value={verticalAccuracy}
                  onChange={handleVerticalAccuracyChange}
                />
              </Grid> */}
              {/* <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="AwardAmount"
                  label="Award Amount"
                  type="AwardAmount"
                  id="AwardAmount"
                  autoComplete="new-AwardAmount"
                  value={awardAmount}
                  onChange={handleAwardAmountChange}
                />
              </Grid> */}
              <Grid item xs={12}>
                <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                Upload Images
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
                        multiple
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
              Create Report
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
