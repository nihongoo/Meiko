import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { FaBox, FaHeart, FaUser, FaSignOutAlt } from "react-icons/fa"; // Thêm icon từ React Icons
import Title from "../common/Title";
import { breakpoints, defaultTheme } from "../../styles/themes/default";

const NavMenuWrapper = styled.nav`
  margin-top: 32px;

  .nav-menu-list {
    display: grid;
    row-gap: 12px;

    @media (max-width: ${breakpoints.md}) {
      flex-wrap: wrap;
      gap: 8px;
    }
  }

  .nav-menu-item {
    border-radius: 6px;
    overflow: hidden;

    @media (max-width: ${breakpoints.sm}) {
      flex: 1 1 0;
    }
  }

  .nav-menu-link {
    display: flex;
    align-items: center;
    padding: 10px 20px;
    width: 100%;
    height: 48px;
    column-gap: 16px;
    text-decoration: none;
    border: 1px solid transparent;
    border-radius: 6px;
    background-color: ${defaultTheme.color_white};
    transition: all 0.3s ease;

    &:hover {
      background-color: ${defaultTheme.color_lightgray};
      transform: scale(1.02);
    }

    .nav-link-text {
      color: ${defaultTheme.color_gray};
      font-size: 16px;
    }

    &.active {
      border-left: 4px solid ${defaultTheme.color_primary};
      background-color: ${defaultTheme.color_primary_light};
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      .nav-link-text {
        color: ${defaultTheme.color_primary};
        font-weight: bold;
      }

      @media (max-width: ${breakpoints.md}) {
        border-left: 0;
        border-bottom: 4px solid ${defaultTheme.color_primary};
        background-color: transparent;
      }
    }

    @media (max-width: ${breakpoints.md}) {
      padding: 8px 16px;
    }

    @media (max-width: ${breakpoints.sm}) {
      padding: 6px 12px;
      column-gap: 12px;
    }
  }

  .nav-link-icon {
    font-size: 20px; /* Điều chỉnh kích thước icon */
    color: ${defaultTheme.color_gray}; /* Màu icon */
  }
`;

const UserMenu = () => {
  const location = useLocation();
  console.log(location.pathname);
  return (
    <div>
      <Title titleText={"Chào mừng"} />
      <p className="text-base font-light italic">
        Chào mừng đến với tài khoản của bạn.
      </p>

      <NavMenuWrapper>
        <ul className="nav-menu-list">
          <li className="nav-menu-item">
            <Link
              to="/orderlistscreen"
              className={`nav-menu-link ${
                location.pathname === "/orderlistscreen" ||
                location.pathname === "/orderdetailscreen"
                  ? "active"
                  : ""
              }`}
            >
              <span className="nav-link-icon">
                <FaBox />
              </span>
              <span className="nav-link-text">Đơn hàng</span>
            </Link>
          </li>
          <li className="nav-menu-item">
            <Link
              to="/wishlist"
              className={`nav-menu-link ${
                location.pathname === "/wishlist" ||
                location.pathname === "/empty_wishlist"
                  ? "active"
                  : ""
              }`}
            >
              <span className="nav-link-icon">
                <FaHeart />
              </span>
              <span className="nav-link-text">Yêu thích</span>
            </Link>
          </li>
          <li className="nav-menu-item">
            <Link
              to="/accountUser"
              className={`nav-menu-link ${
                location.pathname === "/accountUser" ||
                location.pathname === "/AddressScreen"
                  ? "active"
                  : ""
              }`}
            >
              <span className="nav-link-icon">
                <FaUser />
              </span>
              <span className="nav-link-text">Tài khoản</span>
            </Link>
          </li>
          <li className="nav-menu-item">
            <Link to="/" className="nav-menu-link">
              <span className="nav-link-icon">
                <FaSignOutAlt />
              </span>
              <span className="nav-link-text">Đăng xuất</span>
            </Link>
          </li>
        </ul>
      </NavMenuWrapper>
    </div>
  );
};

export default UserMenu;
