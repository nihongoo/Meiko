import PropTypes from "prop-types";
import { useState, useEffect } from "react";

const ProductPreview = ({ mainImage, detailImages, selectedImageIndex, onSelectImage }) => {
  const [activePreviewImage, setActivePreviewImage] = useState(mainImage || (detailImages && detailImages[0]) || null);

  const handlePreviewImageChange = (previewImage, index) => {
    setActivePreviewImage(previewImage);
    onSelectImage(previewImage, index);
  };

  if (!detailImages || detailImages.length === 0) {
    return (
      <div className="container d-flex align-items-center">
        <div className="preview-display" style={{ height: "650px", overflow: "hidden" }}>
          <img
            src={mainImage}
            alt="Main product image"
            className="img-fluid object-fit-cover"
            style={{ width: "85%", height: "75%", marginTop:"60px", marginLeft:"95px" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container d-flex align-items-center">
      <div className="row w-100">
        <div className="col-12 col-md-2 mb-3" style={{ marginTop: "50px" }}>
          <div
            className="d-flex flex-column gap-3"
            style={{
              marginTop: "60px",
              maxHeight: "400px",
              overflowY: "auto",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {detailImages.map((previewImage, index) => (
              <div
                className="preview-item-wrapper p-2"
                key={index}
                onClick={() => handlePreviewImageChange(previewImage, index)}
                style={{ width: "80px", height: "70px", cursor: "pointer"}}
              >
                <div className="preview-item rounded-3 overflow-hidden">
                  <img
                    src={previewImage}
                    alt={`Thumbnail ${index}`}
                    className="img-fluid object-fit-cover"
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-12 col-md-10" style={{ marginTop: "60px" }}>
          <div
            className="preview-display"
            style={{
              height: "500px",
              overflow: "hidden",
            }}
          >
            <img
              src={activePreviewImage}
              alt="Selected preview"
              className="img-fluid object-fit-cover"
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPreview;
