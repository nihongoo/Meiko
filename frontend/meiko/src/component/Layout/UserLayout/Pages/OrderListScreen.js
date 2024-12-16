import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link để sử dụng chuyển hướng
import styled from "styled-components";
import { Container } from "../styles/styles";
import Breadcrumb from "../Features/common/Breadcrumb";
import { UserContent, UserDashboardWrapper } from "../styles/user";
import UserMenu from "../Features/User/UserMenu";
import Title from "../Features/common/Title";
import { breakpoints, defaultTheme } from "../styles/themes/default";
import OrderItemList from "../Features/User/OrderItemList";

const OrderListScreenWrapper = styled.div`
  .order-tabs-contents {
    margin-top: 40px;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    display: flex;
    gap: 20px;
  }

  .order-tabs-content {
    display: none; /* Hidden by default */
  }

  .order-tabs-head {
    min-width: 170px;
    padding: 12px 0;
    border-bottom: 3px solid ${defaultTheme.color_whitesmoke};
    cursor: pointer;

    &.order-tabs-head-active {
      border-bottom-color: ${defaultTheme.color_outerspace};
      color: ${defaultTheme.color_dark};
    }

    @media (max-width: ${breakpoints.lg}) {
      min-width: 120px;
    }

    @media (max-width: ${breakpoints.xs}) {
      min-width: 80px;
    }
  }

  .order-tabs-content.active {
    display: block; /* Show the active tab */
  }
`;

const breadcrumbItems = [
  { label: "Trang chủ", link: "/" },
  { label: "Đơn hàng", link: "/order" },
];

const statusLabels = {
  0: "Chờ xử lý",
  1: "Đang chuẩn bị hàng",
  2: "Đang giao hàng",
  3: "Hoàn thành",
  4: "Đã huỷ",
  5: "Hoàn trả",
};

const OrderListScreen = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllOrders, setShowAllOrders] = useState(false); // State để hiển thị tất cả đơn hàng

  const customerId = localStorage.getItem("customerId");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`https://localhost:7172/api/Bills/get-bills-by-customer-id/${customerId}`);
        if (!response.ok) {
          throw new Error("Không thể tải đơn hàng. Vui lòng thử lại sau.");
        }
  
        const data = await response.json();
        setOrders(data);
        setLoading(false);
      } catch (err) {
        setError("Có lỗi xảy ra khi tải đơn hàng.");
        setLoading(false);
      }
    };
  
    fetchOrders();
  }, [customerId]);

  const filteredOrders = (statusNumber) => {
    return orders.filter((order) => {
      if (!order.statusHistories || order.statusHistories.length === 0) {
        return false;
      }
      const latestStatusHistory = order.statusHistories
        .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))[0];
      const latestStatus = latestStatusHistory?.statusType?.trim();
      return latestStatus === statusLabels[statusNumber]; 
    });
  };

  // Hiển thị tất cả đơn hàng
  const showAllOrdersHandler = () => {
    setShowAllOrders(true); // Thay đổi trạng thái để hiển thị tất cả đơn hàng
  };

  return (
    <div>
      <OrderListScreenWrapper className="page-py-spacing" style={{ paddingTop: "140px" }}>
        <Container>
          <Breadcrumb items={breadcrumbItems} />
          <UserDashboardWrapper>
            <UserMenu />
            <UserContent>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Title titleText={"Đơn hàng của tôi"} />
                <button
                  onClick={showAllOrdersHandler}
                  style={{
                    fontSize: "16px",
                    color: defaultTheme.color_outerspace,
                    fontWeight: "bold",
                    border: "none",
                    background: "none",
                    cursor: "pointer"
                  }}
                >
                  Tất cả đơn hàng
                </button>
              </div>
              <div className="order-tabs">
                <div className="order-tabs-heads d-flex">
                  {Object.keys(statusLabels).map((statusNumber) => (
                    <button
                      key={statusNumber}
                      type="button"
                      className={`order-tabs-head text-lg font-italic ${activeTab === parseInt(statusNumber) ? "order-tabs-head-active" : ""}`}
                      onClick={() => {
                        setActiveTab(parseInt(statusNumber)); 
                        setShowAllOrders(false); // Khi chọn trạng thái đơn hàng, không hiển thị tất cả đơn hàng nữa
                      }}
                    >
                      {statusLabels[statusNumber]} 
                    </button>
                  ))}
                </div>
                <div className="order-tabs-contents">
                  {loading && <div>Đang tải đơn hàng...</div>}
                  {error && <div>{error}</div>}

                  {/* Nếu nhấn "Tất cả đơn hàng", hiển thị tất cả đơn hàng */}
                  <div
                    className={`order-tabs-content ${showAllOrders ? "active" : ""}`}
                  >
                    <OrderItemList orders={orders} />
                  </div>

                  {/* Hiển thị theo trạng thái đơn hàng */}
                  {Object.keys(statusLabels).map((statusNumber) => (
                    <div
                      key={statusNumber}
                      className={`order-tabs-content ${activeTab === parseInt(statusNumber) ? "active" : ""}`}
                    >
                      <OrderItemList orders={filteredOrders(parseInt(statusNumber))} />
                    </div>
                  ))}
                </div>
              </div>
            </UserContent>
          </UserDashboardWrapper>
        </Container>
      </OrderListScreenWrapper>
    </div>
  );
};

export default OrderListScreen;
