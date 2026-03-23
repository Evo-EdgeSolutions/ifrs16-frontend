import React, { forwardRef, SelectHTMLAttributes } from 'react';
import styles from './SelectField.module.scss';

export interface SelectOption {
  label: string;
  value: string | number;
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, options, error, placeholder, ...props }, ref) => {
    return (
      <div className={styles.inputGroup}>
        <label className={styles.label}>{label}</label>
        <div className={styles.selectWrapper}>
          <select 
            ref={ref} 
            className={`${styles.select} ${error ? styles.selectError : ''}`} 
            defaultValue=""
            {...props}
          >
            {placeholder && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {error && <span className={styles.errorText}>{error}</span>}
      </div>
    );
  }
);

SelectField.displayName = 'SelectField';