import React from 'react';
import styles from './Table.module.scss';

// Defines the shape of our columns
export interface TableColumn<T> {
  header: string;
  accessor: keyof T; // The key in the data object
  render?: (row: T) => React.ReactNode; // Optional custom render function (e.g., for action buttons)
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  emptyMessage?: string;
}

// Using a generic type T so the table accepts any data structure safely
export const Table = <T extends Record<string, any>>({ 
  columns, 
  data, 
  emptyMessage = "No data available" 
}: TableProps<T>) => {
  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th key={index}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className={styles.emptyCell}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((col, colIndex) => (
                    <td key={colIndex}>
                      {/* Use custom render if provided, otherwise safely display the data */}
                      {col.render ? col.render(row) : String(row[col.accessor])}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};