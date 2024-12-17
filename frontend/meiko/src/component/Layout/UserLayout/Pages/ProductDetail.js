import { useState, useEffect } from "react";
import { Container } from "../styles/styles";
import Breadcrumb from "../Features/common/Breadcrumb";
import ProductPreview from "../Features/Product/ProductPreview";
import { useParams, useNavigate } from "react-router-dom";
import ProductDescriptionTab from "../Features/Product/ProductDescriptionTab";
import RelatedProducts from '../Features/Product/RelatedProducts';
import styles from "./ProductDetails.module.css";
import { ToastContainer, toast } from 'react-toastify';

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [availableQuantity, setAvailableQuantity] = useState(0);

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

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`https://localhost:7172/api/Review/${productId}`);
        if (!response.ok) throw new Error('Không thể tải đánh giá');
        const data = await response.json();
        setReviews(data);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      }
    };
    fetchReviews();
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

  if (error) return <div className={styles.error}>{error}</div>;
  if (!product) return <div className={styles.notFound}>Không tìm thấy sản phẩm</div>;

  const productDetails = product.Product_detail || [];
  const detailImages = productDetails.flatMap(detail => detail.images.map(image => image.imgUrl)); 
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
        toast.error("Vui lòng đăng nhập để tiếp tục mua hàng.");
        navigate('/SignIn');
        return;
      }
      if (!selectedSize || !selectedColor) {
        alert("Vui lòng chọn màu và kích thước hợp lệ.");
        return;
      }
      
      if (availableQuantity === 0) {
        alert("Sản phẩm này đã hết hàng.");
        return;
      }
      const selectedProductDetail = product.Product_detail?.find(
        (detail) => detail.sizes.name === selectedSize && detail.colors.name === selectedColor
      );
    
      if (!selectedProductDetail) {
        toast.error("Sản phẩm không hợp lệ hoặc không tồn tại.");
        return;
      }
  
    const customerId = localStorage.getItem("customerId");
    if (!customerId) {
      toast.error("Không tìm thấy thông tin khách hàng.");
      return;
    }
  
    try {
      const cartResponse = await fetch(`https://localhost:7172/api/Carts/${customerId}`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` },
      });
  
      if (!cartResponse.ok) {
        const errorText = await cartResponse.text();
        toast.error(`Không thể lấy giỏ hàng của bạn: ${errorText}`);
        return;
      }
  
      const cartData = await cartResponse.json();
      if (!cartData || !cartData.id) {
        toast.error("Không có giỏ hàng cho tài khoản này.");
        return;
      }
  
      const cartId = cartData.id;
  
      if (!selectedSize || !selectedColor) {
        toast.error("Vui lòng chọn màu và kích thước hợp lệ.");
        return;
      }
  
      const selectedProductDetail = product.Product_detail?.find(
        (detail) => detail.sizes.name === selectedSize && detail.colors.name === selectedColor
      );
      let imageUrlToUse = '';
      if (selectedProductDetail) {
        if (selectedProductDetail.images && selectedProductDetail.images.length > 0) {
          imageUrlToUse = selectedProductDetail.images[0].imgUrl;
        } else {
          imageUrlToUse = product.imageUrl; // Sử dụng ảnh mặc định của sản phẩm
        }
      } else {
        toast.error("Sản phẩm không hợp lệ hoặc không tồn tại.");
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
        toast.error(`Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng: ${responseText}`);
        return;
      }
  
      if (responseText.includes("Đã thêm")) {
        window.dispatchEvent(new Event("cartUpdated"));
        alert(responseText);
      } else {
        toast.error(`Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng: ${responseText}`);
      }
  
    } catch (error) {
      toast.error("Error adding to cart:", error);
      toast.error("Có lỗi xảy ra khi thêm sản phẩm vào giỏ.");
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

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return totalRating / reviews.length;
  };

  // Render star rating based on average rating
  const renderStarRating = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < Math.floor(rating)) {
        stars.push("fa fa-star text-warning");
      } else if (i < Math.ceil(rating)) {
        stars.push("fa fa-star-half text-warning");
      } else {
        stars.push("fa fa-star-o text-warning");
      }
    }
    const commentCount = reviews.length;
    return (
      <div className="d-flex align-items-center">
        {stars.map((starClass, index) => (
          <span key={index} className={starClass}></span>
        ))}
        <span className="ms-2 text-muted">({rating})</span>
      </div>
    );
  };
  const breadcrumbItems = [
    { label: "Shop", link: "" },
    { label: "Women", link: "" },
    { label: "Top", link: "" },
  ];

  return (
    <main className="my-4">
      <div style={{ marginTop: "150px" }}>
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <Container>
        <div className="row">
          {/* ProductPreview nằm bên trái */}
          <div className="col-12 col-lg-6">
            <ProductPreview 
              mainImage={imageUrl}          
              detailImages={detailImages}  
              selectedImageIndex={selectedImageIndex} 
              onSelectImage={handleSelectImage} 
            />
          </div>

          <div className="col-12 col-lg-6 border p-4 rounded-3" style={{ marginTop: "60px", backgroundColor: "#fff" }}>
            <h2 className={styles.prodTitle}>{product.name}</h2>
            <div className={`${styles.ratingAndComments} flex-wrap mb-2`}> 
              <div className={styles.prodRating}>
                {renderStarRating(calculateAverageRating())}
              </div>
              <div className={styles.prodComments}>
                <span className="prod-comment-icon text-muted me-1">
                  <i className="fa fa-comment"></i>
                </span>
                <span className="prod-comment-text text-sm text-muted">
                  {reviews.length} bình luận(s)
                </span>
              </div>
            </div>

            {/* Product Size Section */}
            <div className={styles.prodSizeWrapper}>
              <div className={styles.prodSizeTop}>
                <p style={{ color: "#777777", fontWeight: "bold", fontSize: "17px" }} className="">
                  Chọn kích thước
                </p>
              </div>
              <div className={styles.prodSizeList}>
                {sizes.length > 0 ? (
                  sizes.map((size, index) => (
                    <div className={styles.prodSizeItem} key={index}>
                      <input
                        type="radio"
                        name="size"
                        id={`size-${index}`}
                        className="d-none"
                        onChange={() => setSelectedSize(size)}
                        checked={selectedSize === size}
                      />
                      <label
                        htmlFor={`size-${index}`}
                        className={`${styles.prodSizeLabel} ${selectedSize === size ? styles.prodSizeSelected : ""}`}
                      >
                        <span className="text-outerspace font-medium">{size}</span>
                      </label>
                    </div>
                  ))
                ) : (
                  <span>Không có kích thước khả dụng</span>
                )}
              </div>
            </div>

            {/* Product Color Section */}
            <div className={styles.prodColorWrapper}>
              <div className={styles.prodColorsTop}>
                <p style={{ color: "#777777", fontWeight: "bold", fontSize: "17px" }} className="">
                  Chọn màu sắc
                </p>
              </div>
              <div className={styles.prodColorsList}>
                {colors.length > 0 ? (
                  colors.map((color, index) => {
                    const colorDetail = product.Product_detail.find(detail => detail.colors.name === color);
                    const colorHex = colorDetail ? colorDetail.colors.hex : '#ccc'; 
                    return (
                      <div className={styles.prodColorItem} key={index}>
                        <input
                          type="radio"
                          name="color"
                          id={`color-${index}`}
                          className="d-none"
                          onChange={() => setSelectedColor(color)}
                          checked={selectedColor === color}
                        />
                        <label
                          htmlFor={`color-${index}`}
                          className={`${styles.prodColorbox} ${selectedColor === color ? styles.prodColorSelected : ""}`}
                          style={{ backgroundColor: colorHex }} // Cập nhật màu sắc từ hex
                        ></label>
                      </div>
                    );
                  })
                ) : (
                  <span>Không có màu sắc khả dụng</span>
                )}
              </div>
            </div>
            {/* Quantity Section */}
            <div className={styles.prodQuantityWrapper} style={{marginTop:"15px"}}>
              <div className={styles.prodQuantityTop}>
                <p style={{ color: "#777777", fontWeight: "bold", fontSize: "17px" }}>
                  Số lượng: {availableQuantity}
                </p>
              </div>
              <div className={styles.prodQuantityControl}>
                <button
                  onClick={handleDecreaseQuantity}
                  className="btn btn-outline-secondary"
                  style={{ fontSize: "20px", width: "40px", height: "40px", padding: "0" }}
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  min="1"
                  max={availableQuantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(availableQuantity, parseInt(e.target.value))))}
                  className="form-control text-center"
                  style={{ width: "60px", display: "inline-block" }}
                />
                <button
                  onClick={handleIncreaseQuantity}
                  className="btn btn-outline-secondary"
                  style={{ fontSize: "20px", width: "40px", height: "40px", padding: "0" }}
                >
                  +
                </button>
              </div>
            </div>
            {/* Add to Cart and Price */}
            <div className={styles.btnAndPrice}>
              <button
                onClick={handleAddToCart}
                className="prodAddBtn d-flex align-items-center btn btn-success text-white  px-4 py-2"
                style={{ transition: "all 0.3s ease" }}
              >
                <i className="fa fa-shopping-cart fa-2x me-4"></i>
                <span className="prod-add-btn-text">Thêm vào giỏ</span>
              </button>
              <span className={`${styles.prodPrice} ms-2`}>
                {availableQuantity === 0 ? (
                  <span className="text-danger" style={{ fontWeight: 'bold' }}>
                  </span>
                ) : (
                  <>
                    <span className={`${styles.prodPrice}`}>
                      {discountedPrice !== null ? (
                        <>
                          <span style={{ color: "red" }} className={styles.discountedPrice}>
                            {discountedPrice.toLocaleString('vi-VN')} VND
                          </span>
                          <span className={`${styles.originalPrice} text-muted mx-2`} style={{ textDecoration: "line-through" }}>
                            {selectedPrice !== null ? selectedPrice.toLocaleString('vi-VN') : '0'} VND
                          </span>
                          <span style={{ color: "#5bc0de" }} className={styles.discountPercentage}>
                            {discountPercentage !== null ? `(-${discountPercentage}%)` : ''}
                          </span>
                        </>
                      ) : (
                        <span>{selectedPrice !== null ? selectedPrice.toLocaleString('vi-VN') : '0'} VND</span>
                      )}
                    </span>
                  </>
                )}
              </span>
            </div>
            <hr />
            <div className="row mt-5">
              <div className="col-6 d-flex align-items-center mb-2">
                <i className={`${styles.iconWrapper} fa fa-credit-card fa-lg fa-2x me-3`}></i>
                <span className="text-muted">Thanh toán bảo mật</span>
              </div>
              <div className="col-6 d-flex align-items-center mb-2">
                <i className={`${styles.iconWrapper} fa fa-square fa-2x me-3`}></i>
                <span className="text-muted">Kích cỡ</span>
              </div>
              <div className="col-6 d-flex align-items-center mb-2">
                <i className={`${styles.iconWrapper} fa fa-truck fa-2x me-3`}></i>
                <span className="text-muted">Vận chuyển miễn phí</span>
              </div>
              <div className="col-6 d-flex align-items-center mb-2">
                <i className={`${styles.iconWrapper} fa fa-refresh fa-2x me-3`}></i>
                <span className="text-muted">Vận chuyển & trả lại miễn phí</span>
              </div>
            </div>
          </div>
        </div>
        <ProductDescriptionTab productId={productId} />
        <RelatedProducts brandId={product.brandId} />
      </Container>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </main>
  );
};

export default ProductDetails;
