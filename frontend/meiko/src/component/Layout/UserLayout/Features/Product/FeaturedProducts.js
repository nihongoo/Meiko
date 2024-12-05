import React, { useEffect, useState } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import styles from './FeaturedProducts.module.css';
import CircularProgress from '@mui/material/CircularProgress';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColors, setSelectedColors] = useState({});

  // Kiểm tra sản phẩm có mới không
  const isNewProduct = (createdAt) => {
    const currentDate = new Date();
    const productDate = new Date(createdAt);
    const oneYearInMillis = 365 * 24 * 60 * 60 * 1000;
    return currentDate - productDate < oneYearInMillis;
  };

  // Định dạng tiền tệ
  const formatPrice = (price) => {
    const priceStr = price ? String(price) : '0';
    return priceStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + 'đ';
  };

  // Lấy giá giảm
  const getDiscountedPrice = (saleProducts) => {
    if (saleProducts && saleProducts.length > 0) {
      return saleProducts[0].discountedPrice;
    }
    return null;
  };

  // Xử lý chọn màu
  const handleColorClick = (productId, colorHex, productDetails) => {
    const selectedColorDetail = productDetails.find(
      (detail) => detail.colors.hex === colorHex
    );

    if (selectedColorDetail) {
      setSelectedColors((prevState) => ({
        ...prevState,
        [productId]: {
          colorHex: colorHex,
        },
      }));
    }
  };

  // Gọi API để lấy dữ liệu sản phẩm
  useEffect(() => {
    fetch('https://localhost:7172/api/Product/Get-All')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Lỗi từ server: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Có lỗi xảy ra khi gọi API:', error);
        setError(`Có lỗi xảy ra: ${error.message}`);
        setLoading(false);
      });
  }, []);

  // Hiển thị giá sản phẩm
  const renderPrice = (product) => {
    // Lấy thông tin về màu sắc đã chọn
    const selected = selectedColors[product.id];
  
    // Lấy giá gốc và giá giảm nếu có
    const originalPrice = product.Product_detail[0]?.price;
    const currentPrice =
      selected?.price || getDiscountedPrice(product.Product_detail[0]?.sale_products) || originalPrice;
  
    // Tính phần trăm giảm giá nếu có
    const saleProduct = product.Product_detail[0]?.sale_products[0];
    const discountPercent = saleProduct?.sales?.value || (
      originalPrice && currentPrice < originalPrice
        ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
        : 0
    );
  
    return (
      <div className={styles.priceWrapper}>
        {/* Chỉ gạch giá gốc nếu có giảm giá */}
        {discountPercent > 0 && originalPrice && (
          <p className={styles.originalPrice}>
            <del>{formatPrice(originalPrice)}</del>
          </p>
        )}
        <p className={styles.currentPrice}>{formatPrice(currentPrice)}</p>
      </div>
    );
  };
  

  // Hiển thị phần màu sắc
  const renderColors = (product) => (
    <div className={styles.colorWrapper}>
      <div className={styles.colors}>
        {product.Product_detail?.length > 0 ? (
          product.Product_detail.map((detail, index) =>
            detail.colors ? (
              <span
                key={index}
                className={`${styles.colorCircle} ${
                  selectedColors[product.id]?.colorHex === detail.colors.hex
                    ? styles.selected
                    : ''
                }`}
                style={{ backgroundColor: detail.colors.hex }}
                title={detail.colors.name}
                onClick={() =>
                  handleColorClick(product.id, detail.colors.hex, product.Product_detail)
                }
              ></span>
            ) : null
          )
        ) : (
          <span>Chưa có màu sắc</span>
        )}
      </div>
    </div>
  );

  // Hiển thị phần ảnh
  // Hiển thị phần ảnh sản phẩm
  const renderImage = (product) => {
    // Đường dẫn cơ sở của ảnh (thay đổi tùy theo nơi lưu trữ ảnh của bạn)
    const imageUrlBase = '../../../../../Asset/Logo/';
  
    // Lấy ảnh từ mảng images trong Product_detail
    const imageFileName = product.Product_detail[0]?.images[0]?.imgUrl || 'default.jpg'; // Nếu không có ảnh thì dùng ảnh mặc định
  
    // Tạo URL đầy đủ cho ảnh
    const imageUrl = `${imageUrlBase}${imageFileName}`;
  
    return (
      <div className={styles.productImgWrapper}>
        {/* Hiển thị tag giảm giá nếu có */}
        {getDiscountedPrice(product.Product_detail[0]?.sale_products) && (
          <span className={styles.discountTag}>
            Giảm {Math.round(((product.Product_detail[0]?.price - getDiscountedPrice(product.Product_detail[0]?.sale_products)) / product.Product_detail[0]?.price) * 100)}%
          </span>
        )}
  
        {/* Hiển thị tag mới nếu sản phẩm mới */}
        {isNewProduct(product.createTime) && (
          <span className={styles.newTag}>Mới</span>
        )}
  
        {/* Hiển thị ảnh sản phẩm */}
        <img
          src={product.imageUrl}  // Dùng URL ảnh đầy đủ
          alt={product.name}
          className={styles.productImg}
        />
  
        {/* Các icon yêu thích, giỏ hàng, chi tiết */}
        <div className={styles.iconWrapper}>
          <i className="fa fa-heart" title="Yêu thích"></i>
          <i className="fa fa-shopping-cart" title="Giỏ hàng"></i>
          <i className="fa fa-eye" title="Chi tiết"></i>
        </div>
      </div>
    );
  };
  

  if (loading) return <div className='d-flex justify-content-center'><CircularProgress/></div>;
  if (error) return <div className='d-flex justify-content-center'>{error}</div>;

  return (
    <div className={styles.featuredProducts} style={{ marginTop: '70px' }}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Sản phẩm mới nhất</h2>
        <div className="row" style={{ marginTop: '50px' }}>
          {products.slice(0, 4).map((product) => (
            <div key={product.id} className="col-md-3">
              <div className={styles.productCard}>
                <div className={styles.discountAndNewWrapper}>
                  {product.Product_detail[0]?.sale_products.length > 0 && (
                    <span className={styles.discountTag}>
                      Giảm {Math.round(((product.Product_detail[0]?.price - getDiscountedPrice(product.Product_detail[0]?.sale_products)) / product.Product_detail[0]?.price) * 100)}%
                    </span>
                  )}
                  {isNewProduct(product.createTime) && <span className={styles.newTag}>Mới</span>}
                </div>
                {renderImage(product)}
                <p className={styles.warranty} style={{textAlign:'center'}}> {product.brands.name} </p>
                {renderColors(product)}
                <h3 className={styles.productName}>{product.name}</h3>
                {renderPrice(product)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
