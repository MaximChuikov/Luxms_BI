import React, { ChangeEvent, useState } from "react";
import styles from "./Input.module.scss";

type InputProps = {
  onChange?: (evt: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  width?: string | number;
};

const Input: React.FC<InputProps> = ({ placeholder, onChange, width }) => {
  const [value, setValue] = useState("");

  const changeHandler = (evt: ChangeEvent<HTMLInputElement>) => {
    setValue(evt.target.value);
    onChange(evt);
  };

  return (
    <input
      value={value}
      onChange={changeHandler}
      placeholder={placeholder}
      className={styles.input}
      style={{ width }}
    />
  );
};

export default Input;
