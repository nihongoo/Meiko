import React, { useState, useEffect, useMemo } from 'react';
import { Checkbox } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import styles from "./ProductCart.module.css";

function ProductCart() {
  const [selectedCoupon, setSelectedCoupon] = useState("");
  const [cartId, setCartId] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [userCoupons, setUserCoupons] = useState([]);
  const [cartDetails, setCartDetails] = useState([]); 
  const [products, setProducts] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const customerId = localStorage.getItem("customerId");
  const navigate = useNavigate();

  useEffect(() => {
    if (customerId) {
      fetch('https://localhost:7172/api/Voucher/GetAll')
        .then((response) => response.json())
        .then((data) => {
          const publicCoupons = data.filter(voucher => voucher.isPublic === true);
          setCoupons(publicCoupons);
          fetch(`https://localhost:7172/api/Customer/Get/${customerId}`)
            .then((response) => response.json())
            .then((userData) => {
              const userVoucherIds = userData.voucherDetails.map(voucher => voucher.voucherId);
              const privateCoupons = data.filter(voucher => userVoucherIds.includes(voucher.id) && voucher.isPublic === false);
              setUserCoupons(privateCoupons);
            })
            .catch((error) => console.error('Lỗi khi lấy thông tin người dùng:', error));
        })
        .catch((error) => {
          console.error('Lỗi khi lấy tất cả các voucher:', error);
        });
      fetch(`https://localhost:7172/api/Carts/${customerId}`)
        .then((response) => response.json())
        .then((data) => {
          setCartId(data.id);
          fetchCartDetails(data.id);
        })
        .catch((error) => {
          console.error('Lỗi khi lấy giỏ hàng:', error);
        });
    }
    // eslint-disable-next-line
  }, [customerId]);
  const fetchCartDetails = (cartId) => {
    localStorage.setItem('cartId', cartId);
    fetch(`https://localhost:7172/api/CartDetails/get-all-cartdetail-by/${cartId}`)
      .then((response) => response.json())
      .then((data) => {
        setCartDetails(data);
        data.forEach((item) => {
          fetchProduct(item.productDetails.productId);
        });
      })
      .catch((error) => {
        console.error('Error fetching cart details:', error);
      });
  };
  const fetchProduct = (productId) => {
    fetch(`https://localhost:7172/api/Product/Get/${productId}`)
      .then((response) => response.json())
      .then((data) => {
        setProducts((prevState) => ({
          ...prevState,
          [productId]: data,
        }));
      })
      .catch((error) => console.error('Error fetching product:', error));
  };
  const handleCheckboxChange = (cartDetailId) => {
    setCartDetails(prevCartDetails =>
      prevCartDetails.map(item =>
        item.id === cartDetailId
          ? { ...item, selected: !item.selected }
          : item
      )
    );
  };
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };
  const handleCouponChange = (e) => {
    const selectedId = e.target.value;
    if (selectedId === "") {
      setSelectedCoupon("");
      setErrorMessage(null);
      return;
    }
    const selectedCouponObj = [...coupons, ...userCoupons].find(coupon => coupon.id === selectedId);
    setSelectedCoupon(selectedCouponObj);
  };
  const validateVoucher = (coupon, total) => {
    const { minimumOrderAmount, startDay, endDay } = coupon;
    const totalAmount = total;
    if (totalAmount < minimumOrderAmount) {
      setErrorMessage(`Để sử dụng mã giảm giá này, bạn cần đơn hàng có giá trị tối thiểu là ${formatCurrency(minimumOrderAmount)}.`);
      return false;
    }
    const currentDate = new Date();
    const startDate = new Date(startDay);
    const endDate = new Date(endDay);
    if (currentDate < startDate || currentDate > endDate) {
      setErrorMessage(`Mã giảm giá này đã hết hạn hoặc chưa bắt đầu hiệu lực.`);
      return false;
    }
    if (coupon.quantity <= 0) {
      setErrorMessage(`Mã giảm giá này đã hết số lượng sử dụng.`);
      return false;
    }
    setErrorMessage(null);
    return true;
  };
  const calculateTotal = () => {
    let total = 0;
    let discount = 0; 
    cartDetails.forEach((item) => {
      if (item.selected) {
        const price = item.productDetails.sale_products.length > 0
          ? item.productDetails.sale_products[0].discountedPrice
          : item.productDetails.price;
        total += item.quantity * price;
      }
    });
    if (selectedCoupon) {
      const selectedCouponDetails = [...coupons, ...userCoupons].find(
        (coupon) => coupon.voucherCode === selectedCoupon.voucherCode
      );
      if (selectedCouponDetails) {
        const isValid = validateVoucher(selectedCouponDetails, total);
        if (isValid) {
          discount += total * (selectedCouponDetails.value / 100);
        }
      }
    }
    return { total, discount };
  };
  const { total, discount } = useMemo(() => calculateTotal(), [cartDetails, selectedCoupon, coupons, userCoupons]);
  const updateQuantity = (cartDetailId, productDetailId, quantity) => {
    const apiUrl = `https://localhost:7172/api/CartDetails/change-stock-only/${cartDetailId}?productDetailId=${productDetailId}&quantity=${quantity}`;
    fetch(apiUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.text())
      .then((data) => {
        if (data.includes("Đã thêm")) {
          setCartDetails(prevCartDetails => 
            prevCartDetails.map(item => 
              item.id === cartDetailId ? { ...item, quantity: quantity } : item
            )
          );
        } else {
          alert("Không thể cập nhật số lượng. Vui lòng thử lại.");
        }
      })
      .catch((error) => {
        console.error('Lỗi khi cập nhật số lượng:', error);
      });
  };
  const removeFromCart = (cartDetailId) => {
    fetch(`https://localhost:7172/api/CartDetails/remove-from-cart/${cartDetailId}`, {
      method: 'DELETE'
    })
      .then((response) => response.json())
      .then((data) => {
        fetchCartDetails(cartId);
      })
      .catch((error) => console.error('Error removing from cart:', error));
      window.location.reload();
  };
  const increaseQuantity = (cartDetailId, productDetailId, quantity) => {
    const item = cartDetails.find((cartItem) => cartItem.id === cartDetailId);
    if (!item) {
      alert("Không tìm thấy sản phẩm trong giỏ hàng");
      return;
    }
    const stockQuantity = item.productDetails.stockQuantity;
    const newQuantity = item.quantity + 1;
    if (newQuantity > stockQuantity) {
      alert(`Số lượng sản phẩm trong kho chỉ còn ${stockQuantity}. Không thể thêm nhiều hơn.`);
      return;
    }
    setCartDetails(prevCartDetails => 
      prevCartDetails.map(cartItem => 
        cartItem.id === cartDetailId ? { ...cartItem, quantity: newQuantity } : cartItem
      )
    );

    updateQuantity(cartDetailId, productDetailId, newQuantity);
  };
  const decreaseQuantity = (cartDetailId, productDetailId, quantity) => {
    const item = cartDetails.find((cartItem) => cartItem.id === cartDetailId);
    if (!item) {
      alert("Không tìm thấy sản phẩm trong giỏ hàng");
      return;
    }
    if (item.quantity > 1) { 
      const newQuantity = item.quantity - 1;
      updateQuantity(cartDetailId, productDetailId, newQuantity);
    } else {
      alert("Số lượng không thể giảm xuống dưới 1");
    }
  };
  const handleQuantityChange = (e, cartDetailId) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (isNaN(newQuantity) || newQuantity <= 0) {
      alert("Số lượng không hợp lệ");
      return;
    }
    const item = cartDetails.find((cartItem) => cartItem.id === cartDetailId);
    if (!item) {
      alert("Không tìm thấy sản phẩm trong giỏ hàng");
      return;
    }
    const stockQuantity = item.productDetails.stockQuantity;
    if (newQuantity > stockQuantity) {
      alert(`Số lượng sản phẩm trong kho chỉ còn ${stockQuantity}. Không thể thêm nhiều hơn.`);
      return;
    }
    setCartDetails(prevCartDetails => 
      prevCartDetails.map(cartItem => 
        cartItem.id === cartDetailId ? { ...cartItem, quantity: newQuantity } : cartItem
      )
    );
    updateQuantity(cartDetailId, item.productDetails.id, newQuantity);
  };

  const handlePayment = () => {
    const selectedItems = cartDetails.filter(item => item.selected);
    const productDetailsInfo = selectedItems.map(item => {
        const productName = products[item.productDetails.productId]?.name || 'Không có tên sản phẩm';
        const size = item.productDetails.sizes?.name || 'Không có kích thước';
        const color = item.productDetails.colors?.name || 'Không có màu sắc';
        return `${productName} - ${color}, ${size}`;
    });
    const paymentData = {
        cartId,
        selectedItems,
        total: total - discount,
        coupon: selectedCoupon,
        productDetailsInfo,
    };

    console.log(productDetailsInfo);
    navigate('/checkout', { state: { paymentData } });
};


  return (
    <div className="container row" style={{ marginLeft: '80px' }}>
      <div className="d-flex">
        <div className={`${styles.tableContainer} col-md-9`}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th></th>
                <th>Sản phẩm</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
                <th></th>
              </tr>
            </thead>
            <tbody className={styles.tbody}>
              {cartDetails.map((item) => (
                <tr key={item.id}>
                  <td>
                  <Checkbox
                    checked={item.selected}
                    onChange={() => handleCheckboxChange(item.id)}
                  />
                  </td>
                  <td>
                    <div className={styles.productInfo}>
                      {products[item.productDetails.productId] ? (
                        <>
                          <img
                            src={item.productDetails.images?.[0]?.imgUrl}
                            alt="Sản phẩm"
                            className={styles.productImage}
                          />
                          <div className={styles.productDetails}>
                            <p style={{ fontSize: "20px" }}>
                              {products[item.productDetails.productId].name}
                            </p>
                            <span>{item.productDetails.colors.name}, {item.productDetails.sizes.name}</span>
                            <p style={{ fontWeight: "bold", color: "black" }}>
                              {item.productDetails.sale_products.length > 0
                                ? formatCurrency(item.productDetails.sale_products[0].discountedPrice)
                                : formatCurrency(item.productDetails.price)}
                            </p>
                          </div>
                        </>
                      ) : (
                        <p>Loading...</p>
                      )}
                    </div>
                  </td>

                  <td>
                    <div className={styles.quantityControl}>
                      <button
                        onClick={() => decreaseQuantity(item.id, item.productDetails.id, item.quantity)}
                        className={styles.quantityButton}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={item.productDetails.quantity}
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(e, item.id)}
                        className={styles.quantityInput}
                      />
                      <button
                        onClick={() => increaseQuantity(item.id, item.productDetails.id, item.quantity)}
                        className={styles.quantityButton}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td style={{ fontWeight: "bold" }}>
                    {formatCurrency(
                      item.quantity * (item.productDetails.sale_products.length > 0
                        ? item.productDetails.sale_products[0].discountedPrice
                        : item.productDetails.price)
                    )}
                  </td>
                  <td>
                    <button
                      className={styles.deleteButton}
                      onClick={() => removeFromCart(item.id)}
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className={styles.continueButton}>Tiếp tục mua hàng</button>
        </div>
        <div className={`${styles.discountSection} col-md-3`}>
          <h4>Mã giảm giá</h4>
          <select
            className={styles.dropdown}
            value={selectedCoupon ? selectedCoupon.id : ''}
            onChange={handleCouponChange}
          >
            <option value="">Chọn mã giảm giá</option>
            {coupons.map((coupon) => (
              <option key={coupon.id} value={coupon.id}>
                {coupon.voucherCode} - {coupon.value}% giảm
              </option>
            ))}
            {userCoupons.map((coupon) => (
              <option key={coupon.id} value={coupon.id}>
                {coupon.voucherCode} - {coupon.value}% giảm
              </option>
            ))}
          </select>
          <div className={styles.summary}>
            {selectedCoupon && (
              <div className={styles.couponForm}>
              <b>Thông tin mã giảm giá</b>
              <p><strong>Mã giảm giá:</strong> {selectedCoupon.voucherCode}</p>
              <p><strong>Giảm giá:</strong> {selectedCoupon.value}%</p>
              <p><strong>Giá trị đơn hàng tối thiểu:</strong> {formatCurrency(selectedCoupon.minimumOrderAmount)}</p>
              <p><strong>Hạn sử dụng:</strong> {new Date(selectedCoupon.startDay).toLocaleDateString()} - {new Date(selectedCoupon.endDay).toLocaleDateString()}</p>
              <p><strong>Trạng thái:</strong> {selectedCoupon.status === 0 ? "Đang áp dụng" : "Không áp dụng"}</p>
            </div>
            )}
            {errorMessage && (
              <div className={styles.errorMessage}>
                <p style={{ color: "red" }}>{errorMessage}</p>
              </div>
            )}
          </div>
          <hr />
          <div className={styles.summary}>
          <b>Tổng đơn hàng</b>
          <div className={styles.summaryRow}>
            <span>Tổng tiền</span>
            <p>{formatCurrency(total)}</p>
          </div>
          <div className={styles.summaryRow}>
            <span>Giảm giá</span>
            <p>{formatCurrency(discount)}</p>
          </div>
          <div className={styles.summaryRow}>
            <span>Tổng thanh toán</span>
            <p>{formatCurrency(total - discount)}</p>
          </div>
            {selectedCoupon && (
              <div className={styles.voucherValidationMessage}>
                {coupons.concat(userCoupons).map((coupon) => {
                  if (coupon.code === selectedCoupon.voucherCode) { 
                    const validationMessage = validateVoucher(coupon, total);
                    return validationMessage ? (
                      <p className={styles.validationError}>{validationMessage}</p>
                    ) : null;
                  }
                  return null;
                })}
              </div>
            )}
            <button onClick={handlePayment} className={styles.applyButton}>Thanh toán</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCart;
