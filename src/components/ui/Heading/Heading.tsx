import React, { HTMLAttributes } from 'react';
import styles from './Heading.module.scss';

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
  formatNumber?: boolean
}

export const Heading: React.FC<HeadingProps> = ({ 
  level = 'h1',
   formatNumber = false,
  children, 
  className = '',
  ...props 
}) =>  {
  const Tag = level;

  let displayContent = children;

  if (formatNumber && children != null) {
    const numericValue = Number(children);
        if (!isNaN(numericValue)) {
      displayContent = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(numericValue);
    }
  }

  return (
    <Tag className={`${styles.heading} ${styles[level]} ${className}`} {...props}>
      {displayContent}
    </Tag>
  );
};