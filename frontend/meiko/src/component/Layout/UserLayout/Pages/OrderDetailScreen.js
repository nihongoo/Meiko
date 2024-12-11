import { Container } from "react-bootstrap";
import Breadcrumb from "../Features/common/Breadcrumb";
import { UserContent, UserDashboardWrapper } from "../styles/user";
import UserMenu from "../Features/User/UserMenu";
import { Link, useParams } from "react-router-dom";
import Title from "../Features/common/Title";
import { currencyFormat } from "../utils/helper";
import styles from './OrderDetailScreen.module.css';
import { useEffect, useState } from "react";


const breadcrumbItems = [
  { label: "Trang chủ", link: "/" },
  { label: "Đơn hàng", link: "/order" },
  { label: "Chi tiết đơn hàng", link: "/order_detail" },
];

const OrderDetailScreen = () => {
  const { billId } = useParams();
  const [order, setOrder] = useState(null);
  const [productDetails, setProductDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [voucherInfo, setVoucherInfo] = useState(null);
  const [statusHistory, setStatusHistory] = useState([]);

  const [isAddressVisible, setAddressVisible] = useState(false);

  const toggleAddressVisibility = () => {
    setAddressVisible(prevState => !prevState);
  };

  const statusMapping = {
    "Chờ xử lý": {
      color: "text-warning", 
      icon: "fa-hourglass-half", 
    },
    "Đang chuẩn bị hàng": {
      color: "text-primary",
      icon: "fa-cogs", 
    },
    "Đang giao hàng": {
      color: "text-info", 
      icon: "fa-truck", 
    },
    "Hoàn thành": {
      color: "text-success",
      icon: "fa-check-circle",
    },
    "Đã hủy": {
      color: "text-danger",
      icon: "fa-times-circle",
    },
    "Hoàn trả": {
      color: "text-secondary",
      icon: "fa-undo-alt",
    },
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        // Fetch order
        const billResponse = await fetch(`https://localhost:7172/api/Bills/get-bill-by-id/${billId}`);
        const billData = await billResponse.json();
        if (!billData) {
          setError("Không tìm thấy thông tin đơn hàng.");
          setLoading(false);
          return;
        }
        setOrder(billData);

        const productDetailsPromises = billData.billDetails.map(async (detail) => {
          const productDetailResponse = await fetch(`https://localhost:7172/api/ProductDetail/Get/${detail.productDetailId}`);
          const productDetailData = await productDetailResponse.json();
          if (productDetailData) {
            const productId = productDetailData.productId;
            const productResponse = await fetch(`https://localhost:7172/api/Product/Get/${productId}`);
            const productData = await productResponse.json();

            if (productDetailData.sale_products?.length > 0) {
              const voucherId = productDetailData.sale_products[0].voucherId;
              if (voucherId) {
                const voucherResponse = await fetch(`https://localhost:7172/api/Voucher/Get/${voucherId}`);
                const voucherData = await voucherResponse.json();
                setVoucherInfo(voucherData);
              }
            }

            return {
              ...productDetailData,
              productName: productData.name,
            };
          }
        });

        const productDetailsData = await Promise.all(productDetailsPromises);
        setProductDetails(productDetailsData.filter(Boolean));

        const statusResponse = await fetch(`https://localhost:7172/api/Bills/get-statusHistories-by-billId/${billId}`);
        const statusData = await statusResponse.json();
        setStatusHistory(statusData);
        console.log(statusHistory);
        setLoading(false);
      } catch (err) {
        setError("Có lỗi xảy ra khi tải thông tin đơn hàng.");
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [billId]);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
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
              {/* Thông tin đơn hàng */}
              <div className="order-d-top d-flex justify-content-between align-items-center p-4 bg-light rounded shadow-sm mb-4">
                <div className="order-d-top-l">
                  <h4 className="text-2xl font-semibold text-dark">
                    Mã đơn hàng: {order.billCode}
                  </h4>
                  <p className="text-md text-muted" style={{paddingTop: "8px"}}>Ngày tạo: {new Date(order.createdDate).toLocaleString()}</p>
                  {voucherInfo ? (
                    <p className="text-md text-muted">Mã giảm giá: {voucherInfo.voucherCode} - {voucherInfo.value}%</p>
                  ) : (
                    <p className="text-md text-muted">Không có mã giảm giá</p>
                  )}
                </div>
                <div className="order-d-top-r text-xl text-primary font-semibold">
                  Tổng cộng: <span className="text-dark">{currencyFormat(order.total)}</span>
                </div>
              </div>

              {/* Địa chỉ giao hàng */}
              <div className={styles.orderAddressWrapper}>
                <div className="d-flex justify-content-between align-items-center">
                  <h5>Địa chỉ giao hàng</h5>
                  <button
                    onClick={toggleAddressVisibility}
                    className="btn btn-link text-primary"
                  >
                    {isAddressVisible ? "Ẩn địa chỉ" : "Hiển thị địa chỉ"}
                  </button>
                </div>
                {isAddressVisible && (
                  <div>
                    <p><span className={styles.addressPart}>Người nhận:</span> {order.shippingAddresses[0]?.recipientName}</p>
                    <p><span className={styles.addressPart}>Địa chỉ:</span> {order.shippingAddresses[0]?.addressDetail}, {order.shippingAddresses[0]?.ward}, {order.shippingAddresses[0]?.district}, {order.shippingAddresses[0]?.city}</p>
                    <p><span className={styles.addressPart}>Số điện thoại:</span> {order.shippingAddresses[0]?.phoneNumber}</p>
                  </div>
                )}
              </div>

              {/* Timeline */}
              <div className={styles.timelineWrapper}>
                {statusHistory.map((status, index) => {

                  const { color, icon } = statusMapping[status.statusType] || {}; 
                  console.log(`Status: ${status.statusType}, Color: ${color}, Icon: ${icon}`); 
                
                  const stepClass = `${styles.timelineStep} ${styles[color] || ""}`;
                  const stepCircleClass = `${styles.stepCircle} ${styles[color + "Circle"] || ""}`;
                  const stepLineClass = `${styles.stepLine} ${styles[color] || ""}`;
                
                  return (
                    <div key={index} className={stepClass}>
                      <div className={stepCircleClass}>
                        <i className={`fa ${icon || "fa-question-circle"}`}></i>
                      </div>
                      <div className={stepLineClass}></div>
                      <div className={styles.bottomLine}></div>
                      <p className={styles.stepText}>{status.statusType}</p>
                      <p className={styles.stepTime}>{new Date(status.createdDate).toLocaleString()}</p>
                    </div>
                  );
                })}
              </div>

              {/* Các sản phẩm trong đơn hàng */}
              {order.billDetails.map((detail, index) => {
                const productDetail = productDetails[index];
                const productDetailUrl = `/productdetail/${productDetail.productId}`;
                return (
                  <div className={styles.orderItemWrapper} key={detail.id}>
                    <div className={styles.orderItemImage}>
                      <img src={productDetail?.images[0]?.imgUrl} alt={`Product ${productDetail?.productDetailCode}`} className="img-fluid rounded" />
                    </div>
                    <div className={styles.orderItemInfo}>
                      <p className="text-xl font-semibold text-dark">
                      <Link to={productDetailUrl} className={`${styles.linkProduct} btn`}>
                        Sản phẩm: {productDetail?.productName}
                      </Link>
                      </p>
                      <div className="color-size text-md text-muted ms-3">
                        <p>Màu sắc: <span className="font-medium">{productDetail?.colors?.name}</span></p>
                        <p>Size: <span className="font-medium">{productDetail?.sizes?.name}</span></p>
                      </div>
                    </div>
                    <div className={styles.orderItemCalc}>
                      <p className="text-lg text-muted" style={{marginRight: "100px"}}>Số lượng: <span className="text-muted">{detail.quantity}</span></p>
                      <p className="text-lg text-danger">
                        Giá: 
                        <span className="">
                          {productDetail?.sale_products?.length > 0
                            ? currencyFormat(productDetail.sale_products[0].discountedPrice)
                            : currencyFormat(productDetail?.price)}
                        </span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </UserContent>
        </UserDashboardWrapper>
      </Container>
    </div>
  );
};

export default OrderDetailScreen;
