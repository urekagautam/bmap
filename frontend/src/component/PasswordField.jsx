import React, { forwardRef, useState } from 'react';
import { cns } from '../utils/classNames';
import { IconEyeOpen } from './icons/IconEyeOpen';
import styles from './PasswordField.module.css';
import { IconEyeClosed } from './icons/IconEyeClosed';

const PasswordField = forwardRef(
    ({
        type = "basic",
        layout = "md",
        className = "",
        error,
        ...props }, ref) => {
        const [show, setShow] = useState(false);

        return (
            <div>
                <div className={cns(
                    styles[type],
                    styles[layout],
                    className,
                    styles.passwordContainer,
                    error ? styles.error : "",
                )}>
                    <input
                        className={styles.inpPassword}
                        type={show ? "text" : "password"}
                        placeholder="Enter your password"
                        ref={ref}
                        {...props}
                    />
                    <div className={styles.icons} onClick={() => setShow(!show)}>
                        {show ? <IconEyeOpen /> : <IconEyeClosed />}
                    </div>
                </div>

                {error && (
                    <span className={styles.errorMessage}>
                        {error}
                    </span>
                )}
            </div>
        );
    }
);

export default PasswordField;