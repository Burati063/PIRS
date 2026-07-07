import React, { useEffect, useState } from 'react';
import { Grid, TextField, Button } from '@mui/material';
const apiKey = import.meta.env.VITE_API_URL
const ContProfile = () => {
  let contractorId = localStorage.getItem('userId')
  const [profile, setProfile] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    userName: "",
    phoneNumber: ""
  });
  useEffect(() => {
    fetch(`${apiKey}/User/${contractorId}`)
      .then(response => response.json())
      .then(data => {
        console.log('API Response:', data);
        setProfile(data);
      })
      .catch(error => {
        console.error('Error fetching user profile:', error);
      });
  }, [contractorId]);
  const handleEditClick = () => {
    setEditMode(true);
    setUpdatedProfile(profile);
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    console.log(`Field ${name} changed. New value: ${value}`);
    setUpdatedProfile(prevProfile => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSubmitClick = () => {
    fetch(`${apiKey}/User/${contractorId}?roleName=Contractor`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProfile),
    })
      .then(response => response.json())
      .then(data => {
        console.log('API Response:', data);
        setProfile(data);
        setEditMode(false);
      })
      .catch(error => {
        console.error('Error updating user profile:', error);
      });
  };

  return (
    <Grid container spacing={2} style={{ marginTop: '16px' }}>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="Id"
          name="id"
          value={editMode ? updatedProfile.id || '' : profile.id || ''}
          fullWidth
          disabled
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="First Name"
          name="firstName"
          value={editMode ? updatedProfile.firstName || '' : profile.firstName || ''}
          fullWidth
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="Last Name"
          name="lastName"
          value={editMode ? updatedProfile.lastName || '' : profile.lastName || ''}
          fullWidth
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="Username"
          name="userName"
          value={editMode ? updatedProfile.userName || '' : profile.userName || ''}
          fullWidth
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="Email"
          name="email"
          value={editMode ? updatedProfile.email || '' : profile.email || ''}
          fullWidth
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="Phone Number"
          name="phoneNumber"
          value={editMode ? updatedProfile.phoneNumber || '' : profile.phoneNumber || ''}
          fullWidth
          onChange={handleInputChange}
        />
      </Grid>

      <Grid item xs={12}>
        {editMode ? (
          <Button variant="contained" onClick={handleSubmitClick}>
            Submit
          </Button>
        ) : (
          <Button variant="contained" onClick={handleEditClick}>
            Edit
          </Button>
        )}
      </Grid>
    </Grid>
  );
};

export default ContProfile;