import React, { useState, useEffect } from "react";
import 'font-awesome/css/font-awesome.min.css';
import styles from '../main_styles.module.css';

function Header () {
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  // Hàm lấy số lượng sản phẩm trong giỏ hàng từ API
  const fetchCartItemCount = async () => {
    const token = localStorage.getItem("jwtToken");
    const customerId = localStorage.getItem("customerId");
  
    if (!token || !customerId) {
      setCartItemCount(0); 
      return;
    }
  
    try {
      // Lấy cartId từ API Carts dựa trên customerId
      const cartResponse = await fetch(`https://localhost:7172/api/Carts/${customerId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!cartResponse.ok) {
        throw new Error("Không thể lấy giỏ hàng");
      }
  
      const cartData = await cartResponse.json();
      const cartId = cartData?.id;
  
      if (!cartId) {
        setCartItemCount(0);
        return;
      }
  
      // Gọi API lấy danh sách CartDetails dựa vào cartId
      const cartDetailsResponse = await fetch(`https://localhost:7172/api/CartDetails/get-all-cartdetail-by/${cartId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!cartDetailsResponse.ok) {
        throw new Error("Không thể lấy chi tiết giỏ hàng");
      }
  
      const cartDetails = await cartDetailsResponse.json();
  
      // Đếm số lượng sản phẩm trong giỏ hàng
      const cartDetailCount = Array.isArray(cartDetails) ? cartDetails.length : 0;
  
      setCartItemCount(cartDetailCount);
    } catch (error) {
      console.error("Error fetching cart or cart details:", error);
      setCartItemCount(0);
    }
  };
  

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
      setIsLoggedIn(true);
    }
    fetchCartItemCount();

    window.addEventListener('cartUpdated', fetchCartItemCount);

    return () => {
      window.removeEventListener('cartUpdated', fetchCartItemCount);
    };
  }, []);

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("userRole");
    localStorage.removeItem("customerId");
    localStorage.removeItem("jwtToken");
    setIsLoggedIn(false);
    setUsername("");
    setCartItemCount(0);
    fetchCartItemCount();
  };

  const truncatedUsername = username.length > 7 ? username.slice(0, 7) : username;

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
                      {isLoggedIn ? (
                        <>
                          <i className="fa fa-user" aria-hidden="true"></i> {truncatedUsername}
                          <i className="fa fa-angle-down"></i>
                        </>
                      ) : (
                        "Tài khoản"
                      )}
                    </a>
                    <ul className={styles.accountSelection}>
                      {isLoggedIn ? (
                        <>
                          <li><a href="/accountUser"><i className="fa fa-user" aria-hidden="true"></i> Thông tin</a></li>
                          <li><a href="/homeUser" onClick={handleLogout}><i className="fa fa-sign-out" aria-hidden="true"></i> Đăng xuất</a></li>
                        </>
                      ) : (
                        <>
                          <li><a href="/SignIn"><i className="fa fa-sign-in" aria-hidden="true"></i> Đăng nhập</a></li>
                          <li><a href="#"><i className="fa fa-user-plus" aria-hidden="true"></i> Đăng ký</a></li>
                        </>
                      )}
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
                  <li className="nav-item"><a href="#" className="nav-link">Liên hệ</a></li>
                </ul>
                <ul className={`${styles.navbarUser} d-flex`}>
                  <li><a href="#" className="nav-link"><i className="fa fa-search" aria-hidden="true"></i></a></li>
                  <li><a href="#" className="nav-link"><i className="fa fa-user" aria-hidden="true"></i></a></li>
                  <li className={styles.checkout}>
                    <a href="/ShopCart" className="nav-link">
                      <i className="fa fa-shopping-cart" aria-hidden="true"></i>
                      <span id="checkout_items" className={styles.checkoutItems}>{cartItemCount}</span>
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
