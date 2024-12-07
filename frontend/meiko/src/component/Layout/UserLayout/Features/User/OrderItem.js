import styled from "styled-components";
import PropTypes from "prop-types";
import { currencyFormat } from "../../utils/helper";
import { BaseLinkGreen } from "../../styles/button";
import { breakpoints, defaultTheme } from "../../styles/themes/default";

const OrderItemWrapper = styled.div`
  margin: 30px 0;
  background-color: #ffffff;
  border-bottom: 1px solid ${defaultTheme.color_anti_flash_white};
  border-radius: 8px;

  .order-item-title {
    margin-bottom: 12px;
    font-size: 1.5rem;
    font-weight: bold;
    color: ${defaultTheme.color_dark};
  }

  .order-item-details {
    border: 1px solid rgba(0, 0, 0, 0.1);
    padding: 24px 32px;
    border-radius: 8px;
    background-color: ${defaultTheme.color_light_gray};

    @media (max-width: ${breakpoints.sm}) {
      padding: 20px 24px;
    }

    @media (max-width: ${breakpoints.xs}) {
      padding: 12px 16px;
    }
  }

  .order-info-group {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 20px;

    @media (max-width: ${breakpoints.sm}) {
      flex-direction: column;
    }
  }

  .order-info-item {
    width: 50%;
    margin-bottom: 12px;

    span {
      &:nth-child(2) {
        margin-left: 4px;
        font-weight: normal;
      }
    }

    &:nth-child(even) {
      text-align: right;

      @media (max-width: ${breakpoints.lg}) {
        text-align: left;
      }
    }

    @media (max-width: ${breakpoints.sm}) {
      width: 100%;
      margin: 8px 0;
    }
  }

  .order-overview {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin-left: 25px;
    margin-right: 25px;
    margin-bottom: 20px;

    @media (max-width: ${breakpoints.sm}) {
      flex-direction: column;
    }

    &-img {
      width: 120px;
      height: 120px;
      border-radius: 8px;
      overflow: hidden;
      background-color: ${defaultTheme.color_whitesmoke};

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    &-content {
      flex-grow: 1;
      display: grid;
      grid-template-columns: 120px auto;
      gap: 18px;
    }

    &-info {
      ul {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          margin-bottom: 8px;
          font-size: 1rem;
        }

        span {
          color: ${defaultTheme.color_silver};
        }
      }
    }
  }

  .order-overview-btn {
    align-self: center;  // Căn giữa nút
    margin-top: 20px;
    text-align: center;
    &:hover {
      background-color: ${defaultTheme.color_dark};
      color: ${defaultTheme.color_white};
    }
  }
`;

const OrderItem = ({ order }) => {
  return (
    <OrderItemWrapper>
      <div className="order-item-details">
        <h3 className="order-item-title">Số đơn hàng: {order.order_no}</h3>
        <div className="order-info-group">
          <div className="order-info-item">
            <span className="text-gray font-semibold">Ngày đặt hàng:</span>
            <span className="text-silver">{order.order_date}</span>
          </div>
          <div className="order-info-item">
            <span className="text-gray font-semibold">Trạng thái đơn hàng:</span>
            <span className="text-silver">{order.status}</span>
          </div>
          <div className="order-info-item">
            <span className="text-gray font-semibold">Ngày giao dự kiến:</span>
            <span className="text-silver">{order.delivery_date}</span>
          </div>
          <div className="order-info-item">
            <span className="text-gray font-semibold">Phương thức thanh toán:</span>
            <span className="text-silver">{order.payment_method}</span>
          </div>
        </div>
      </div>

      <div className="order-overview">
        <div className="order-overview-content">
          <div className="order-overview-img" style={{marginTop: "30px"}}>
            <img
              src={order.items[0]?.imageUrl || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXr49HDVtzGLB2P5GqGhUpneMiZa08kAmZEw&s"}
              alt={order.items[0]?.name || "Hình ảnh sản phẩm"}
            />
          </div>

          <div className="order-overview-info">
            <h4 className="text-xl">{order.items[0]?.name || "Sản phẩm"}</h4>
            <ul>
              <li className="font-semibold text-base">
                <span>Màu sắc:</span>
                <span>{order.items[0]?.color || "Chưa có"}</span>
              </li>
              <li className="font-semibold text-base">
                <span>Số lượng:</span>
                <span>{order.items[0]?.quantity || 0}</span>
              </li>
              <li className="font-semibold text-base">
                <span>Tổng tiền:</span>
                <span>{currencyFormat(order.items[0]?.price || 0, 'VND')}</span>
              </li>
            </ul>
          </div>
          <span style={{color: "#A9A9A9"}}>+2 sản phẩm</span>
        </div>
        <BaseLinkGreen to={`/order_detail/${order.order_no}`} className="order-overview-btn">
          Xem Chi Tiết
        </BaseLinkGreen>
      </div>
    </OrderItemWrapper>
  );
};

OrderItem.propTypes = {
  order: PropTypes.object.isRequired,
};

export default OrderItem;
