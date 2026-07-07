import { Card, CardContent, Typography, IconButton, Box, Grid, CircularProgress } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import circularProgress from '@mui/material/CircularProgress';
import { Edit, Delete, ThumbUp, Book } from '@mui/icons-material';
import ChangeHistoryRoundedIcon from '@mui/icons-material/ChangeHistoryRounded';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import SendIcon from '@mui/icons-material/Send';
import VerifiedIcon from '@mui/icons-material/Verified';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import {useState} from 'react'
import DetailsIcon from '@mui/icons-material/Details';

 
const ReportCard = ({ report, onDetailsClick, role, appUserId="",coord,onUpvoteClick, onDeleteClick,onEditCLick,onSubmitClick,onSaveClick,onApproveClick,onRejectClick }) => {
  coord==null?coord={latitude:0.0,longitude:0.0}:"";
  if (!report) {
    return <div>No report data</div>;
  }
  return (
    <>
    <Card sx={{ maxWidth: '90vw', width: '100%', marginRight:'2rem' }} >
      <Grid container >
        <Grid item xs={2}>
          <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
            <img src={report.pictures.length>0?report.pictures[0].image:"https://picsum.photos/400/300"} alt="Demo" loading="lazy" style={{ width:"100px", position: 'absolute', height:'100px', objectFit: 'cover', borderRadius:'4px' }} />
          </Box>
        </Grid>
        <Grid item xs={10} display={'flex'} justifyContent={'space-between'} paddingLeft={'1rem'}>
          
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
            <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {role=="User"?
              <>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent:'center', flexDirection:'column' }}>
              <IconButton>
                  <ChangeHistoryRoundedIcon onClick={onUpvoteClick} fontSize='medium' color={report.upvotes.some(r => r.userId === appUserId) ? 'primary' : 'inherit'} />
                </IconButton>
                <Typography variant="body2" color="text.secondary">
                {report.upvotes.length}
                </Typography>
                
              </Box>
              </>
              : <></>   }
              <Box sx={{ display: 'flex', alignItems: 'center'}}>
              {((role=="User") && (appUserId==report.userId))?
              <>
              <IconButton>
                  <Edit  onClick={onEditCLick}/>
                </IconButton>
                <IconButton>
                  <Delete color='error' onClick={onDeleteClick}/>
                </IconButton>
                </>:<></>}
                { (role=="Contractor")?
                <><IconButton>
                  <BookmarkBorderIcon {...report.status==2?{color:"primary"}:{color:"inherit"}} onClick={onSaveClick} />
                </IconButton>
                <IconButton>
                  <SendIcon   {...report.status==3?{color:"primary"}:{color:"inherit"}} onClick={onSubmitClick} />
                </IconButton>
                <IconButton>
                  <DetailsIcon onClick={onDetailsClick}/>
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
          </CardContent>
        </Grid>
      </Grid>
      <Box sx={{ width: '400%' }}>
        {report.status==4?<LinearProgress variant="determinate" value={100} color='secondary' />:<LinearProgress variant="determinate" value={((report.status+1)/4)*100} color='primary' />}
      </Box>
    </Card>
   </>
  );
};

export default ReportCard;

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  console.log(lat1,lon1,lat2,lon2);
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