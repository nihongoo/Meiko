import styled from "styled-components";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa"; 
import { defaultTheme } from "../../styles/themes/default";

const BreadcrumbWrapper = styled.nav`

  margin-bottom: 24px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  height: 180px;
  padding-left: 200px;
  background: #f5f5f5 url("//dorno-demo.myshopify.com/cdn/shop/files/testi_bg_2_3c8502bd-60a4-403a-9378-a39ac074dd01.jpg?v=1652605155") no-repeat center center / cover;

  .breadcrumb-separator {
    margin: 0 8px;
    color: ${defaultTheme.color_gray};
    font-size: 14px;
    display: flex;
    align-items: center;
  }

  .breadcrumb-item {
    color: ${defaultTheme.color_gray};
    font-size: 16px;
    font-weight: 400;
    text-decoration: none;
    transition: color 0.3s;
    containers: flex;

    &:hover {
      color: ${defaultTheme.color_outerspace};
    }

    &.active {
      color: ${defaultTheme.color_outerspace};
      font-weight: 600;
      pointer-events: none; /* Không cho phép nhấn vào mục cuối cùng */
    }
  }
`;

const Breadcrumb = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <div>
      <BreadcrumbWrapper aria-label="breadcrumb">
      {items.map((item, index) => (
        <BreadcrumbItem
          key={index}
          item={item}
          isLast={index === items.length - 1}
        />
      ))}
    </BreadcrumbWrapper>
    </div>
  );
};

Breadcrumb.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      link: PropTypes.string,
    })
  ),
};

const BreadcrumbItem = ({ item, isLast }) => {
  return (
    <>
      {!isLast ? (
        <Link to={item.link} className="breadcrumb-item">
          {item.label}
        </Link>
      ) : (
        <span className="breadcrumb-item active">{item.label}</span>
      )}
      {!isLast && (
        <span className="breadcrumb-separator">
          <FaChevronRight />
        </span>
      )}
    </>
  );
};

BreadcrumbItem.propTypes = {
  item: PropTypes.shape({
    label: PropTypes.string.isRequired,
    link: PropTypes.string,
  }).isRequired,
  isLast: PropTypes.bool.isRequired,
};

export default Breadcrumb;
