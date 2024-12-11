import React, { useState, useEffect } from 'react';
import ProductReviews from './ProductReview';
import Title from "../common/Title";
import styles from "./ProductDescriptionTab.module.css";
import { Spinner } from 'react-bootstrap'; // Sử dụng Spinner từ react-bootstrap

const productDescriptionTabHeads = [
  {
    id: "tab-description",
    tabHead: "tabDescription",
    tabText: "Mô Tả Sản Phẩm",
  },
  {
    id: "tab-comments",
    tabHead: "tabComments",
    tabText: "Bình luận người dùng",
  },
  {
    id: "tab-QNA",
    tabHead: "tabQNA",
    tabText: "Câu hỏi & trả lời",
  },
];

const ProductDescriptionTab = ({ productId }) => {
  const [activeDesTab, setActiveDesTab] = useState(productDescriptionTabHeads[0].tabHead);
  const [product, setProduct] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch(`https://localhost:7172/api/Product/Get/${productId}`);
        if (!response.ok) {
          throw new Error('Không thể lấy dữ liệu sản phẩm');
        }
        const data = await response.json();
        setProduct(data);  
        setLoading(false); 
      } catch (error) {
        console.error(error);
        setLoading(false);  
      }
    };

    fetchProductData();
  }, [productId]);

  const handleTabChange = (tabHead) => {
    setActiveDesTab(tabHead);
  };

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </Spinner>
      </div>
    );
  }

  if (!product) {
    return <div className="text-center">Không tìm thấy sản phẩm.</div>;
  }

  return (
    <div className={styles.detailsContent}>
      <Title titleText={product.name} />
      <div className={`d-flex flex-column flex-lg-row ${styles.detailsContentWrapper}`}>
        <div className={`col-lg-8 me-5 d-flex flex-column ${styles.tabsWrapper}`}>
          {/* Tab Header */}
          <div className={styles.tabsHeads}>
            {productDescriptionTabHeads.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`${styles.tabsHead} ${tab.tabHead === activeDesTab ? styles.tabsHeadActive : ""}`}
                onClick={() => handleTabChange(tab.tabHead)}
              >
                <span>{tab.tabText}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className={styles.tabsContents}>
            <div
              className={`${styles.tabsContent} ${activeDesTab === "tabDescription" ? styles.show : ""}`}
            >
              <div className={styles.contentStylings}>
                <h4>Thông số kỹ thuật:</h4>
                <ul>
                  <li><strong>Mã sản phẩm:</strong> {product.productCode}</li>
                  <li><strong>Chất liệu:</strong> {product.materials.name}</li>
                  <li><strong>Thương hiệu:</strong> {product.brands.name}</li>
                  <li><strong>Bảo hành:</strong> {product.warrantyPeriod}</li>
                </ul>
                <p><strong>*Lưu ý:</strong> Vui lòng điền số điện thoại chính xác.</p>
                <h4>Tại sao nên mua sắm tại Outfit store?</h4>
                <ul>
                  <li>Chất lượng vật liệu đảm bảo</li>
                  <li>Công nghệ may chính xác</li>
                </ul>
                <p>{product.description}</p>
              </div>
            </div>
            <div
              className={`${styles.tabsContent} ${activeDesTab === "tabComments" ? styles.show : ""}`}
            >
              <ProductReviews productId={productId} />
            </div>
            <div
              className={`${styles.tabsContent} ${activeDesTab === "tabQNA" ? styles.show : ""}`}
            >
              Câu hỏi & Trả lời
            </div>
          </div>
        </div>
        <div className="col-lg-4">
        </div>
      </div>
    </div>
  );
};

export default ProductDescriptionTab;
