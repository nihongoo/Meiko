import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { FaCheckCircle, FaHome } from 'react-icons/fa'; // Các icon từ Font Awesome

const OrderSuccess = () => {
  const billCode = localStorage.getItem('billCode');

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', background: '#f8f9fa', paddingTop:"200px", paddingLeft:"300px" }}>
      <Row className="text-center">
        <Col lg={8} md={10} sm={12}>
          {/* Box Container */}
          <div className="card p-4 shadow-sm rounded-lg bg-light">
            <div className="mb-4">
              {/* Icon và thông điệp cảm ơn */}
              <FaCheckCircle size={80} color="#28a745" />
            </div>
            <h1 className="display-4 text-success mb-3">Cảm ơn bạn đã đặt hàng!</h1>
            <p className="lead text-muted">
              Đơn hàng của bạn đã được xác nhận thành công và đang trong quá trình xử lý.
            </p>
            <p className="text-info">
              Chúng tôi sẽ gửi thông tin chi tiết và trạng thái đơn hàng đến email của bạn.
            </p>

            {/* Mã đơn hàng */}
            <div className="alert alert-success p-3 mt-3">
              <h5 className="mb-0">Mã đơn hàng của bạn:</h5>
              <p className="h4 text-dark font-weight-bold">{billCode}</p>
            </div>

            {/* Button quay lại trang chủ */}
            <Link to="/homeUser" className="btn btn-primary btn-lg mt-4">
              <FaHome className="mr-2" /> Quay lại trang chủ
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderSuccess;
