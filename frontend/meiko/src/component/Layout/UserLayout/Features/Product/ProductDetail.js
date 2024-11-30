import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './ProductDetail.module.css';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [availableQuantity, setAvailableQuantity] = useState(0);

  // Lấy dữ liệu sản phẩm từ API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://localhost:7172/api/Product/Get/${productId}`);
        if (!response.ok) {
          throw new Error('Không thể tải sản phẩm');
        }
        const data = await response.json();
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError('Có lỗi xảy ra khi tải dữ liệu sản phẩm');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Cập nhật giá và số lượng tồn kho khi thay đổi size hoặc color
  useEffect(() => {
    if (selectedSize && selectedColor && product) {
      const selectedProductDetail = product.Product_detail.find(detail =>
        detail.sizes.name === selectedSize && detail.colors.name === selectedColor
      );
      if (selectedProductDetail) {
        setSelectedPrice(selectedProductDetail.price);
        setAvailableQuantity(selectedProductDetail.quantity);
        setQuantity(1); 
      } else {
        setSelectedPrice(null);
        setAvailableQuantity(0);
      }
    }
  }, [selectedSize, selectedColor, product]);

  // Nếu đang tải dữ liệu
  if (loading) {
    return <div className={styles.loading}>Đang tải dữ liệu...</div>;
  }

  // Nếu có lỗi khi tải dữ liệu
  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  // Nếu không tìm thấy sản phẩm
  if (!product) {
    return <div className={styles.notFound}>Không tìm thấy sản phẩm</div>;
  }

  const imageUrl = product.imageUrl || '';
  const productDetails = product.Product_detail || [];

  // Lấy danh sách kích thước và màu sắc từ dữ liệu sản phẩm
  const sizes = Array.from(new Set(productDetails.flatMap(detail => detail.sizes ? [detail.sizes.name] : [])));
  const colors = Array.from(new Set(productDetails.flatMap(detail => detail.colors ? [detail.colors.name] : [])));

  // Hàm xử lý tăng/giảm số lượng
  const handleIncreaseQuantity = () => {
    if (quantity < availableQuantity) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem("jwtToken");
  
    if (!token) {
      alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.");
      navigate("/SignIn");
      return;
    }
  
    const customerId = localStorage.getItem("customerId");
  
    if (!customerId) {
      alert("Không tìm thấy thông tin khách hàng.");
      return;
    }
  
    try {
      // Lấy CartId từ API /api/Carts/{customerId}
      const cartResponse = await fetch(`https://localhost:7172/api/Carts/${customerId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!cartResponse.ok) {
        const errorText = await cartResponse.text();  // Đọc văn bản nếu có lỗi
        console.error("Error fetching cart:", errorText);
        alert("Không thể lấy giỏ hàng của bạn.");
        return;
      }
  
      const cartData = await cartResponse.json();  // Chỉ phân tích cú pháp JSON một lần
  
      if (!cartData || !cartData.id) {
        alert("Không có giỏ hàng cho tài khoản này.");
        return;
      }
  
      const cartId = cartData.id;
  
      if (!selectedSize || !selectedColor) {
        alert("Vui lòng chọn màu và kích thước hợp lệ.");
        return;
      }
  
      const selectedProductDetail = product.Product_detail.find(detail =>
        detail.sizes.name === selectedSize && detail.colors.name === selectedColor
      );
  
      if (!selectedProductDetail) {
        alert("Sản phẩm không hợp lệ. Vui lòng chọn lại màu và kích thước.");
        return;
      }
  
      const productDetailId = selectedProductDetail.id;
      const selectedQuantity = quantity ;
  
      const url = new URL("https://localhost:7172/api/CartDetails/add-to-cart");
      const params = {
        CartId: cartId,
        ProductDetailId: productDetailId,
        Quantity: selectedQuantity,
      };
  
      Object.keys(params).forEach((key) =>
        url.searchParams.append(key, params[key])
      );
  
      const addToCartResponse = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!addToCartResponse.ok) {
        const errorText = await addToCartResponse.text();  // Đọc văn bản nếu có lỗi
        console.error("Error adding to cart:", errorText);
        alert("Không thể thêm sản phẩm vào giỏ hàng.");
        return;
      }
  
      // Kiểm tra nếu phản hồi trả về là văn bản
      const textResponse = await addToCartResponse.text();
  
      // Nếu phản hồi là một chuỗi văn bản, hiển thị thông báo
      if (textResponse && textResponse.includes("Đã thêm sản phẩm vào giỏ hàng")) {
        alert("Sản phẩm đã được thêm vào giỏ hàng!");
        window.location.reload();
      } else {
        // Nếu phản hồi là JSON hợp lệ, xử lý như bình thường
        try {
          const addToCartData = JSON.parse(textResponse); // Cố gắng phân tích cú pháp JSON
          console.log("Cart response:", addToCartData);
        } catch (jsonError) {
          console.error("Error parsing JSON:", jsonError);
        }
      }
  
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.");
    }
  };
  
  
  return (
    <div className="container w-75">
      <div className={styles.card}>
        <div className="container">
          <div className={`${styles.wrapper} row`}>
            {/* Hình ảnh sản phẩm */}
            {imageUrl && (
              <div className={`${styles.preview} col-md-6`}>
                <div className={`${styles.previewPic} tab-content`}>
                  <div className={`tab-pane active ${styles.tabImg}`}>
                    <img style={{maxWidth: '70%'}} src={imageUrl} alt="Product Image" />
                  </div>
                </div>
              </div>
            )}

            <div className={`${styles.details} col-md-6`}>
              <h3 className={styles.productTitle}>{product.name}</h3>
              <div className={styles.rating}>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`fa fa-star ${i < 4 ? 'checked' : ''}`}></span>
                  ))}
                </div>
                <span className={styles.reviewNo}>{product.reviews} đánh giá</span>
              </div>
              <p className={styles.productDescription}>
                {product.description}
              </p>

                <h4 className={styles.price}>
                  Giá hiện tại: <span>{selectedPrice ? selectedPrice.toLocaleString('vi-VN') : '0'} VND</span>
                </h4>

                <p className={styles.availableQuantity}>
                  Số lượng còn lại: <strong>{availableQuantity > 0 ? availableQuantity : '0'}</strong>
                </p>

              {/* Xử lý kích thước */}
              <h5 className={styles.sizes}>
                  Kích thước:
                  {sizes.length > 0 ? (
                    sizes.map((size, index) => (
                      <span
                        key={index}
                        className={`${styles.size} ${selectedSize === size ? styles.selected : ''}`}
                        onClick={() => setSelectedSize(size)}
                        data-toggle="tooltip"
                        title={size}
                      >
                        {size}
                      </span>
                    ))
                  ) : (
                    <span>Không có kích thước khả dụng</span>
                  )}
                </h5>
              
                <h5 className={styles.colors}>
                  Màu sắc:
                  {colors.length > 0 ? (
                    colors.map((color, index) => (
                      <span
                        key={index}
                        className={`${styles.color} ${selectedColor === color ? styles.selected : ''}`}
                        style={{ backgroundColor: product.Product_detail.find(detail => detail.colors.name === color)?.colors.hex }}
                        onClick={() => setSelectedColor(color)}
                        data-toggle="tooltip"
                        title={color}
                      ></span>
                    ))
                  ) : (
                    <span>Không có màu sắc khả dụng</span>
                  )}
                </h5>

              {/* Chọn số lượng */}
              <div className={styles.quantitySelector}>
                <h5>Số lượng:</h5>
                <button
                  className={styles.decrease}
                  onClick={handleDecreaseQuantity}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className={styles.quantity}>{quantity}</span>
                <button
                  className={styles.increase}
                  onClick={handleIncreaseQuantity}
                  disabled={quantity >= availableQuantity}
                >
                  +
                </button>
              </div>

              <div className={styles.action}>
                <button className={`${styles.addToCart} btn btn-default`} type="button" onClick={handleAddToCart}>Thêm vào giỏ hàng</button>
                <button className={`${styles.like} btn btn-default`} type="button">
                  <span className="fa fa-heart"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
