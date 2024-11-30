import React from 'react';
import 'font-awesome/css/font-awesome.min.css';
import styles from './FeaturedProducts.module.css'; 

const BestSellingProducts = () => {
  // Dữ liệu sản phẩm bán chạy nhất
  const bestSellingProducts = [
    {
      id: 1,
      name: 'Sản phẩm A',
      price: '500.000đ',
      imgUrl: 'https://bizweb.dktcdn.net/100/420/837/products/img-4514-1667270307489.jpg?v=1696476590613',
      description: 'Đây là mô tả sản phẩm A, rất tuyệt vời',
      discount: true,
      sold: 350, // Số lượng đã bán
    },
    {
      id: 2,
      name: 'Sản phẩm B',
      price: '650.000đ',
      imgUrl: 'https://bizweb.dktcdn.net/100/420/837/products/img-4514-1667270307489.jpg?v=1696476590613',
      description: 'Sản phẩm B mang lại sự thoải mái tuyệt vời',
      discount: false,
      sold: 450,
    },
    {
      id: 3,
      name: 'Sản phẩm C',
      price: '700.000đ',
      imgUrl: 'https://bizweb.dktcdn.net/100/420/837/products/img-4514-1667270307489.jpg?v=1696476590613',
      description: 'Đừng bỏ lỡ sản phẩm C với chất lượng tuyệt hảo',
      discount: true,
      sold: 500,
    },
    {
      id: 4,
      name: 'Sản phẩm D',
      price: '450.000đ',
      imgUrl: 'https://bizweb.dktcdn.net/100/420/837/products/img-4514-1667270307489.jpg?v=1696476590613',
      description: 'Sản phẩm D với giá tốt, chất lượng ổn',
      discount: false,
      sold: 550,
    },
  ];

  return (
    <div className={styles.bestSellingProducts} style={{marginTop: '100px'}}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Sản phẩm bán chạy nhất</h2>
        <div className="row" style={{marginTop: '50px'}}>
          {bestSellingProducts.map((product) => (
            <div key={product.id} className="col-md-3">
              <div className={styles.productCard}>
                <div className={styles.productImgWrapper}>
                  {product.discount && (
                    <span className={styles.discountTag}>
                      {product.discount}% Giảm giá
                    </span>
                  )}
                  <img
                    src={product.imgUrl}
                    alt={product.name}
                    className={styles.productImg}
                  />
                  <div className={styles.iconWrapper}>
                    <i className="fa fa-heart" title="Yêu thích"></i>
                    <i className="fa fa-shopping-cart" title="Giỏ hàng"></i>
                    <i className="fa fa-eye" title="Chi tiết"></i>
                  </div>
                </div>
                <h3 className={styles.productName}>{product.name}</h3>
                <div className={styles.priceWrapper}>
                  {product.discount && (
                    <p className={styles.originalPrice}>
                      Giá gốc: <del>{product.originalPrice}₫</del>
                    </p>
                  )}
                  <p className={styles.currentPrice}>
                    {product.price}₫
                  </p>
                </div>
                <p className={styles.sold}>
                  Đã bán: {product.sold} sản phẩm
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BestSellingProducts;
