import Describe from "../../components/homepage/describe";
import Footer from "../../components/homepage/footer";
import Hero from "../../components/homepage/hero";
import NavBar from "../../components/homepage/nav";
import Steps from "../../components/homepage/steps";

function Home(){
    return(
        <>
        <NavBar/>
        <Hero />
        <br />
        {/* <div className="container w-100 my-4 d-lg-none">
        <Describe/>
        <Steps/>
        </div> */}
        <Footer/>
        </>
    );
}
export default Home;