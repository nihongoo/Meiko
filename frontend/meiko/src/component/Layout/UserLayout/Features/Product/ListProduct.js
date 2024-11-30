import React, { useEffect, useState, useCallback } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import styles from './FeaturedProducts.module.css';
import { Link } from 'react-router-dom';

const ListProducts = ({ selectedFilters }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColors, setSelectedColors] = useState({});
  const [sortBy, setSortBy] = useState('name-asc'); 
  const [currentPage, setCurrentPage] = useState(1); 
  const itemsPerPage = 15;

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

  // Lọc sản phẩm theo bộ lọc
  const filteredProducts = products.filter((product) => {
    let isFiltered = true;
  
    // Lọc theo giá
    if (selectedFilters.priceRanges && selectedFilters.priceRanges.length > 0) {
      const price = product.Product_detail?.[0]?.price || 0;
      // Định nghĩa phạm vi giá
      const priceRanges = {
        "under-20k": { min: 0, max: 20000 },
        "20k-100k": { min: 20000, max: 100000 },
        "100k-200k": { min: 100000, max: 200000 },
        "200k-500k": { min: 200000, max: 500000 },
        "500k-above": { min: 500000, max: Infinity },
      };
    
      const isPriceInSelectedRange = selectedFilters.priceRanges.some((range) => {
        const { min, max } = priceRanges[range] || {};
        return price >= min && price <= max;
      });
    
      if (!isPriceInSelectedRange) {
        isFiltered = false;
      }
    }
    // Các điều kiện lọc khác (material, category, color, size)
    if (selectedFilters.materials && selectedFilters.materials.length > 0) {
      const productMaterialIds = product.Product_detail?.map(detail => detail.materialId) || [];
      if (!productMaterialIds.some(id => selectedFilters.materials.includes(id))) {
        isFiltered = false;
      }
    }
  
    if (selectedFilters.categories && selectedFilters.categories.length > 0) {
      if (!selectedFilters.categories.includes(product.categoryId)) {
        isFiltered = false;
      }
    }
  
    if (selectedFilters.brands && selectedFilters.brands.length > 0) {
      if (!selectedFilters.brands.includes(product.brandId)) {
        isFiltered = false;
      }
    }
  
    if (selectedFilters.colors && selectedFilters.colors.length > 0) {
      const hasMatchingColor = product.Product_detail?.some(detail =>
        selectedFilters.colors.some(colorFilter => {
          return detail.colors?.hex === colorFilter;
        })
      );
      if (!hasMatchingColor) {
        isFiltered = false;
      }
    }
  
    if (selectedFilters.sizes && selectedFilters.sizes.length > 0) {
      const hasMatchingSize = product.Product_detail?.some(detail =>
        selectedFilters.sizes.includes(detail.sizeId)
      );
      if (!hasMatchingSize) {
        isFiltered = false;
      }
    }
  
    return isFiltered;
  });
  
  

  // Hàm xử lý sắp xếp
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  // Sắp xếp danh sách sản phẩm theo tiêu chí chọn
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'price-asc':
        return (a.Product_detail?.[0]?.price || 0) - (b.Product_detail?.[0]?.price || 0);
      case 'price-desc':
        return (b.Product_detail?.[0]?.price || 0) - (a.Product_detail?.[0]?.price || 0);
      case 'newest':
        return new Date(b.createTime) - new Date(a.createTime);
      default:
        return 0;
    }
  });

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Tính toán số lượng trang
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(sortedProducts.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const pageRange = (currentPage) => {
    const totalPages = pageNumbers.length;
    let startPage = Math.max(1, currentPage - 2); // Bắt đầu từ trang hiện tại - 2
    let endPage = Math.min(totalPages, currentPage + 2); // Kết thúc từ trang hiện tại + 2

    // Nếu đang ở trang đầu, hiển thị ít nhất 5 trang
    if (currentPage === 1) {
      endPage = Math.min(2, totalPages);
    }

    // Nếu đang ở trang cuối, hiển thị trang cuối cộng với 4 trang trước đó
    if (currentPage === totalPages) {
      startPage = Math.max(totalPages - 2, 1);
    }

    return pageNumbers.slice(startPage - 1, endPage);
  };

  const pageItems = pageRange(currentPage);

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
    // const imageUrlBase = '../../../../../Asset/Logo/';
    const imageFileName = product.imageUrl;
    const imageUrl = `${imageFileName}`;
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
        <div className={styles.iconWrapper}>
          <i className="fa fa-heart" title="Yêu thích"></i> 
          <Link to={`/productdetail/${product.id}`}>
            <i className="fa fa-eye" title="Chi tiết"></i>
          </Link>
        </div>
      </div>
    );
  };

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.featuredProducts} style={{ marginTop: '70px' }}>
      <div className="container">
        <div className="row" style={{ marginTop: '50px' }}>
          <div className="col-12">
            <div className={styles['sort-dropdown-wrapper']}>
              <select
                className="form-select"
                value={sortBy}
                onChange={handleSortChange}
              >
                <option value="name-asc">Sắp xếp theo tên A-Z</option>
                <option value="name-desc">Sắp xếp theo tên Z-A</option>
                <option value="price-asc">Sắp xếp theo giá tăng dần</option>
                <option value="price-desc">Sắp xếp theo giá giảm dần</option>
                <option value="newest">Sắp xếp theo ngày ra</option>
              </select>
            </div>
          </div>

          <div className="row g-4">
            {currentProducts.map((product) => (
              <div key={product.id} className="col-md-4 col-sm-6 col-12">
                <div className={styles.productCard}>
                  {renderImage(product)}
                  <p className={styles.warranty} style={{ textAlign: 'center', paddingTop:'15px' }}>
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
      <div className="d-flex justify-content-center mt-4">
        <button
          className="btn btn-secondary me-2"
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <i className="fa fa-angle-left"></i>
        </button>

        {currentPage > 3 && (
          <>
            <button className="btn btn-secondary me-2" onClick={() => paginate(1)}>
              1
            </button>
            <span className="btn btn-secondary me-2">...</span>
          </>
        )}

        {pageItems.map((number) => (
          <button
            key={number}
            className={`btn btn-secondary me-2 ${currentPage === number ? 'active' : ''}`}
            onClick={() => paginate(number)}
          >
            {number}
          </button>
        ))}

        {currentPage < pageNumbers.length - 2 && (
          <>
            <span className="btn btn-secondary me-2">...</span>
            <button className="btn btn-secondary me-2" onClick={() => paginate(pageNumbers.length)}>
              {pageNumbers.length}
            </button>
          </>
        )}

        <button
          className="btn btn-secondary ms-2"
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === pageNumbers.length}
        >
          <i className="fa fa-angle-right"></i>
        </button>
      </div>
    </div>
  );
};

export default ListProducts;
