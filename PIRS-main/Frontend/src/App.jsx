import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom'
import Home from './Routes/homepage/home'
import ChooseCreateAcc from './Routes/ChooseCreateAcc'
import SignUpAsUser from './Routes/sign_up/SignUpAsUser'
import SignUpAsContractor from './Routes/sign_up/SignUpAsContractor'
import SignUpAsCompany from './Routes/sign_up/SignUpAsCompany'
import SignInAsUser from './Routes/sign_in/SignInAsUser'
import UDashboard from './Routes/user/user_dashboard'
import CreateReport from './Routes/user/create_report'
import MyReports from './Routes/user/my_reports'
import Trending from './Routes/user/trending'
import Company from './Routes/company/Company'
import EditReport from './Routes/user/EditReport'
import Layout from '../src/components/cont_dashboard/Layout'
import ContReports from '../src/Routes/contractor/ContReports'
import ContProfile from '../src/Routes/contractor/ContProfile'
import ContTransaction from '../src/Routes/contractor/ContTransaction'
import {useState} from 'react'
import About from './Routes/user/About'

function App() {
  console.log("At app",localStorage.getItem('AuthInfo'))
  return (
    <>
      <BrowserRouter>
        <Routes>
         <Route index path="/" element={ localStorage.getItem('AuthInfo')=="true" ? 
              <Trending/>
             : <Home/>} />
         <Route index path="/Home" element={<Home/>} />
         <Route path="choosecreate" element={<ChooseCreateAcc/>} />
         <Route path="signupasuser" element={<SignUpAsUser/>} />
         <Route path="signupascontractor" element={<SignUpAsContractor/>} />{/** */}
         <Route path="signupascompany" element={<SignUpAsCompany/>} />{/** */}
         <Route path="signinasuser" element={<SignInAsUser/>} />
         <Route path="About" element={<About/>} />
         <Route path="udashboard" element={<UDashboard/>} />
         <Route
          path='createreport'
          element={
            localStorage.getItem('AuthInfo')=="true" ? 
              <CreateReport />
             : 
              <SignInAsUser redirectUrl={'createreport'}/>
          }
        />
         
         <Route path="reports" element={<MyReports/>} />
         <Route path="trending" element={<Trending/>} />
         <Route path="editreport/*" element={<EditReport/>} />
         <Route path='Company/*' element={<Company/>}/>
         <Route path="contdashboard" element={<Layout/>} >
           <Route path="GetReportById" element={<ContReports />}/>
           <Route path="reportDetail" element={<reportDetail />}/>
           <Route path="profile" element={<ContProfile/>} />
           <Route path="Transaction" element={<ContTransaction/>}/>
          </Route>

         <Route path="contdashboard/Logout/choose/choosecreate" element={<ChooseCreateAcc/>}/>{/** */}
         <Route path='contdashboard/Logout/choosecreate' element={<ChooseCreateAcc/>}/>{/** */}

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
