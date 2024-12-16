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

  .order-overview-info{
    margin-top: 30px;
  }

  .order-overview-btn {
    align-self: center; 
    text-align: center;
    &:hover {
      background-color: ${defaultTheme.color_dark};
      color: ${defaultTheme.color_white};
    }
  }
`;

const OrderItem = ({ order }) => {
  console.log(order);
  return (
    <OrderItemWrapper>
      <div className="order-item-details">
        <BaseLinkGreen to={`/orderdetailscreen/${order.id}`} style={{backgroundColor:"#ffffff", borderColor:"#ffffff"}}>
          <h3 className="order-item-title">Số đơn hàng: {order.billCode}</h3>
        </BaseLinkGreen>
        <div className="order-info-group" style={{marginLeft:"14px"}}>
          <div className="order-info-item">
            <span className="text-gray font-semibold">Ngày đặt hàng:</span>
            <span className="text-silver">
              {new Date(order.createdDate).toLocaleString("vi-VN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
              })}
            </span>
          </div>
          <div className="order-info-item">
            <span className="text-gray font-semibold">Trạng thái đơn hàng:</span>
            <span className="text-silver">
              {order.statusHistories && order.statusHistories.length > 0 
                ? order.statusHistories
                    .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate)) 
                    .map(status => status.statusType)
                    [0] 
                : 'Chưa có trạng thái'}
            </span>
          </div>

          <div className="order-info-item">
            <span className="text-gray font-semibold">Ngày giao dự kiến:</span>
            <span className="text-silver">{order.deliveryDate || "Chưa có"}</span>
          </div>
          <div className="order-info-item">
            <span className="text-gray font-semibold">Phương thức thanh toán:</span>
            <span className="text-silver">
              {order.paymentHistories.length > 0 ? order.paymentHistories[0].paymentMethod : 'Thanh toán khi nhận hàng'}
            </span>
          </div>
        </div>
      </div>

    </OrderItemWrapper>
  );
};

OrderItem.propTypes = {
  order: PropTypes.object.isRequired,
};

export default OrderItem;
