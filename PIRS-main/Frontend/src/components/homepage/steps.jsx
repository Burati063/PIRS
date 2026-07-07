import Img1 from '../../images/6210134.png'
import Img2 from '../../images/pngtree-podcast-logo-design-png-png-image_5490129-removebg-preview.png'
import Img3 from '../../images/png-clipart-computer-icons-quality-control-outsourcing-business-rating-icon-service-logo-removebg-preview.png'
import '../../component_styles/steps.css'
const Steps = () => {
    return ( 
        <>
        <hr /><hr /><hr /><hr />
        <div className="row text-center">
            <h1>Contribute to your community in 3 easy steps</h1>
        </div>
        <hr />
        <div className="row mx-5 text-center">
            <div className="col">
                <img src={Img1} alt="" className='img1'/>
                <h3>Create an Account</h3>
                <hr />
                <h6>Submit your information so that individual contractors or the companies know how to reach out</h6>
            </div>
            <div className="col">
                <img src={Img2} alt="" className='img2'/>
                <h3>Create a new Report</h3>
                <hr />
                <h6>By creating a new report, you will be able to inform the contractors on the issue in the community</h6>
            </div>
            <div className="col">
                <img src={Img3} alt="" className='img3'/>
                <h3>Inform your people</h3>
                <hr />
                <h6>Your neighborhood may be your key to help you reach out to our workers as fast as possible</h6>
            </div>
        </div>
        </>
     );
}
 
export default Steps;