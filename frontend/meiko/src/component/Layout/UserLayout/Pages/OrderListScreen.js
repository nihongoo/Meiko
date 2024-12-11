import styled from "styled-components";
import { Container } from "../styles/styles";
import Breadcrumb from "../Features/common/Breadcrumb";
import { UserContent, UserDashboardWrapper } from "../styles/user";
import UserMenu from "../Features/User/UserMenu";
import Title from "../Features/common/Title";
import { breakpoints, defaultTheme } from "../styles/themes/default";
import OrderItemList from "../Features/User/OrderItemList";
import { useState, useEffect } from "react";

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

// Định nghĩa trạng thái tiếng Việt và mã trạng thái
const statusLabels = {
  pending: "Chờ xử lý",
  preparing: "Đang chuẩn bị hàng",
  shipping: "Đang giao hàng",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
  returned: "Hoàn trả",
};

const OrderListScreen = () => {
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabFromUrl = urlParams.get("tab") || "pending";
    setActiveTab(tabFromUrl);
  }, []);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const customerId = localStorage.getItem("customerId");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`https://localhost:7172/api/Bills/get-bills-by-customer-id/${customerId}`);
        if (!response.ok) {
          throw new Error("Không thể tải đơn hàng. Vui lòng thử lại sau.");
        }

        const data = await response.json();
        console.log("Dữ liệu API trả về:", data);
        setOrders(data);
        setLoading(false);
      } catch (err) {
        setError("Có lỗi xảy ra khi tải đơn hàng.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, [customerId]);

  const filteredOrders = (status) => {
    const vietnameseStatusMap = {
      pending: "Chờ xử lý",
      preparing: "Đang chuẩn bị hàng",
      shipping: "Đang giao hàng",
      completed: "Hoàn thành",
      cancelled: "Đã hủy",
      returned: "Hoàn trả",
    };
    const statusInVietnamese = vietnameseStatusMap[status.toLowerCase()];
    return orders.filter((order) => {
      const latestStatusHistory = order.statusHistories
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
      const latestStatus = latestStatusHistory?.statusType;
      return latestStatus === statusInVietnamese; 
    });
  };

  return (
    <div>
      <OrderListScreenWrapper className="page-py-spacing" style={{ paddingTop: "140px" }}>
        <Container>
          <Breadcrumb items={breadcrumbItems} />
          <UserDashboardWrapper>
            <UserMenu />
            <UserContent>
              <Title titleText={"Đơn hàng của tôi"} />
              <div className="order-tabs">
                <div className="order-tabs-heads d-flex">
                  {Object.keys(statusLabels).map((status) => (
                    <button
                      key={status}
                      type="button"
                      className={`order-tabs-head text-lg font-italic ${activeTab === status ? "order-tabs-head-active" : ""}`}
                      onClick={() => setActiveTab(status)}
                    >
                      {statusLabels[status]}
                    </button>
                  ))}
                </div>
                <div className="order-tabs-contents">
                  {loading && <div>Đang tải đơn hàng...</div>}
                  {error && <div>{error}</div>}

                  {Object.keys(statusLabels).map((status) => (
                    <div
                      key={status}
                      className={`order-tabs-content ${activeTab === status ? "active" : ""}`}
                    >
                      <OrderItemList orders={filteredOrders(status)} />
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
