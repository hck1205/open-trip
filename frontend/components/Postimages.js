import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { PlusOutlined } from "@ant-design/icons";
import ImagesZoom from "./imagesZoom";

const PostImages = ({ images }) => {
  const [showImagesZoom, setShowImagesZoom] = useState(false);

  const onZoom = useCallback(() => {
    setShowImagesZoom(true);
  }, []);

  const onClose = useCallback(() => {
    setShowImagesZoom(false);
  }, []);

  if (images.length === 1) {
    return (
      <>
        <img src={`http://localhost:3065/${images[0].src}`} onClick={onZoom} />
        {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
      </>
    );
  }

  if (images.length === 2) {
    return (
      <>
        <div onClick={onZoom}>
          <img src={`http://localhost:3065/${images[0].src}`} width="50%" />
          <img src={`http://localhost:3065/${images[1].src}`} width="50%" />
        </div>
        {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
      </>
    );
  }

  return (
    <>
      <div onClick={onZoom}>
        <img src={`http://localhost:3065/${images[0].src}`} width="50%" />
        <div
          style={{
            display: "inline-block",
            width: "50%",
            textAlign: "center",
            verticalAlign: "middle",
          }}
          onClick={onZoom}
        >
          <PlusOutlined />
          <br />
          {images.length - 1}개의 사진 더 보기
        </div>
      </div>
      {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
    </>
  );
};

PostImages.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string,
    })
  ).isRequired,
  //   또는
  //   images: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default PostImages;
