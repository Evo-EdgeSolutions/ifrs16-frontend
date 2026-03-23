import React, { forwardRef, InputHTMLAttributes } from "react";
import styles from "./InputField.module.scss";
import { Heading } from "../Heading/Heading";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <div className={styles.inputGroup}>
        <Heading level="h5">{label}</Heading>
        <input
          ref={ref}
          className={`${styles.input} ${error ? styles.inputError : ""}`}
          {...props}
        />
        {error && <span className={styles.errorText}>{error}</span>}
      </div>
    );
  },
);

InputField.displayName = "InputField";
