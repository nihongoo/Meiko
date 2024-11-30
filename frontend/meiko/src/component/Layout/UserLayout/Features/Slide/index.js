import styles from "../../main_styles.module.css";

const Slider = () => {
  return (
    <div
      className={styles.main_slider}
      style={{ backgroundImage: 'url(images/slider_1.jpg)', marginTop: '300px' }}
    >
      <div className={`container ${styles.fillHeight}`}>
        <div className={`row ${styles.alignItemsCenter} ${styles.fillHeight}`}>
          <div className="col">
            <div className={styles.mainSliderContent}>
              <h6>Bộ Sưu Tập Mùa Xuân / Hè 2024</h6>
              <h1>Giảm Giá 30% Cho Các Sản Phẩm Mới</h1>
              <div className={`${styles.redButton} ${styles.shopNowButton}`}>
                <a href="#">Mua Ngay</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slider;
