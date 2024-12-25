import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Header from '../../../UserLayout/Header/index.js';
import styles from './ForgotPassword.module.css';
import Footer from '../../../UserLayout/Footer/index.js';

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');  
  const [oldPassword, setOldPassword] = useState(''); 
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigate = useNavigate();

  // Xử lý khi gửi email và yêu cầu gửi OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
  
    // Kiểm tra email hợp lệ
    if (!email) {
      setError('Vui lòng nhập email của bạn.');
      return;
    }

    const emailData = { email };
  
    try {
      const response = await fetch('https://localhost:7172/api/Account/forgot-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Có lỗi xảy ra, vui lòng thử lại.');
      }

      const successMessage = await response.text();
      setIsOtpSent(true);  // Đánh dấu OTP đã được gửi
      setMessage(successMessage || 'Mã OTP đã được gửi vào email của bạn.');
    } catch (err) {
      console.error('Lỗi gửi OTP:', err);
      setError(err.message || 'Có lỗi xảy ra, vui lòng thử lại.');
    }
  };

  // Kiểm tra nếu mật khẩu mới trùng với mật khẩu cũ
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!otp) {
      setError('Vui lòng nhập mã OTP.');
      return;
    }

    if (!newPassword) {
      setError('Vui lòng nhập mật khẩu mới.');
      return;
    }

    if (newPassword === oldPassword) {
      setError('Mật khẩu mới không được giống mật khẩu cũ.');
      return;
    }

    const otpData = { otp, email, newPassword };

    try {
      const response = await fetch('https://localhost:7172/api/Account/verify-otp/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(otpData),
      });

      if (!response.ok) {
        const data = await response.text();
        throw new Error(data || 'Có lỗi xảy ra, vui lòng thử lại.');
      }

      const data = await response.text();
      setMessage(data || 'Mật khẩu đã được thay đổi thành công!');
      navigate('/SignIn?message=Mật khẩu đã được thay đổi thành công!'); 
    } catch (err) {
      console.error('Lỗi xác minh OTP:', err);
      setError(err.message || 'Có lỗi xảy ra, vui lòng thử lại.');
    }
  };

  return (
    <div style={{ backgroundColor: "#f0f0f0" }}>
      <Header />
      <div style={{ height: "200px" }}></div>
      <form className={styles.login}>
        <div className={styles.column}>
          <div className={styles.header}>
            <div className={styles.logo}>MEIKO</div>
          </div>
          <div className={styles.form}>
            <h1>Quên mật khẩu</h1>
            {message && <div className="alert alert-success" role="alert">{message}</div>}
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            <div className={styles.formPage}>
              <div className={styles.field}>
                <input
                  type="text"
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label className={styles.Label}></label>
              </div>

              {/* Trường nhập OTP */}
              <div className={styles.field}>
                <input
                  type="text"
                  placeholder="Nhập mã OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={!isOtpSent} // Disable nếu OTP chưa được gửi
                />
                <label className={styles.Label}></label>
                <button
                  type="button"
                  className={styles.otpBtn}
                  onClick={handleSubmit} // Gửi mã OTP
                  disabled={isOtpSent} // Disable nếu OTP đã được gửi
                >
                  Gửi mã
                </button>
              </div>

              {/* Trường nhập mật khẩu mới và xác minh OTP */}
              {isOtpSent && (
                <>
                  <div className={styles.field}>
                    <input
                      type="password"
                      placeholder="Nhập mật khẩu mới"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <label className={styles.Label}></label>
                  </div>
                  <button
                    type="submit"
                    className={styles.btn}
                    onClick={handleVerifyOtp}  // Kiểm tra OTP và mật khẩu mới
                  >
                    Tiếp theo
                  </button>
                </>
              )}

              <div className={styles.forgotPassword}>
                <a href="#" onClick={() => navigate('/SignIn')}>Quay lại trang đăng nhập</a>
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles.column} ${styles.columnBg}`}>
          <img className={styles.bgImg} src="https://images.squarespace-cdn.com/content/v1/53883795e4b016c956b8d243/1554883536136-KN4S62N1ZQ6UJNABFXB5/image-asset.jpeg" />
        </div>
      </form>
      <Footer />
    </div>
  );
}

export default ForgotPassword;
