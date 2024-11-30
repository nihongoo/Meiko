import React from 'react';
import styles from '../../main_styles.module.css';

const Banner = () => {
  return (
    <div className={styles.banner} style={{marginTop: '60px'}}>
      <div className="container">
        <div className="row">
          {/* Nam giới */}
          <div className="col-md-4">
            <div className={styles.bannerItem} style={{ backgroundColor: '#ffe6e6' }}>
              <div className={styles.bannerOverlay}>
                <h3 className={styles.bannerTitle}>Nam giới</h3>
                <p className={styles.bannerDescription}>Thời trang lịch lãm cho phái mạnh</p>
                <a href="categories.html" className={styles.bannerButton}>
                  Khám phá
                </a>
              </div>
            </div>
          </div>

          {/* Phụ kiện */}
          <div className="col-md-4">
            <div className={styles.bannerItem} style={{ backgroundColor: '#d6eaff' }}>
              <div className={styles.bannerOverlay}>
                <h3 className={styles.bannerTitle}>Phụ kiện</h3>
                <p className={styles.bannerDescription}>Phụ kiện thời trang cho mọi phong cách</p>
                <a href="categories.html" className={styles.bannerButton}>
                  Khám phá
                </a>
              </div>
            </div>
          </div>

          {/* Nữ giới */}
          <div className="col-md-4">
            <div className={styles.bannerItem} style={{ backgroundColor: '#fff6cc' }}>
              <div className={styles.bannerOverlay}>
                <h3 className={styles.bannerTitle}>Nữ giới</h3>
                <p className={styles.bannerDescription}>Thời trang tinh tế và quyến rũ</p>
                <a href="categories.html" className={styles.bannerButton}>
                  Khám phá
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
