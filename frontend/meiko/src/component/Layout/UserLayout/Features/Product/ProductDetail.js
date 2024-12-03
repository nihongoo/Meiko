import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './ProductDetail.module.css';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [availableQuantity, setAvailableQuantity] = useState(0);
console.log(productId);

  const [discountedPrice, setDiscountedPrice] = useState(null);
  const [discountPercentage, setDiscountPercentage] = useState(null);

  // Lấy dữ liệu sản phẩm từ API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://localhost:7172/api/Product/Get/${productId}`);
        if (!response.ok) throw new Error('Không thể tải sản phẩm');
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

  // Cập nhật ảnh, giá và số lượng tồn kho khi thay đổi size hoặc color
  useEffect(() => {
    if (selectedSize && selectedColor && product) {
      const selectedProductDetail = product.Product_detail.find(
        (detail) => detail.sizes.name === selectedSize && detail.colors.name === selectedColor
      );
  
      if (selectedProductDetail) {
        // Cập nhật ảnh sản phẩm chi tiết
        setImageUrl(selectedProductDetail.images[0]?.imgUrl || product.imageUrl);
        setSelectedPrice(selectedProductDetail.price);
        setAvailableQuantity(selectedProductDetail.quantity);
        setQuantity(1); 
        if (selectedProductDetail.sale_products && selectedProductDetail.sale_products.length > 0) {
          const sale = selectedProductDetail.sale_products[0];
          setDiscountedPrice(sale.discountedPrice);
          
          if (sale.discountedPrice && selectedProductDetail.price) {
            const discount = ((selectedProductDetail.price - sale.discountedPrice) / selectedProductDetail.price) * 100;
            setDiscountPercentage(Math.round(discount));
          }
        } else {
          setDiscountedPrice(null);
          setDiscountPercentage(null);
        }
      } else {
        setSelectedPrice(null);
        setAvailableQuantity(0);
        setImageUrl('');
      }
    }
  }, [selectedSize, selectedColor, product]);

  // Nếu đang tải dữ liệu
  if (loading) return <div className={styles.loading}>Đang tải dữ liệu...</div>;

  // Nếu có lỗi khi tải dữ liệu
  if (error) return <div className={styles.error}>{error}</div>;

  // Nếu không tìm thấy sản phẩm
  if (!product) return <div className={styles.notFound}>Không tìm thấy sản phẩm</div>;

  const productDetails = product.Product_detail || [];
  const sizes = Array.from(new Set(productDetails.flatMap((detail) => detail.sizes ? [detail.sizes.name] : [])));
  const colors = Array.from(new Set(productDetails.flatMap((detail) => detail.colors ? [detail.colors.name] : [])));

  const handleIncreaseQuantity = () => {
    if (quantity < availableQuantity) setQuantity((prev) => prev + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
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
      const cartResponse = await fetch(`https://localhost:7172/api/Carts/${customerId}`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` },
      });
  
      if (!cartResponse.ok) {
        const errorText = await cartResponse.text();
        alert(`Không thể lấy giỏ hàng của bạn: ${errorText}`);
        return;
      }
  
      const cartData = await cartResponse.json();
      if (!cartData || !cartData.id) {
        alert("Không có giỏ hàng cho tài khoản này.");
        return;
      }
  
      const cartId = cartData.id;
  
      if (!selectedSize || !selectedColor) {
        alert("Vui lòng chọn màu và kích thước hợp lệ.");
        return;
      }
  
      const selectedProductDetail = product.Product_detail?.find(
        (detail) => detail.sizes.name === selectedSize && detail.colors.name === selectedColor
      );
  
      if (!selectedProductDetail || !selectedProductDetail.images || selectedProductDetail.images.length === 0) {
        alert("Sản phẩm không hợp lệ hoặc không có hình ảnh.");
        return;
      }
  
      const productDetailId = selectedProductDetail.id;
      const selectedQuantity = quantity;
  
      const url = new URL("https://localhost:7172/api/CartDetails/add-to-cart");
      const params = {
        CartId: cartId,
        ProductDetailId: productDetailId,
        Quantity: selectedQuantity,
      };
  
      Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));
  
      const addToCartResponse = await fetch(url, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
      });
  
      const responseText = await addToCartResponse.text();
      if (!addToCartResponse.ok) {
        alert(`Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng: ${responseText}`);
        return;
      }
  
      if (responseText.includes("Đã thêm")) {
        alert(responseText);
        window.location.reload();
      } else {
        alert(`Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng: ${responseText}`);
      }
  
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Có lỗi xảy ra khi thêm sản phẩm vào giỏ.");
    }
  };
  
  

  const handleSelectImage = (newImageUrl, index) => {
    setImageUrl(newImageUrl);

    const selectedProductDetail = product.Product_detail.find(detail =>
      detail.images.some(image => image.imgUrl === newImageUrl)
    );
  
    if (selectedProductDetail) {
      setSelectedSize(selectedProductDetail.sizes.name);
      setSelectedColor(selectedProductDetail.colors.name);
  
      setSelectedPrice(selectedProductDetail.price);
      setAvailableQuantity(selectedProductDetail.quantity);
      setQuantity(1);
    }
    setSelectedImageIndex(index);
  };
  
  

  return (
    <div className="container w-75">
      <div className={styles.card}>
        <div className="container">
          <div className={`${styles.wrapper} row`}>
            {/* Hình ảnh sản phẩm */}
            <div className={`${styles.preview} col-md-6`}>
              <div className={`${styles.previewPic} tab-content`}>
                <div className={`tab-pane active ${styles.tabImg}`}>
                  <img style={{ maxWidth: '70%' }} src={imageUrl || product.imageUrl} alt="Product Image" />
                </div>
              </div>
              {/* Hình ảnh nhỏ bên dưới */}
              <div className={styles.imageGallery}>
                {productDetails.map((detail) => 
                  detail.images.map((image, index) => (
                    <img
                      key={image.id}
                      className={`${styles.thumbnail} ${selectedImageIndex === index ? 'selected-thumbnail' : ''}`}
                      src={image.imgUrl} 
                      alt="Product Detail"
                      onClick={() => handleSelectImage(image.imgUrl, index)} 
                    />
                  ))
                )}
              </div>

            </div>

            <div className={`${styles.details} col-md-6`}>
              <h3 className={styles.productTitle}>{product.name}</h3>
              <div className={styles.rating}>
              </div>
              <p className={styles.productDescription}>
                {product.description}
              </p>

              <h4 className={styles.price}>
                Giá:  
                {discountedPrice ? (
                  <>
                    <span className={styles.discountedPrice}>
                      {selectedPrice != null ? selectedPrice.toLocaleString('vi-VN') : '0'} VND
                    </span>
                    <span className={styles.discount}>
                      {discountedPrice != null ? discountedPrice.toLocaleString('vi-VN') : '0'} VND
                    </span>
                    <span className={styles.discountPercentage}>
                      {discountPercentage ? `${discountPercentage}%` : '0%'}
                    </span>
                  </>
                ) : (
                  <span>{selectedPrice != null ? selectedPrice.toLocaleString('vi-VN') : '0'} VND</span>
                )}
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
                      title={color}
                    ></span>
                  ))
                ) : (
                  <span>Không có màu sắc khả dụng</span>
                )}
              </h5>

              {/* Số lượng */}
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
                <button
                  className={`${styles.addToCart} btn btn-default`}
                  type="button"
                  onClick={handleAddToCart}
                >
                  Thêm vào giỏ hàng
                </button>
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
