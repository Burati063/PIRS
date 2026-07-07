import React from 'react';
import { Box, Typography, Card, CardContent, CardMedia } from '@mui/material';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { useParams } from "react-router-dom"
const apiKey = import.meta.env.VITE_API_URL
export default function ReportDetail({report}) {
  console.log(report)
  const position = [report.location.latitude, report.location.longitude]; // replace with actual latitude and longitude

  return (
    <Box display="flex" p={2}>
      <Card sx={{ flex: 1, mr: 2 }}>
        <CardMedia
          component="img"
          height="140px"
          image={report.pictures[0].image} // replace with actual image url
          alt={report.title}
        />
        <CardContent>
          <Typography variant="h5" component="div">
            {report.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {report.description}
          </Typography>
          <Typography variant="body1">
            Award Amount: {report.awardAmount}
          </Typography>
          <Typography variant="body1">
            Status: {report.status}
          </Typography>
        </CardContent>
      </Card>
      <Box sx={{ flex: 1, height: 100  }}>
        <MapContainer center={position} zoom={13} style={{ height: '30%', width: '30%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="">OpenStreetMap</a> contributors'
          />
          <Marker position={position} />
        </MapContainer>
      </Box>
    </Box>
  );
}