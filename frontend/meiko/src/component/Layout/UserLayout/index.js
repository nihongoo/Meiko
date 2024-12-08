import Header from './Header/index'
import Footer from './Footer/index'
const UserLayout = ({ children }) => {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default UserLayout;