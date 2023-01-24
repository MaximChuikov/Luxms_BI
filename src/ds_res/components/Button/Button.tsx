import React from "react";
import styles from "./Button.module.scss";

type ButtonProps = {
  width?: string | number;
  children: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({ children, width }) => {
  return (
    <button style={{ width }} className={styles.button}>
      {children}
    </button>
  );
};

export default Button;
