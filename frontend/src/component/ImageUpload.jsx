import { useState, useEffect } from "react";
import styles from "./ImageUpload.module.css";
import { IconUpload } from "./icons/IconUpload";
import { IconCamera } from "./icons/IconCamera";
import { cns } from "../utils/classNames";

const ImageUpload = ({
  id,
  ImgUploadText,
  onChange,
  className,
  shape = "default",
  imgFile: controlledImgFile,
  currentImage,
  isUploading = false,
}) => {
  const [imgFile, setImgFile] = useState(controlledImgFile || null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    setImgFile(controlledImgFile || null);
  }, [controlledImgFile]);

  useEffect(() => {
    if (imgFile) {
      const objectUrl = URL.createObjectURL(imgFile);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (currentImage) {
      setPreview(currentImage);
    } else {
      setPreview(null);
    }
  }, [imgFile, currentImage]);

  const handleChange = (e) => {
    const file = e.target.files?.[0] || null;
    setImgFile(file);
    onChange?.(file); 
  };

  return (
    <div className={cns(styles.uploadWrapper, className)}>
      <label htmlFor={id} className={cns(styles.uploadButton, styles[shape])}>
        {isUploading ? (
          <div className={styles.uploadText}>
            <div className={styles.loadingSpinner}></div>
            <h3>Uploading...</h3>
          </div>
        ) : preview ? (
          <div className={styles.previewContainer}>
            <img src={preview} alt="Preview" className={styles.previewImage} />
            <div className={styles.overlay}>
              <span className={shape === "circle" || shape === "square" ? styles.smaller : ""}>
                {imgFile ? "Change Image" : "Update Image"}
              </span>
            </div>
          </div>
        ) : (
          <div className={styles.uploadText}>
            {shape === "circle" || shape === "square" ? <IconCamera style={{ fontSize: '2.4rem' }} /> : <IconUpload />}
            <h3>{ImgUploadText || "Upload Image"}</h3>
          </div>
        )}

        <input
          type="file"
          id={id}
          accept="image/*"
          onChange={handleChange}
          className={styles.fileInput}
          disabled={isUploading}
        />
      </label>
    </div>
  );
};

export default ImageUpload;