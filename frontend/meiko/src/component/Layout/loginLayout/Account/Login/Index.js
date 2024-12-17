import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 
import Header from '../../../UserLayout/Header/index.js';
import styles from './index.module.css';
import Footer from '../../../UserLayout/Footer/index.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const loginData = { username, password };
  
    try {
      const response = await fetch("https://localhost:7172/api/Account/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });
  
      if (!response.ok) {
        throw new Error("Đăng nhập thất bại! Vui lòng kiểm tra thông tin tài khoản.");
      }
  
      const data = await response.json();
  
      localStorage.setItem("jwtToken", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("Email", data.email);
      localStorage.setItem("userRole", data.role);
      localStorage.setItem("userId", data.id);
  
      if (data.role === "admin") {
        navigate("/admin-dashboard");
        toast.success('Chào mừng Admin!');  // Success toast in Vietnamese
      } else if (data.role === "Customer") {
        const token = data.token;
        const accountId = data.id;

        const customerResponse = await fetch(`https://localhost:7172/api/Customer/${accountId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
  
        if (!customerResponse.ok) {
          throw new Error("Không thể lấy thông tin khách hàng.");
        }
  
        const customerData = await customerResponse.json();
        const customerId = customerData.customerId;
  
        // Save customerId to localStorage
        localStorage.setItem("customerId", customerId);
        console.log(customerId);
        // After fetching customerId, navigate to homeUser
        navigate("/homeUser");
        toast.success('Chào mừng Khách hàng!');  // Success toast in Vietnamese
      } else {
        navigate("/");
        toast.success('Chào mừng bạn!');  // Success toast in Vietnamese
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Đã có lỗi xảy ra.");
      toast.error('Đăng nhập thất bại: ' + (err.message || "Đã có lỗi xảy ra"));  // Error toast in Vietnamese
    }
  };
  

  const handleLoginClick = () => {
    navigate('/SignIn');
  };

  const handleSignupClick = () => {
    navigate('/SignUp');
  };

  const handleForgotPasswordClick = () => {
    navigate('/forgot-password');
  };

  const queryParams = new URLSearchParams(location.search);
  const message = queryParams.get('message');

  return (
    <div style={{ backgroundColor: "#f0f0f0" }}>
      <Header />
      <div style={{ height: "200px" }}></div>
      <form className={styles.login} onSubmit={handleSubmit}>
        <div className={styles.column}>
          <div className={styles.header}>
            <div className={styles.logo}>MEIKO</div>
          </div>
          <div className={styles.form}>
            <h1>Chào Mừng</h1>
            {message && <div className="alert alert-success" role="alert">{message}</div>}
            <div className={styles.formPage}>
              <div className={styles.segmented}>
                <button onClick={handleLoginClick} className={styles.segmentedBtn} aria-selected="true">
                  Đăng nhập
                </button>
                <button onClick={handleSignupClick} className={styles.segmentedBtn} aria-selected="false">
                  Đăng ký
                </button>
                <div className={styles.segmentedFocus}></div>
              </div>
              <div className={styles.field}>
                <input
                  type="text"
                  placeholder="Tên đăng nhập"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <label className={styles.Label}></label>
              </div>
              <div className={styles.field}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label className={styles.Label}></label>
                {password.length > 0 && (
                  <i
                    className={`fa ${showPassword ? "fa-eye" : "fa-eye-slash"} ${styles.eyeIcon}`}
                    onClick={togglePasswordVisibility}
                  ></i>
                )}
              </div>
              <div className={styles.forgotPassword}>
                <a href="#" onClick={handleForgotPasswordClick}>Quên mật khẩu?</a>
              </div>
              <button className={styles.btn} type="submit">
                Tiếp theo
              </button>
              <div className={styles.or}>Or Continue With</div>
              <div className={styles.social}>
                <button className={styles.socialBtn}>
                  <i className="fa fa-facebook-f"></i>
                </button>
                <button className={styles.socialBtn}>
                  <i className="fa fa-google"></i>
                </button>
                <button className={styles.socialBtn}>
                  <i className="fa fa-apple"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles.column} ${styles.columnBg}`}>
          <img className={styles.bgImg} src="https://images.squarespace-cdn.com/content/v1/53883795e4b016c956b8d243/1554883536136-KN4S62N1ZQ6UJNABFXB5/image-asset.jpeg" />
        </div>
      </form>
      <Footer />
      {/* Add Toast container */}
      <ToastContainer />
    </div>
  );
}

export default LoginForm;
