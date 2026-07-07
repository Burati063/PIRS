const Footer = () => {
    return (
        <>
<div className="container-fluid">

  <footer className="text-center text-lg-start bg-dark">
    <div className="container d-flex justify-content-center py-5">
      <button type="button" className="btn btn-light btn-lg btn-floating mx-2">
      <i className="fab fa-facebook"></i>
      </button>
      <button type="button" className="btn btn-light btn-lg btn-floating mx-2">
      <i className="fab fa-twitter"></i>
      </button>
      <button type="button" className="btn btn-light btn-lg btn-floating mx-2">
      <i className="fab fa-instagram"></i>
      </button>
      <a href="t.me/">

      <button type="button" className="btn btn-light btn-lg btn-floating mx-2">
        <i className="fab fa-telegram"></i>
      </button>
      </a>
    </div>

    <div className="text-center text-white p-3">
      © 2020 Copyright:
      <p className="text-white" href="https://mdbootstrap.com/">EthioRush.com</p>
    </div>
  </footer>
</div>
        </>
     );
}
 
export default Footer;