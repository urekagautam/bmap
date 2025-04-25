import { useState, useEffect } from "react";
import styles from "./ImageUpload.module.css";
import { IconUpload } from "./icons/IconUpload";
import { cns } from "../utils/classNames";

const ImageUpload = ({ id, ImgUploadText, onChange, className }) => {
  const [imgFile, setImgFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (imgFile) {
      const objectUrl = URL.createObjectURL(imgFile);
      setPreview(objectUrl);
      // Cleaning up the object URL
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  }, [imgFile]);

  const handleChange = (e) => {
    const file = e.target.files?.[0] || null;
    setImgFile(file);
  };

  return (
    <div className={cns(styles.uploadWrapper, className, "")}>
      <label className={styles.uploadButton} htmlFor={id}>
        {preview ? (
          <div className={styles.previewContainer}>
          <img src={preview} alt="Preview" className={styles.previewImage} />
          <div className={styles.overlay}>
            <span>Change Image</span>
          </div>
        </div>
        ) : (
          <div className={styles.uploadText}>
            <IconUpload />
            <h3>{ImgUploadText}</h3>
          </div>
        )}
  
        <input
          type="file"
          id={id}
          accept="image/*"
          onChange={handleChange}
          className={styles.fileInput}
        />
      </label>
    </div>
  );
  
};

export default ImageUpload;
