import { useEffect, useState } from "react";
import Box from '@mui/material/Box'
import ReportCard from "../../components/ReportCard/ReportCard";
import { Navigate, useNavigate } from "react-router-dom";
import ReportDetail from "./reportDetail";
const apiKey = import.meta.env.VITE_API_URL
export default function ContReports(){
  const [choosenReport,setChoosenReport] = useState();
  const [contractor,setContractor] = useState();
  useEffect(()=>{
    fetch(`${apiKey}/User/${localStorage.getItem('userId')}`)
    .then((response)=>response.json())
    .then((data)=>{setContractor(data)});
  },[])

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
      if(contractor){

        navigator.geolocation.getCurrentPosition((pos)=>{
          setCoord(pos.coords)
          fetch(`${apiKey}/Report/Sort?GeoCoordinate.Latitude=${pos.coords.latitude}&GeoCoordinate.Longitude=${pos.coords.longitude}&GeoCoordinate.Altitude=${pos.coords.altitude || 0}&GeoCoordinate.HorizontalAccuracy=${pos.coords.accuracy || 0}&GeoCoordinate.VerticalAccuracy=${pos.coords.altitudeAccuracy || 0}&GeoCoordinate.Speed=${pos.coords.speed || 0}&GeoCoordinate.Course=${pos.coords.heading || 0}&GeoCoordinate.IsUnknown=true&CompanyId=${contractor.hiringCompanyId}`)
          .then(response => response.json())
          .then(data => setReports(data));
        },(err)=>console.log(err))
      }
      });
    console.log(reports);
    
    return<>
      <Box display={"flex"} flexDirection='column' width={'80%'} gap='1.5rem' alignItems={'center'} jsu paddingTop={'100px'} paddingBottom={'50px'} >
      {choosenReport!=null?<ReportDetail report={choosenReport}/>: reports.map((r)=>{ return <ReportCard onDetailsClick={()=>setChoosenReport(r)} coord={coord} report={r} appUserId={localStorage.getItem('userId')} role="Contractor" onSubmitClick={()=>{ submit(r)} } onSaveClick={()=>{save(r)}}/>})}
      </Box>
    <Box display={'flex'} height={'70%'} alignItems={'flex-start'} >
    </Box>
    </>
}


function save(r){
  // if((r.reportStatus==0))
  // console.log(`https://localhost:7077/Report/UpdateStatus?reportId=${r.reportId}&status=${1}`)
  //https://localhost:7077/Report/UpdateStatus?reportId=1&status=1&contractorId=1
  fetch(`${apiKey}/Report/UpdateStatus?reportId=${r.reportId}&status=${1}&contractorId=${localStorage.getItem('userId')}`, {
          method: 'PUT',
        })
        .then(response => response.json())
        .then(data =>{
          console.log( data)
        }).catch(error => console.error('Error:', error));
}  
function submit(r){
  // if((r.reportStatus==1) || (r.reportStatus==4))
  fetch(`${apiKey}/Report/UpdateStatus?reportId=${r.reportId}&status=${2}&contractorId=${localStorage.getItem('userId')}`, {
          method: 'PUT',
        })
        .then(response => response.json())
        .then(data =>{ 
          console.log( data)
        }).catch(error => console.error('Error:', error));
}

function onExportClick(reports){
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reports));
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "reports" + ".json");
  document.body.appendChild(downloadAnchorNode); 
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}





