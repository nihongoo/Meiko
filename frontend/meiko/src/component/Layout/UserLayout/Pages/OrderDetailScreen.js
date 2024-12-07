import { Container } from "react-bootstrap";
import Header from "../Header/index";
import Footer from "../Footer/index";
import Breadcrumb from "../Features/common/Breadcrumb";
import { UserContent, UserDashboardWrapper } from "../styles/user";
import UserMenu from "../Features/User/UserMenu";
import { Link } from "react-router-dom";
import Title from "../Features/common/Title";
import { currencyFormat } from "../utils/helper";
import styles from './OrderDetailScreen.module.css';
import DeleteIcon from '@mui/icons-material/Delete';

const breadcrumbItems = [
  { label: "Trang chủ", link: "/" },
  { label: "Đơn hàng", link: "/order" },
  { label: "Chi tiết đơn hàng", link: "/order_detail" },
];

// Mảng trạng thái đơn hàng (dựa trên enum StatusType)
const orderStatusSteps = [
  { status: "Tạo hoá đơn", icon: "fa-check-circle", color: "completed", time: "02/06/2023 10:00 AM" },
  { status: "Chờ xử lý", icon: "fa-hourglass-half", color: "completed", time: "02/06/2023 10:30 AM" },
  { status: "Đang chuẩn bị hàng", icon: "fa-truck", color: "completed", time: "02/06/2023 11:00 AM" },
  { status: "Đang giao hàng", icon: "fa-truck", color: "current", time: "03/06/2023 12:00 AM" },
  { status: "Đã giao tới", icon: "fa-check-circle", color: "pending" },
  { status: "Hoàn thành", icon: "fa-check-circle", color: "pending" },
];

const orderData = [
  {
    orderNo: "#47770098867",
    placedOn: "02/06/2023 14:40",
    promoti: "HAPPYNEWYEAR",
    total: 143000,
    status: "Đang giao hàng", 
    items: [
      {
        id: 1,
        name: "Áo thun nam",
        color: "Đỏ",
        quantity: 2,
        price: 45000,
        size: "L",
        imgSource: "https://timan.vn/upload/products/122023/tui-xach-nu-sa21-sang-trong.jpg",
      },
      {
        id: 2,
        name: "Quần jeans",
        color: "Xanh",
        quantity: 1,
        price: 53000,
        size: "M",
        imgSource: "https://down-vn.img.susercontent.com/file/sg-11134201-22120-m84d7tm4folv7d",
      },
    ],
  },
];

const OrderDetailScreen = () => {
  const order = orderData[0];
  
  // Tìm vị trí trạng thái hiện tại trong mảng
  const currentStatusIndex = orderStatusSteps.findIndex((step) => step.status === order.status);

  // Lọc các trạng thái đã qua hoặc trạng thái hiện tại
  const visibleStatusSteps = orderStatusSteps.slice(0, currentStatusIndex + 1);

  return (
    <div>
        <Header/>
        <Container style={{ paddingTop: "220px" }}>
      <Breadcrumb items={breadcrumbItems} />
      <UserDashboardWrapper>
        <UserMenu />
        <UserContent>
          <div className="d-flex align-items-center justify-content-start mb-4">
            <Link to="/order" className="btn btn-link text-xl mr-3">
              <i className="bi bi-chevron-left"></i>
            </Link>
            <Title titleText={"Chi tiết đơn hàng"} />
          </div>

          <div className="order-d-wrapper">
            {/* Order Information */}
            <div className="order-d-top d-flex justify-content-between align-items-center p-4 bg-light rounded shadow-sm mb-4">
              <div className="order-d-top-l">
                <h4 className="text-2xl font-semibold text-dark">
                  Mã đơn hàng: {order.orderNo}
                </h4>
                <p className="text-md text-muted">Ngày đặt: {order.placedOn}</p>
                <p className="text-md text-muted">Mã giảm giá sử dụng: {order.promoti}</p>
              </div>
              <div className="order-d-top-r text-xl text-primary font-semibold">
                Tổng cộng: <span className="text-dark">{currencyFormat(order.total)}</span>
              </div>
            </div>

            {/* Timeline - Order Status */}
            <div className={styles.timelineWrapper}>
              {visibleStatusSteps.map((step, index) => {
                const stepClass = `${styles.timelineStep} ${styles[step.color]}`;
                const stepCircleClass = `${styles.stepCircle} ${styles[step.color + "Circle"]}`;
                return (
                  <div key={index} className={stepClass}>
                    <div className={stepCircleClass}>
                      <i className={`fa ${step.icon}`}></i>
                    </div>
                    <div className={styles.stepLine}></div> {/* Thanh ngang giữa icon và status */}
                    <p className={styles.stepText}>{step.status}</p>
                    <p className={styles.stepTime}>{step.time}</p>
                  </div>
                );
              })}
            </div>
            <p className="font-semibold text-muted mt-3">
              8 tháng 6, 2023 3:40 PM &nbsp;
              <span className="text-dark">Đơn hàng của bạn đã được xác nhận thành công.</span>
            </p>

            {/* Order Items */}
            {order.items?.map((item) => (
              <div className={styles.orderItemWrapper} key={item.id}>
                <div className={styles.orderItemImage}>
                  <img src={item.imgSource} alt={item.name} className="img-fluid rounded" />
                </div>
                <div className={styles.orderItemInfo}>
                  <p className="text-xl font-semibold text-dark">{item.name}</p>
                  <div className="color-size text-md text-muted">
                    <p>Màu sắc: <span className="font-medium">{item.color}</span></p>
                    <p>Size: <span className="font-medium">{item.size}</span></p>
                  </div>
                </div>
                <div className={styles.orderItemCalc}>
                  <p className="text-lg text-muted" style={{paddingRight:"100px"}}>Số lượng: <span className="text-muted">{item.quantity}</span></p>
                  <p className="text-lg text-muted">Giá: <span className="text-muted">{currencyFormat(item.price)}</span></p>
                </div>
                <DeleteIcon className={styles.deleteIcon} />
              </div>
            ))}
          </div>
        </UserContent>
      </UserDashboardWrapper>
    </Container>
    <Footer/>
    </div>
  );
};

export default OrderDetailScreen;
