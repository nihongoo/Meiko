import '../../../../Asset/boostrap/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css'
import styles from '../main_styles.module.css';  // CSS module
// import responsiveStyles from '../responsive.module.css';  
import { Link } from 'react-router-dom';
const Header = () => {
  return (
    <header className={`${styles.header} ${styles.trans300}`}>
      {/* Top Navigation */}
      <div className={`${styles.topNav}`}>
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className={styles.topNavLeft}>
                Mua sắm ngay hôm nay để nhận nhiều quà tặng hấp dẫn!
              </div>
            </div>
            <div className="col-md-6 text-end">
              <div className={styles.topNavRight}>
                <ul className={styles.topNavMenu}>
                  {/* Currency */}
                  <li className={styles.currency}>
                    <a href="#">
                      vnđ
                      <i className="fa fa-angle-down"></i>
                    </a>
                    <ul className={styles.currencySelection}>
                      <li><a href="#">cad</a></li>
                      <li><a href="#">aud</a></li>
                      <li><a href="#">eur</a></li>
                      <li><a href="#">usd</a></li>
                    </ul>
                  </li>
                  {/* Language */}
                  <li className={styles.language}>
                    <a href="#">
                      Việt Nam
                      <i className="fa fa-angle-down"></i>
                    </a>
                    <ul className={styles.languageSelection}>
                      <li><a href="#">French</a></li>
                      <li><a href="#">Italian</a></li>
                      <li><a href="#">German</a></li>
                      <li><a href="#">English</a></li>
                    </ul>
                  </li>
                  {/* Account */}
                  <li className={styles.account}>
                    <a href="#">
                      Tài khoản
                      <i className="fa fa-angle-down"></i>
                    </a>
                    <ul className={styles.accountSelection}>
                      <li><a href="#"><i className="fa fa-sign-in" aria-hidden="true"></i> Đăng nhập</a></li>
                      <li><a href="#"><i className="fa fa-user-plus" aria-hidden="true"></i> Đăng ký</a></li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className={styles.mainNavContainer}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-end">
              <div className={styles.logoContainer}>
                <a href="#">
                  meiko<span>shop</span>
                </a>
              </div>
              <nav className="navbar navbar-expand-lg navbar-dark">
                <ul className={`${styles.navbarMenu} d-flex`}>
                  <li className="nav-item"><a href="/homeUser" className="nav-link">Trang chủ</a></li>
                  <li className="nav-item"><a href="/shop" className="nav-link">Cửa hàng</a></li>
                  <li className="nav-item"><a href="#" className="nav-link">Khuyến mãi</a></li>
                  <li className="nav-item"><a href="contact.html" className="nav-link">Liên hệ</a></li>
                </ul>
                <ul className={`${styles.navbarUser} d-flex`}>
                  <li><a href="#" className="nav-link"><i className="fa fa-search" aria-hidden="true"></i></a></li>
                  <li><a href="#" className="nav-link"><i className="fa fa-user" aria-hidden="true"></i></a></li>
                  <li className={styles.checkout}>
                    <a href="#" className="nav-link">
                      <i className="fa fa-shopping-cart" aria-hidden="true"></i>
                      <span id="checkout_items" className={styles.checkoutItems}>2</span>
                    </a>
                  </li>
                </ul>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon"></span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
