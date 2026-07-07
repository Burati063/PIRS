import { useState } from 'react';
import {Link} from 'react-router-dom'

const UNav = () => {
  const [baropen,setbaropen] = useState(false);
  console.log((localStorage.getItem('AuthInfo')=="true"))
    return ( 
        <nav className="navbar navbar-expand-lg sticky-top bg-info  ">
        <div className="container-fluid">
          <a className="navbar-brand text-white" href="/Home">
            Yemimeleketew
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={()=>{if(baropen) document.getElementById('navbarNavDropdown').style.display="none";else{document.getElementById('navbarNavDropdown').style.display="block"} setbaropen(!baropen)}}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav">
             
              <li className="nav-item">
                <Link to='../createreport'>                
                <button data-mdb-ripple-init type="button" className="btn text-white">
                  Create 
                </button> 
                </Link>
              </li>             
              <li className="nav-item">
                <Link to='../'>                
                <button data-mdb-ripple-init type="button" className="btn text-white">
                  Trending 
                </button> 
                </Link>
              </li>
              {(localStorage.getItem('AuthInfo')=="true")?
              <li className="nav-item">
                <Link  onClick={()=>{localStorage.setItem('AuthInfo',false); localStorage.setItem('userId',""); location.reload();}}>                
                <button data-mdb-ripple-init type="button" className="btn text-white" >
                  Log Out
                </button> 
                </Link>
              </li>:
              <li className="nav-item">
              <Link  to='../signInAsUser'>                
              <button data-mdb-ripple-init type="button" className="btn text-white" >
                Log In
              </button> 
              </Link>
              </li>}
              <li className="nav-item">
                <Link to='../about'>                
                <button data-mdb-ripple-init type="button" className="btn text-white">
                  About
                </button> 
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
     );
}
 
export default UNav;