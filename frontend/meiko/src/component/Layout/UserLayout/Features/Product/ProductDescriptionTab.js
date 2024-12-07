import { useState } from "react";
import Title from "../common/Title";
import styles from "./ProductDescriptionTab.module.css";

const productDescriptionTabHeads = [
  {
    id: "tab-description",
    tabHead: "tabDescription",
    tabText: "Mô Tả Sản Phẩm",
    badgeValue: null,
    badgeColor: "",
  },
  {
    id: "tab-comments",
    tabHead: "tabComments",
    tabText: "Bình luận người dùng",
    badgeValue: null,
    badgeColor: "purple",
  },
  {
    id: "tab-QNA",
    tabHead: "tabQNA",
    tabText: "Câu hỏi & trả lời",
    badgeValue: null,
    badgeColor: "outerspace",
  },
];

const ProductDescriptionTab = () => {
  const [activeDesTab, setActiveDesTab] = useState(
    productDescriptionTabHeads[0].tabHead
  );

  const handleTabChange = (tabHead) => {
    setActiveDesTab(tabHead);
  };

  return (
    <div className={styles.detailsContent}>
      <Title titleText={"Mô Tả Sản Phẩm"} />
      <div className={`d-flex flex-column flex-lg-row ${styles.detailsContentWrapper}`}>
        <div className={`col-lg-8 me-5 d-flex flex-column ${styles.tabsWrapper}`}>
          {/* Phần header */}
          <div className={styles.tabsHeads}>
            {productDescriptionTabHeads.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`${styles.tabsHead} ${tab.tabHead === activeDesTab ? styles.tabsHeadActive : ""}`}
                onClick={() => handleTabChange(tab.tabHead)}
              >
                <span>{tab.tabText}</span>
                {tab.badgeValue && (
                  <span
                    className={`${styles.tabsBadge} ${styles[`tabsBadge${tab.badgeColor}`]}`}
                  >
                    {tab.badgeValue}
                  </span>
                )}
              </button>
            ))}
          </div>
          {/* Phần nội dung */}
          <div className={styles.tabsContents}>
            <div
              className={`${styles.tabsContent} ${activeDesTab === "tabDescription" ? styles.show : ""}`}
            >
              <div className={styles.contentStylings}>
                <p>
                  Chất liệu 100% cotton đã được xử lý sinh học giúp vải mềm mại và mịn màng.
                </p>
                <h4>Thông số kỹ thuật:</h4>
                <ul>
                  <li>Chất liệu: Cotton đã qua xử lý sinh học</li>
                  <li>Họa tiết: In</li>
                  <li>Kiểu dáng: Regular-fit</li>
                  <li>Cổ áo: Cổ tròn</li>
                  <li>Tay áo: Tay ngắn</li>
                  <li>Phong cách: Dành cho trang phục hàng ngày</li>
                </ul>
                <p>*Lưu ý: Vui lòng điền số điện thoại chính xác.</p>
                <h4>Tại sao nên mua sắm tại Outfit store?</h4>
                <ul>
                  <li>Chất lượng vật liệu đảm bảo</li>
                  <li>Công nghệ may chính xác.</li>
                </ul>
                <p>
                Bản thân công ty đã là một công ty rất thành công. Những người may mắn hiện tại của chúng ta không bị dịu dàng bởi bất kỳ sự dịu dàng nào, họ không bỏ rơi những người khác sắc bén hơn một cách chính đáng, bởi vì họ bị niềm vui của tâm trí nắm giữ! Chuyến bay này có được tạo điều kiện bởi một số ham muốn cuộc sống? Tôi ghét nó, nó có làm phiền bạn không?
                </p>
              </div>
            </div>
            <div
              className={`${styles.tabsContent} ${activeDesTab === "tabComments" ? styles.show : ""}`}
            >
              Bình luận người dùng ở đây.
            </div>
            <div
              className={`${styles.tabsContent} ${activeDesTab === "tabQNA" ? styles.show : ""}`}
            >
              Câu hỏi & Trả lời
            </div>
          </div>
        </div>
        <div className="col-lg-4  ">
        </div>
      </div>
    </div>
  );
};

export default ProductDescriptionTab;
