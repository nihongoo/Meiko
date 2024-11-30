import styles from '../Navbar/index.module.css';

const Breadcrumb = () => {
  return (
    <div id="shopify-section-breadcrumb" className="shopify-section" style={{marginTop: '160px'}}>
      {/* Breadcrumb Area */}
      <div className={styles["breadcrumb-area"]}>
        <div className={`${styles.breadcrumbs} ${styles["overlay-bg"]}`}>
          <div className={styles.container}>
            <div className={styles.row}>
              <div className={styles["col-12"]}>
                <div className={styles["breadcrumb-wrap"]}>
                  <nav role="navigation" aria-label="breadcrumb">
                    <ul className={`${styles.breadcrumb} ${styles["breadcrumb-list"]}`}>
                      <li className={styles["breadcrumb-item"]}>
                        <a href="/" title="Back to the home page">
                          <i className="fa fa-home"></i>
                        </a>
                      </li>
                      <li style={{paddingLeft: '10px'}}>
                        <span>/</span>
                      </li>
                      <li className={styles["breadcrumb-item"]}>
                        <span>Products</span>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
