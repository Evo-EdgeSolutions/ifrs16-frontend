import React from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import base styles
import styles from "./DatePickerField.module.scss";
import "./DatePickerOverride.scss"; // Global override for the popup calendar

interface DatePickerFieldProps {
  label: string;
  selected: Date | null;
  onChange: (date: Date | null) => void;
  error?: string;
  placeholder?: string;
}

export const DatePickerField: React.FC<DatePickerFieldProps> = ({
  label,
  selected,
  onChange,
  error,
  placeholder = "Select a date",
}) => {
  return (
    <div className={styles.inputGroup}>
      <label className={styles.label}>{label}</label>
      <div className={styles.datePickerWrapper}>
        <ReactDatePicker
          selected={selected}
          onChange={onChange}
          placeholderText={placeholder}
          dateFormat="dd/MM/yyyy"
          className={`${styles.input} ${error ? styles.inputError : ""}`}
          wrapperClassName={styles.wrapperFullWidth} // Ensures the input spans correctly
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
        />
        {/* Optional Calendar Icon */}
        <span className={styles.icon}>📅</span>
      </div>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};
