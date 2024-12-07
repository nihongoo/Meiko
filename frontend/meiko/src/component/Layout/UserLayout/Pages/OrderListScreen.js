import styled from "styled-components";
import { Container } from "../styles/styles";
import Breadcrumb from "../Features/common/Breadcrumb";
import { UserContent, UserDashboardWrapper } from "../styles/user";
import UserMenu from "../Features/User/UserMenu";
import Title from "../Features/common/Title";
import { breakpoints, defaultTheme } from "../styles/themes/default";
import OrderItemList from "../Features/User/OrderItemList";
import { useState } from "react";
import Header from "../Header/index";

const OrderListScreenWrapper = styled.div`
  .order-tabs-contents {
    margin-top: 40px;
  }
  .order-tabs-head {
    min-width: 170px;
    padding: 12px 0;
    border-bottom: 3px solid ${defaultTheme.color_whitesmoke};

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
`;

const breadcrumbItems = [
  { label: "Trang chủ", link: "/" },
  { label: "Đơn hàng", link: "/order" },
];

// Dữ liệu giả của các đơn hàng
const fakeOrderData = [
  {
    id: 1,
    orderNumber: 'ORD12345',
    date: '2024-12-01',
    status: 'Active',
    items: [
      { id: 1, name: 'Sản phẩm 1', quantity: 2, price: 15.99, color: 'Đỏ' },
      { id: 2, name: 'Sản phẩm 2', quantity: 1, price: 25.99, color: 'Xanh' },
    ],
  },
  {
    id: 2,
    orderNumber: 'ORD12346',
    date: '2024-12-03',
    status: 'Cancelled',
    items: [{ id: 3, name: 'Sản phẩm 3', quantity: 1, price: 300000, color: 'Xanh lá' }],
  },
  {
    id: 3,
    orderNumber: 'ORD12347',
    date: '2024-12-05',
    status: 'Completed',
    items: [{ id: 4, name: 'Sản phẩm 4', quantity: 1, price: 400000, color: 'Vàng' }],
  },
  {
    id: 4,
    orderNumber: 'ORD12348',
    date: '2024-12-06',
    status: 'Active',
    items: [{ id: 5, name: 'Sản phẩm 5', quantity: 3, price: 600000, color: 'Tím' }],
  },
  {
    id: 5,
    orderNumber: 'ORD12349',
    date: '2024-12-07',
    status: 'Cancelled',
    items: [{ id: 6, name: 'Sản phẩm 6', quantity: 2, price: 700000, color: 'Hồng' }],
  },
];

const OrderListScreen = () => {
  const [activeTab, setActiveTab] = useState("active");

  const filteredOrders = (status) => {
    return fakeOrderData.filter(order => order.status.toLowerCase() === status.toLowerCase());
  };

  return (
    <div>
        <Header />
        <OrderListScreenWrapper className="page-py-spacing" style={{ paddingTop: "220px" }}>
      <Container>
        <Breadcrumb items={breadcrumbItems} />
        <UserDashboardWrapper>
          <UserMenu />
          <UserContent>
            <Title titleText={"Đơn hàng của tôi"} />
            <div className="order-tabs">
              <div className="order-tabs-heads">
                <button
                  type="button"
                  className={`order-tabs-head text-xl italic ${activeTab === "active" ? "order-tabs-head-active" : ""}`}
                  onClick={() => setActiveTab("active")}
                >
                  Đang hoạt động
                </button>
                <button
                  type="button"
                  className={`order-tabs-head text-xl italic ${activeTab === "cancelled" ? "order-tabs-head-active" : ""}`}
                  onClick={() => setActiveTab("cancelled")}
                >
                  Đã hủy
                </button>
                <button
                  type="button"
                  className={`order-tabs-head text-xl italic ${activeTab === "completed" ? "order-tabs-head-active" : ""}`}
                  onClick={() => setActiveTab("completed")}
                >
                  Đã hoàn thành
                </button>
              </div>

              <div className="order-tabs-contents">
                <div className="order-tabs-content" id="active" style={{ display: activeTab === "active" ? "block" : "none" }}>
                  <OrderItemList orders={filteredOrders("Active")} />
                </div>
                <div className="order-tabs-content" id="cancelled" style={{ display: activeTab === "cancelled" ? "block" : "none" }}>
                  <OrderItemList orders={filteredOrders("Cancelled")} />
                </div>
                <div className="order-tabs-content" id="completed" style={{ display: activeTab === "completed" ? "block" : "none" }}>
                  <OrderItemList orders={filteredOrders("Completed")} />
                </div>
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
