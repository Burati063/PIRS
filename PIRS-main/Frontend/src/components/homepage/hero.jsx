import { Link } from 'react-router-dom';
import '../../component_styles/hero.css';
const Hero = () => {
    return ( 
        <div style={{overflow:"hidden", paddingBottom:"9vh"}}>
          <div className="row" >
          <section className='light-image col-6'>
        <div className="heroInner justify-content-center my-5">
            <span>
              <h3 >Report, Gain Ratings and Expect Support in a Short Time</h3>
              <Link to="/signupasuser">
                <br />
              <button className="btn btn-primary">
                Report Now
              </button>
              </Link>
            </span>
          </div>
        </section>
          <section className="light-hero col-6">
        </section>
          </div>
      </div>
     );
}
 
export default Hero;