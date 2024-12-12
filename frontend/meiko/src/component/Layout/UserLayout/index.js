import { useEffect } from 'react';
import Header from './Header/index'
import Footer from './Footer/index'
const UserLayout = ({ children }) => {
  // useEffect(() => {
  //   const token = localStorage.getItem('jwtToken');
  //   const username = localStorage.getItem('username');
  //   const userId = localStorage.getItem('userId');
  //   const email = localStorage.getItem('Email');

  //   const script = document.createElement('script');
  //   script.async = true;
  //   script.src = 'https://embed.tawk.to/675ac000af5bfec1dbdae746/1iet7s17h'; 
  //   script.charset = 'UTF-8';
  //   script.setAttribute('crossorigin', '*');
  //   document.body.appendChild(script);

  //   script.onload = () => {
  //     if (token) {
  //       window.Tawk_API = window.Tawk_API || {};
  //       window.Tawk_API.setAttributes({
  //         name: username,
  //         email: email,
  //         hash: userId,
  //       });
  //     }
  //   };

  //   return () => {
  //     document.body.removeChild(script);
  //   };
  // }, []);
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default UserLayout;