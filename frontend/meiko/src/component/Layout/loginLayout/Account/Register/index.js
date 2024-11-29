import React, { useState } from 'react';
import Header from '../../../UserLayout/Header/index.js';
import styles from './index.module.css';
import Footer from '../../../UserLayout/Footer/index.js';
import { useNavigate } from 'react-router-dom';

function RegisterForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [sex, setSex] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNonAlphanumeric = /[^a-zA-Z0-9]/.test(password);
  
    if (!hasUpperCase) {
      return 'Mật khẩu phải có ít nhất một chữ cái viết hoa.';
    }
  
    if (!hasNonAlphanumeric) {
      return 'Mật khẩu phải có ít nhất một ký tự không phải chữ cái hoặc số.';
    }
  
    return '';
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate form
    if (!username || !password || !email || !name || !phoneNumber || sex === null) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Mật khẩu và xác nhận mật khẩu không khớp.");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError); 
      return;
    }

    const registerData = {
      username,
      password,
      email,
      name,
      sex,  // sex will be true (Nam) or false (Nữ)
      phoneNumber,
    };

    try {
      const response = await fetch('https://localhost:7172/api/Account/register-customer/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });
    
      if (!response.ok) {
        const errorText = await response.json();
        const errorMessage = errorText.length > 0 ? errorText[0].description : 'Đăng ký thất bại!';
    
        throw new Error(errorMessage);
      }
    
      const data = await response.text();
      console.log('Đăng ký thành công:', data);
    
      navigate('/SignIn?message=Đăng ký thành công!');
    } catch (err) {
      console.error('Lỗi đăng ký:', err);
    
      setError(err.message || 'Đã xảy ra lỗi');
    }
  };

  const handleLoginClick = () => {
    navigate('/SignIn');
  };

  const handleSignupClick = () => {
    navigate('/SignUp');
  };

  return (
    <div style={{ backgroundColor: '#f0f0f0' }}>
      <Header />
      <div style={{ height: '200px' }}></div>
      <form className={styles.login} onSubmit={handleSubmit}>
        <div className={styles.column}>
          <div className={styles.header}>
            <div className={styles.logo}>MEIKO</div>
          </div>
          <div className={`${styles.form}`}>
            <h1>Đăng Ký</h1>
            <div className={`${styles.formPage}`}>
              <div className={styles.segmented}>
                <button
                  onClick={handleLoginClick}
                  className={styles.segmentedBtn}
                  aria-selected="false"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={handleSignupClick}
                  className={styles.segmentedBtn}
                  aria-selected="true"
                >
                  Đăng ký
                </button>
                <div className={styles.segmentedFocus}></div>
              </div>

              {/* Các trường trong form đăng ký */}
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
                  type="text"
                  placeholder="Tên đầy đủ"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <label className={styles.Label}></label>
              </div>

              <div className={`${styles.field}`}>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label className={styles.Label}></label>
              </div>

              <div className={`${styles.field}`}>
                <input
                  type="text"
                  placeholder="Số điện thoại"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <label className={styles.Label}></label>
              </div>

              <div className={styles.field}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label className={styles.Label}></label>
                {password.length > 0 && (
                  <i
                    className={`fa ${showPassword ? 'fa-eye' : 'fa-eye-slash'} ${styles.eyeIcon}`}
                    onClick={togglePasswordVisibility}
                  ></i>
                )}
              </div>

              <div className={styles.field}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Nhập lại mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <label className={styles.Label}></label>
                {confirmPassword.length > 0 && (
                  <i
                    className={`fa ${showPassword ? 'fa-eye' : 'fa-eye-slash'} ${styles.eyeIcon}`}
                    onClick={togglePasswordVisibility}
                  ></i>
                )}
              </div>

              <div className={styles.field}>
                <select
                  value={sex === null ? "" : sex === true ? "Nam" : "Nữ"}
                  onChange={(e) => setSex(e.target.value === "Nam")}
                  className={styles.genderSelect}
                >
                  <option value="" disabled>
                    -- Chọn giới tính --
                  </option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>

              <button className={styles.btn} type="submit">
                Đăng ký
              </button>
              {error && <p className={`text-danger`}>{error}</p>}

              <div className={styles.or}>Hoặc đăng ký với</div>
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
          <img
            className={styles.bgImg}
            src="https://images.squarespace-cdn.com/content/v1/53883795e4b016c956b8d243/1554883536136-KN4S62N1ZQ6UJNABFXB5/image-asset.jpeg"
            alt="background"
          />
        </div>
      </form>
      <Footer />
    </div>
  );
}

export default RegisterForm;
