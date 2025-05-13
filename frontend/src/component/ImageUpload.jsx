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
  imgFile: controlledImgFile, // received from parent
}) => {
  const [imgFile, setImgFile] = useState(controlledImgFile || null);
  const [preview, setPreview] = useState(null);

  // Update local imgFile when parent-controlled file changes
  useEffect(() => {
    setImgFile(controlledImgFile || null);
  }, [controlledImgFile]);

  // Generate preview URL
  useEffect(() => {
    if (imgFile) {
      const objectUrl = URL.createObjectURL(imgFile);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  }, [imgFile]);

  const handleChange = (e) => {
    const file = e.target.files?.[0] || null;
    setImgFile(file);
    onChange?.(file); // notify parent
  };

  return (
    <div className={cns(styles.uploadWrapper, className)}>
      <label htmlFor={id} className={cns(styles.uploadButton, styles[shape])}>
        {preview ? (
          <div className={styles.previewContainer}>
            <img src={preview} alt="Preview" className={styles.previewImage} />
            <div className={styles.overlay}>
              <span className={shape === "circle" || shape === "square" ? styles.smaller : ""}>
                Change Image
              </span>
            </div>
          </div>
        ) : (
          <div className={styles.uploadText}>
            {shape === "circle" || shape === "square" ? <IconCamera style={{ fontSize: '2.4rem' }} /> : <IconUpload />}
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