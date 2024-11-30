import React, { useState, useEffect } from 'react';
import { Checkbox } from "@mui/material";
import styles from "./ProductCart.module.css";

function ProductCart() {
  const [selectedCoupon, setSelectedCoupon] = useState("");
  const [cartId, setCartId] = useState(null);
  const [cartDetails, setCartDetails] = useState([]); 
  const [products, setProducts] = useState({});

  const customerId = localStorage.getItem("customerId");

  useEffect(() => {
    if (customerId) {
      fetch(`https://localhost:7172/api/Carts/${customerId}`)
        .then((response) => response.json())
        .then((data) => {
          setCartId(data.id);
          fetchCartDetails(data.id);
        })
        .catch((error) => {
          console.error('Error fetching cart:', error);
        });
    }
  }, [customerId]);

  // Lấy chi tiết giỏ hàng từ API
  const fetchCartDetails = (cartId) => {
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

  const calculateTotal = () => {
    let total = 0;
    let discount = 0;

    cartDetails.forEach((item) => {
      const price = item.productDetails.sale_products.length > 0
        ? item.productDetails.sale_products[0].salePrice
        : item.productDetails.price;
      total += item.quantity * price;
      discount += item.productDetails.discount || 0; 
    });

    return { total, discount };
  };

  const { total, discount } = calculateTotal();

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
        console.log('Removed from cart:', data);
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
  
  
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
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
                    <Checkbox />
                  </td>
                  <td>
                    <div className={styles.productInfo}>
                      {products[item.productDetails.productId] ? (
                        <>
                          <img
                            src={products[item.productDetails.productId].image || "default-image.jpg"}
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
                                ? formatCurrency(item.productDetails.sale_products[0].salePrice)
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
                        ? item.productDetails.sale_products[0].salePrice
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
            value={selectedCoupon}
            onChange={(e) => setSelectedCoupon(e.target.value)}
          >
            <option value="">Chọn mã giảm giá</option>
          </select>
          <div className={styles.summary}>
            {selectedCoupon && (
              <div className={styles.couponForm}>
                <b>Thông tin mã giảm giá</b>
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
            <button className={styles.applyButton}>Thanh toán</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCart;
