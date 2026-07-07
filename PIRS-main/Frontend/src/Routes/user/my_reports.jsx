import { useEffect, useState } from "react";
import Box from '@mui/material/Box'
import ReportCard from "./ReportCard/ReportCard";
import UNav from "../../components/user_dashboard/user_nav";

const apiKey = import.meta.env.VITE_API_URL
export default function Reports(companyId, status="0"){

  const [coord,setCoord] = useState( {
    latitude: 0.0,
    longitude: 0.1,
    altitude: 0.0,
    accuracy: 0.2,
    altitudeAccuracy: 0.0,
    heading: 0.0,
    speed: 0.0
  })

    const [reports,setReports] = useState([]);
    useEffect(() => {
      navigator.geolocation.getCurrentPosition((pos)=>{
        setCoord(pos.coords)
        fetch(`${apiKey}/Report/Sort?GeoCoordinate.Latitude=${pos.coords.latitude}&GeoCoordinate.Longitude=${pos.coords.longitude}&GeoCoordinate.Altitude=${pos.coords.altitude || 0}&GeoCoordinate.HorizontalAccuracy=${pos.coords.accuracy || 0}&GeoCoordinate.VerticalAccuracy=${pos.coords.altitudeAccuracy || 0}&GeoCoordinate.Speed=${pos.coords.speed || 0}&GeoCoordinate.Course=${pos.coords.heading || 0}&GeoCoordinate.IsUnknown=true&Status=${0}`)
          .then(response => response.json())
          .then(data => {setReports(data); console.log(data)});
      },(err)=>console.log(err))
      }, []);
    return<>
    <UNav/>
    <Box display={"flex"} flexDirection='column' width={'90%'} gap='1.5rem' paddingTop={'100px'} paddingBottom={'50px'} className="report mx-5">

    {reports.map((r)=>{return <ReportCard coord={coord} report={r} appUserId={companyId} role="User" onDeleteClick={()=> {onDeleteClick(r) }} onUpvoteClick={()=>{onUpvoteClick(r)}}/>})}
    </Box>
    </>
}
const onDeleteClick = (r) => {
  fetch(`${apiKey}/Report?id=${r.reportId}`,{
    method : 'DELETE',
    headers: {
      'Content-Type': 'application/json'      
    },
  })
  .then(() =>{
    alert("Report deleted successfully...");
    window.location.href = "./reports";
  })
  .catch(error => {
    // Handle error, e.g., show an error message
    console.error('Error deleting report:', error);
  });
};


const onUpvoteClick = (r) => {
  const data = {
    reportId: r.reportId,
    userId: localStorage.getItem('userId')
  };
  if(r.upvotes != null){
    console.log(r.upvotes);
    const upv = r.upvotes.find((upv)=> upv.userId == data.userId);
    if(upv){
      // If the user has already upvoted, remove the upvote
      fetch(`${apiKey}/Report/Upvote?reportId=${data.reportId}&upvoteId=${upv.id}`, {
        method: 'DELETE'
      })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
      });
    }
    else{
      // If the user hasn't upvoted yet, add the upvote
      fetch(`${apiKey}/Report/Upvote?reportId=${data.reportId}&userId=${data.userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
      });
    }
  }
  else{
    fetch(`${apiKey}/Report/Upvote?reportId=${data.reportId}&userId=${data.userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
    });
  }
};