import { Card, CardContent, Typography, IconButton, Box, Grid, CircularProgress, CardActions, CardMedia } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import circularProgress from '@mui/material/CircularProgress';
import { Edit, Delete, ThumbUp, Book } from '@mui/icons-material';
import ChangeHistoryRoundedIcon from '@mui/icons-material/ChangeHistoryRounded';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import SendIcon from '@mui/icons-material/Send';
import VerifiedIcon from '@mui/icons-material/Verified';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import {useState} from 'react'

const ReportCard = ({ report, role, appUserId="",coord,onUpvoteClick, onDeleteClick,onEditCLick,onSubmitClick,onSaveClick,onApproveClick,onRejectClick }) => {
  coord==null?coord={latitude:0.0,longitude:0.0}:"";
  // console.log(report.upvotes);
  const [upvoteClicked,setUpvoteClicked] = useState((report.upvotes.some((u) => u.userId === appUserId)))
  const[upvoteCount,setUpvoteCount] = useState(report.upvotes.length);
  const [submitClicked,setsubmitClicked] = useState(false)
  const [saveClicked,setsaveClicked] = useState(false)
  const [approveClicked,setapproveClicked] = useState(false)
  const [rejectClicked,setrejectClicked] = useState(false)
  // const [coord,setCoord] = useState({latitude:0.0,longitude:0.00})
  //  role= 'Contractor'
    // appUserId='2'
  // navigator.geolocation.getCurrentPosition((pos)=>console.log(setCoord(pos.coords)),(err)=>console.log(err))
  if (!report) {
    return <div>No report data</div>;
  }
  return (
    <>
    <Card sx={{ maxWidth: '70vw', width: '100%', marginRight:'2rem', display:"flex", flexDirection:{ xs: 'column', md: 'row'} }}>
        <CardMedia
         sx={{ height: 140 , minWidth:'25%'}}
         image={report.pictures.length>0?report.pictures[0].image:"https://picsum.photos/400/300"}
         
        />
         <Box display={'flex'}  minWidth={'75%'} flexDirection={'column'}>
          <Box display={'flex'} justifyContent={'space-between'}>

          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {report.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {report.description}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Distance: {getDistanceFromLatLonInKm(report.location.latitude,report.location.longitude,coord.latitude,coord.longitude)}Km
                {/* {console.log(report.location)} */}
                {/* {console.log(coord)} */}
              </Typography>
            {role != 'User' && (
              <Typography variant="body2" color="text.secondary">
                Award Amount: ${report.awardAmount}
              </Typography>
              
            )}
            </CardContent>
            <CardActions>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {role=="User"?
              <>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent:'center', flexDirection:'column' }}>
              <IconButton  onClick={()=>{ onUpvoteClick(); if( upvoteClicked){setUpvoteClicked(false); setUpvoteCount(upvoteCount-1)}else{setUpvoteClicked(true); setUpvoteCount(upvoteCount+1)}}}>
                  <ChangeHistoryRoundedIcon  fontSize='medium' color={(upvoteClicked) ? 'primary' : 'inherit'} />
                </IconButton>
                <Typography variant="body2" color="text.secondary">
                {upvoteCount}
                </Typography>
                {/* <IconButton>
                  <Edit  onClick={onEditCLick}/>
                </IconButton> */}
                {report.userId == localStorage.getItem('userId')?
                <IconButton>
                  <Delete color='error' onClick={onDeleteClick}/>
                </IconButton>:<></>}
              </Box>
              </>
              : <></>   }
              <Box sx={{ display: 'flex', alignItems: 'center'}}>
              {/* {((role=="User") && (appUserId==report.userId))?
              <>
              <IconButton>
                  <Edit  onClick={onEditCLick}/>
                </IconButton>
                <IconButton>
                  <Delete color='error' onClick={onDeleteClick}/>
                </IconButton>
                </>:<></>} */}
                { (role=="Contractor")&&((report.status != 2) && (report.status != 3))?
                <><IconButton>
                  <BookmarkBorderIcon onClick={onSaveClick} {...report.contractorId==appUserId?{color:"primary"}:{color:"inherit"}}/>
                </IconButton>
                <IconButton>
                  <SendIcon  color='primary' onClick={onSubmitClick} />
                </IconButton>
                </>:<></>}
                {role=="Company"?
                <>
                <IconButton>
                  <VerifiedIcon onClick={onApproveClick} {...report.status==3?{color:"primary"}:{color:"inherit"}}/>
                </IconButton>
                <IconButton>
                  <ThumbDownOffAltIcon onClick={onRejectClick} {...report.status==4?{color:"error"}:{color:"inherit"}}/>
                </IconButton>
                </>  :<></> }
              </Box>
            </Box>
          </CardActions>
        </Box>
      <Box width={'400%'}>
        {report.status==4?<LinearProgress variant="determinate" value={100} color='secondary' />:<LinearProgress variant="determinate" value={((report.status+1)/4)*100} color='primary' />}
      </Box>  
      </Box>
    </Card>
   </>
  );
};


export default ReportCard;

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  // console.log(lat1,lon1,lat2,lon2);
  var dLat = deg2rad(lat2-lat1);
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d.toFixed(1);
}

function deg2rad(deg) {
  return (deg * (Math.PI/180));
}