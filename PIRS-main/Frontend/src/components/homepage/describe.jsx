import Logo from '../../images/Screenshot 2024-01-28 101049.png'
const styles = {color: 'black'};
const user_describe = () => {
    return ( 
        <div className="row my-4">
            <div className="col-10 gy-5 text-center">
                <h5 style={styles}>EthioRush is a leading infrastructure company dedicated to delivering innovative and sustainable solutions for the development of Ethiopia's critical infrastructure. 
                    With a focus on construction, transportation, energy, and telecommunications projects, EthioRush leverages cutting-edge technology and industry expertise to drive progress and economic growth. 
                </h5>
            </div>
            <div className="col text-center">
                <img src={Logo} alt="" />
            </div>
        </div>
     );
}
 
export default user_describe;