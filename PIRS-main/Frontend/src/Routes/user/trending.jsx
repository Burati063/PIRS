import { useEffect, useState } from "react";
import Box from '@mui/material/Box'
import ReportCard from "./ReportCard/ReportCard";
import UNav from "../../components/user_dashboard/user_nav";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import FormControl from '@mui/material/FormControl';
import Typography  from "@mui/material/Typography";
import Select from '@mui/material/Select';
const apiKey = import.meta.env.VITE_API_URL
const appUserId = localStorage.getItem("userId")
export default function Reports(companyId="1", status="0"){

    const [reports,setReports] = useState([]);
    const [pos,setPos] = useState();
    const [hiringCompanies,setHiringCompanies] = useState([])
    const [selectedCompanyId,setSelectedCompanyId] = useState(1)
    useEffect(() => {
      navigator.geolocation.getCurrentPosition((pos)=>{
        setPos(pos)
        fetch(`${apiKey}/Report/Sort?GeoCoordinate.Latitude=${pos.coords.latitude}&GeoCoordinate.Longitude=${pos.coords.longitude}&GeoCoordinate.Altitude=${pos.coords.altitude || 0}&GeoCoordinate.HorizontalAccuracy=${pos.coords.accuracy || 0}&GeoCoordinate.VerticalAccuracy=${pos.coords.altitudeAccuracy || 0}&GeoCoordinate.Speed=${pos.coords.speed || 0}&GeoCoordinate.Course=${pos.coords.heading || 0}&GeoCoordinate.IsUnknown=true&CompanyId=${selectedCompanyId}&Status=${  0}`)
          .then(response => response.json())
          .then(data => setReports(data));
      },(err)=>{console.log(err)
        fetch(`${apiKey}/Report/Sort?GeoCoordinate.Latitude=${pos.coords.latitude}&GeoCoordinate.Longitude=${pos.coords.longitude}&GeoCoordinate.Altitude=${pos.coords.altitude || 0}&GeoCoordinate.HorizontalAccuracy=${pos.coords.accuracy || 0}&GeoCoordinate.VerticalAccuracy=${pos.coords.altitudeAccuracy || 0}&GeoCoordinate.Speed=${pos.coords.speed || 0}&GeoCoordinate.Course=${pos.coords.heading || 0}&GeoCoordinate.IsUnknown=true&CompanyId=${selectedCompanyId}&Status=${  0}`)
        .then(response => response.json())
        .then(data => setReports(data));
      })
      }, []);
      useEffect(()=>{
        fetch(`${apiKey}/User/users-with-roles?roleName=Company`)
        .then((response) => response.json())
        .then((response) => {
          setHiringCompanies(response);
          setHiringCompanies(response);
          
          console.log("asdfafd",hiringCompanies)
        })
        .catch((error) => {
          console.error('Error fetching hiring companies:', error);
        });
      },[])
      
      const handleCompanySelection = async (companyId) => {
        console.log(companyId)
        if(companyId == "select")
        {
          let response = await fetch(`${apiKey}/Report/Sort?GeoCoordinate.Latitude=${pos.coords.latitude}&GeoCoordinate.Longitude=${pos.coords.longitude}&GeoCoordinate.Altitude=${pos.coords.altitude || 0}&GeoCoordinate.HorizontalAccuracy=${pos.coords.accuracy || 0}&GeoCoordinate.VerticalAccuracy=${pos.coords.altitudeAccuracy || 0}&GeoCoordinate.Speed=${pos.coords.speed || 0}&GeoCoordinate.Course=${pos.coords.heading || 0}&GeoCoordinate.IsUnknown=true&Status=${0}`)
          let data = await response.json()
          setReports(data)
        }
        else{
          setSelectedCompanyId(companyId);
          let response = await fetch(`${apiKey}/Report/Sort?GeoCoordinate.Latitude=${pos.coords.latitude}&GeoCoordinate.Longitude=${pos.coords.longitude}&GeoCoordinate.Altitude=${pos.coords.altitude || 0}&GeoCoordinate.HorizontalAccuracy=${pos.coords.accuracy || 0}&GeoCoordinate.VerticalAccuracy=${pos.coords.altitudeAccuracy || 0}&GeoCoordinate.Speed=${pos.coords.speed || 0}&GeoCoordinate.Course=${pos.coords.heading || 0}&GeoCoordinate.IsUnknown=true&CompanyId=${selectedCompanyId}&Status=${0}`);
          let data = await response.json();
          setReports(data);
        }
      };
    
    return<>
    <UNav/>
    <Box display={"flex"} flexDirection='column' width={'90%'} gap='1.5rem' paddingTop={'10px'} paddingBottom={'50px'} className="report mx-5">
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
            <MenuItem value={"select"} >
                <Typography>
                  {"All"}
                </Typography>
            </MenuItem>
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

    {reports.map((r)=>{return <ReportCard report={r} appUserId={appUserId} role="User" onUpvoteClick={()=>{handleUpvote(r)}} onApproveClick={(e)=>{console.log(e)}} onRejectClick={()=>{console.log(r)}}/>})}
    </Box>
    </>
}

function handleUpvote(report){
  console.log(report);
  if((localStorage.getItem('userId')== null) || (localStorage.getItem('userId')== "" ) || (localStorage.getItem('AuthInfo')=="false"))
  {
    location.href = "/signinasuser"
    return
  }
  let upvote = report.upvotes.find((u)=>u.userId==appUserId);
  // Delete
  if(report.upvotes.some((u)=>u.userId==appUserId)){
    fetch(`${apiKey}/Report/Upvote?reportId=${report.reportId}&upvoteId=${upvote.id}`, {
      method: 'DELETE'
    })
  }
  // Create
  else{
    fetch(`${apiKey}/Report/Upvote?reportId=${report.reportId}&userId=${appUserId}`, {
      method: 'POST'
    })
    .then((r)=>r.json())
    .then((r)=>{console.log(r)})
  }
}