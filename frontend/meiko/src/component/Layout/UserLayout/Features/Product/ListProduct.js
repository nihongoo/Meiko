import React, { useEffect, useState, useCallback } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import styles from './FeaturedProducts.module.css';

const ListProducts = ({ selectedFilters }) => {
  console.log("Selected Filters:", selectedFilters);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColors, setSelectedColors] = useState({});

  // Kiểm tra sản phẩm có mới không
  const isNewProduct = (createdAt) => {
    const currentDate = new Date();
    const productDate = new Date(createdAt);
    const oneYearInDays = 365;
    const diffInDays = (currentDate - productDate) / (1000 * 60 * 60 * 24);
    return diffInDays < oneYearInDays;
  };

  // Định dạng tiền tệ
  const formatPrice = (price) => {
    return price ? price.toLocaleString() + 'đ' : '0đ';
  };

  // Lấy giá giảm
  const getDiscountedPrice = (saleProducts) => {
    return saleProducts?.[0]?.discountedPrice || null;
  };

  // Xử lý chọn màu
  const handleColorClick = useCallback((productId, colorHex, productDetails) => {
    const selectedColorDetail = productDetails.find(
      (detail) => detail.colors.hex === colorHex
    );

    if (selectedColorDetail) {
      setSelectedColors((prevState) => ({
        ...prevState,
        [productId]: { colorHex: colorHex },
      }));
    }
  }, []);

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

  // Lọc sản phẩm theo bộ lọc
  const filteredProducts = products.filter((product) => {
    let isFiltered = true;
  
    // Kiểm tra lọc theo materials
    if (selectedFilters.materials && selectedFilters.materials.length > 0) {
      const productMaterials = product.Product_detail?.map(detail => detail.material) || [];
      if (!productMaterials.some(material => selectedFilters.materials.includes(material))) {
        isFiltered = false;
      }
    }
  
    // Kiểm tra lọc theo category
    if (selectedFilters.categories && selectedFilters.categories.length > 0) {
      if (!selectedFilters.categories.includes(product.category)) {
        isFiltered = false;
      }
    }
  
    // Kiểm tra lọc theo brand
    if (selectedFilters.brands && selectedFilters.brands.length > 0) {
      if (!selectedFilters.brands.includes(product.brand)) {
        isFiltered = false;
      }
    }
  
    // Kiểm tra lọc theo color
    if (selectedFilters.colors && selectedFilters.colors.length > 0) {
      const selectedColorHex = selectedColors[product.id]?.colorHex;
      if (!selectedColorHex || !selectedFilters.colors.includes(selectedColorHex)) {
        isFiltered = false;
      }
    }
  
    // Kiểm tra lọc theo size
    if (selectedFilters.sizes && selectedFilters.sizes.length > 0) {
      if (!selectedFilters.sizes.includes(product.size)) {
        isFiltered = false;
      }
    }
  
    return isFiltered;
  });

  // Hiển thị giá sản phẩm
  const renderPrice = (product) => {
    const selected = selectedColors[product.id];
    const originalPrice = product.Product_detail[0]?.price || 0;
    const saleProduct = product.Product_detail[0]?.sale_products?.[0];
    const currentPrice =
      selected?.price || getDiscountedPrice(product.Product_detail[0]?.sale_products) || originalPrice;

    const discountPercent = saleProduct?.sales?.value || (
      originalPrice && currentPrice < originalPrice
        ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
        : 0
    );

    return (
      <div className={styles.priceWrapper}>
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
  const renderImage = (product) => {
    const imageUrlBase = '../../../../../Asset/Logo/';
    const imageFileName = product.Product_detail?.[0]?.images?.[0]?.imgUrl || 'default.jpg';
    const imageUrl = `${imageUrlBase}${imageFileName}`;

    return (
      <div className={styles.productImgWrapper}>
        {getDiscountedPrice(product.Product_detail[0]?.sale_products) && (
          <span className={styles.discountTag}>
            Giảm {Math.round(
              ((product.Product_detail[0]?.price - getDiscountedPrice(product.Product_detail[0]?.sale_products)) /
                product.Product_detail[0]?.price) *
                100
            )}%
          </span>
        )}

        {isNewProduct(product.createTime) && (
          <span className={styles.newTag}>Mới</span>
        )}
        <img
          src={imageUrl}
          alt={product.name}
          className={styles.productImg}
        />
      </div>
    );
  };

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.featuredProducts} style={{ marginTop: '70px' }}>
      <div className="container">
        <div className="row g-4" style={{ marginTop: '50px' }}>
          {filteredProducts.map((product) => (
            <div key={product.id} className="col-md-4 col-sm-6 col-12">
              <div className={styles.productCard}>
                {renderImage(product)}
                <p className={styles.warranty} style={{ textAlign: 'center' }}>
                  {product.brands.name}
                </p>
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

export default ListProducts;
