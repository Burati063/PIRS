import { Link } from "react-router-dom";

const ChooseAccount = () => {
    return ( 
        <>
<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center',gap:'2rem', justifyContent: 'center', height: '90vh', width: '100%'}}>
        <h2 style={{color:'black'}}>Choose an Account </h2>
    <div style={{border: '1px solid', width: '40vw', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Link to="../signupasuser" style={{width: '100%', textAlign: 'center'}} className="btn btn-primary"><h5>User</h5></Link>
    </div>
    <div style={{border: '1px solid', width: '40vw', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Link to="../signupascontractor" style={{width: '100%', textAlign: 'center'}} className="btn btn-primary"><h5>Contractor</h5></Link>
    </div>
    <div style={{border: '1px solid', width: '40vw', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Link to="../signupascompany" style={{width: '100%', textAlign: 'center'}} className="btn btn-primary"><h5>Company</h5></Link>
    </div>
</div>
</>
     );
}
 
export default ChooseAccount;