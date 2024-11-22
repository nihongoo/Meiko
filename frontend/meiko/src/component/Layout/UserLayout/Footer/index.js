import React from 'react';
import '../../../../Asset/boostrap/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

const Footer = () => {
  return (
    <div className="" style={{marginTop: '100px'}}>
      {/* Footer */}
      <footer className="text-center text-lg-start text-white" style={{ backgroundColor: '#45526e' }}>
        {/* Grid container */}
        <div className="container p-4 pb-0">
          {/* Section: Links */}
          <section>
            {/* Grid row */}
            <div className="row">
              {/* Grid column: Company name */}
              <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
                <h6 className="text-uppercase mb-4 font-weight-bold">Company name</h6>
                <p>
                  Here you can use rows and columns to organize your footer
                  content. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                </p>
              </div>

              <hr className="w-100 clearfix d-md-none" />

              {/* Grid column: Products */}
              <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3">
                <h6 className="text-uppercase mb-4 font-weight-bold">Products</h6>
                <p><a className="text-white no-underline" href="#!">MDBootstrap</a></p>
                <p><a className="text-white no-underline" href="#!">MDWordPress</a></p>
                <p><a className="text-white no-underline" href="#!">BrandFlow</a></p>
                <p><a className="text-white no-underline" href="#!">Bootstrap Angular</a></p>
              </div>
              
              <hr className="w-100 clearfix d-md-none" />
              
              {/* Grid column: Useful links */}
              <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mt-3">
                <h6 className="text-uppercase mb-4 font-weight-bold">Useful links</h6>
                <p><a className="text-white no-underline" href="#!">Your Account</a></p>
                <p><a className="text-white no-underline" href="#!">Become an Affiliate</a></p>
                <p><a className="text-white no-underline" href="#!">Shipping Rates</a></p>
                <p><a className="text-white no-underline" href="#!">Help</a></p>
              </div>


              <hr className="w-100 clearfix d-md-none" />

              {/* Grid column: Contact */}
              <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
                <h6 className="text-uppercase mb-4 font-weight-bold">Contact</h6>
                <p><i className="fa fa-home mr-3"></i> New York, NY 10012, US</p>
                <p><i className="fa fa-envelope mr-3"></i> info@gmail.com</p>
                <p><i className="fa fa-phone mr-3"></i> + 01 234 567 88</p>
                <p><i className="fa fa-print mr-3"></i> + 01 234 567 89</p>
              </div>
            </div>
            {/* Grid row */}
          </section>
          {/* Section: Links */}

          <hr className="my-3" />

          {/* Section: Copyright */}
          <section className="p-3 pt-0">
            <div className="row d-flex align-items-center">
              {/* Grid column: Copyright */}
              <div className="col-md-7 col-lg-8 text-center text-md-start">
                <div className="p-3">
                  <a className="text-white" href="https://mdbootstrap.com/"></a>
                </div>
              </div>

              {/* Grid column: Social Media Icons */}
              <div className="col-md-5 col-lg-4 ml-lg-0 text-center text-md-end">
                {/* Facebook */}
                <a className="btn btn-outline-light btn-floating m-1" role="button" href="#!">
                  <i className="fa fa-facebook-f"></i>
                </a>

                {/* Twitter */}
                <a className="btn btn-outline-light btn-floating m-1" role="button" href="#!">
                  <i className="fa fa-twitter"></i>
                </a>

                {/* Google */}
                <a className="btn btn-outline-light btn-floating m-1" role="button" href="#!">
                  <i className="fa fa-google"></i>
                </a>

                {/* Instagram */}
                <a className="btn btn-outline-light btn-floating m-1" role="button" href="#!">
                  <i className="fa fa-instagram"></i>
                </a>
              </div>
            </div>
          </section>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
