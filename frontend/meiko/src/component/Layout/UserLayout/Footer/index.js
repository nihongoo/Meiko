import React from 'react';
import 'font-awesome/css/font-awesome.min.css';

const Footer = () => {
  return (
    <div className="" style={{ marginTop: '100px' }}>
      {/* Footer */}
      <footer className="text-center text-lg-start text-white" style={{ backgroundColor: '#45526e' }}>
        {/* Grid container */}
        <div className="container p-4 pb-0">
          {/* Section: Links */}
          <section>
            {/* Grid row */}
            <div className="row">
              {/* Grid column: Tên công ty */}
              <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
                <h6 className="text-uppercase mb-4 font-weight-bold">Tên Công Ty</h6>
                <p>
                  Đây là nơi bạn có thể sử dụng các hàng và cột để tổ chức nội dung footer của mình.
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                </p>
              </div>

              <hr className="w-100 clearfix d-md-none" />

              {/* Grid column: Sản phẩm */}
              <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3">
                <h6 className="text-uppercase mb-4 font-weight-bold">Sản phẩm</h6>
                <p><a className="text-white no-underline" href="#!">MDBootstrap</a></p>
                <p><a className="text-white no-underline" href="#!">MDWordPress</a></p>
                <p><a className="text-white no-underline" href="#!">BrandFlow</a></p>
                <p><a className="text-white no-underline" href="#!">Bootstrap Angular</a></p>
              </div>
              
              <hr className="w-100 clearfix d-md-none" />
              
              {/* Grid column: Liên kết hữu ích */}
              <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mt-3">
                <h6 className="text-uppercase mb-4 font-weight-bold">Liên kết hữu ích</h6>
                <p><a className="text-white no-underline" href="#">Tài khoản của bạn</a></p>
                <p><a className="text-white no-underline" href="#">Trở thành đối tác</a></p>
                <p><a className="text-white no-underline" href="#">Bảng giá vận chuyển</a></p>
                <p><a className="text-white no-underline" href="#">Trợ giúp</a></p>
              </div>

              <hr className="w-100 clearfix d-md-none" />

              {/* Grid column: Liên hệ */}
              <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
                <h6 className="text-uppercase mb-4 font-weight-bold">Liên hệ</h6>
                <p><i className="fa fa-home mr-3"></i> Hà Nội, Việt Nam</p>
                <p><i className="fa fa-envelope mr-3"></i> info@gmail.com</p>
                <p><i className="fa fa-phone mr-3"></i> +84 123 456 789</p>
                <p><i className="fa fa-print mr-3"></i> +84 123 456 790</p>
              </div>
            </div>
            {/* Grid row */}
          </section>
          {/* Section: Links */}

          <hr className="my-3" />

          {/* Section: Copyright */}
          <section className="p-3 pt-0">
            <div className="row d-flex align-items-center">
              {/* Grid column: Bản quyền */}
              <div className="col-md-7 col-lg-8 text-center text-md-start">
                <div className="p-3">
                  <a className="text-white">© 2024 Công ty của bạn. Tất cả quyền được bảo lưu.</a>
                </div>
              </div>

              {/* Grid column: Biểu tượng mạng xã hội */}
              <div className="col-md-5 col-lg-4 ml-lg-0 text-center text-md-end">
                {/* Facebook */}
                <a className="btn btn-outline-light btn-floating m-1" role="button" href="#">
                  <i className="fa fa-facebook-f"></i>
                </a>

                {/* Twitter */}
                <a className="btn btn-outline-light btn-floating m-1" role="button" href="#">
                  <i className="fa fa-twitter"></i>
                </a>

                {/* Google */}
                <a className="btn btn-outline-light btn-floating m-1" role="button" href="#">
                  <i className="fa fa-google"></i>
                </a>

                {/* Instagram */}
                <a className="btn btn-outline-light btn-floating m-1" role="button" href="#">
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
