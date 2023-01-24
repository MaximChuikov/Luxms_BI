import React, { ChangeEvent, useState } from "react";
import styles from "./Checkbox.module.scss";

type VariantType = "default" | "circle";

type CheckboxProps = {
  onChange?: (evt: ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  width?: string | number;
  variant?: VariantType;
};

const variantsDict: { [key in VariantType]: string } = {
  default: styles.customCheckbox,
  circle: styles.customCheckboxCircle,
};

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  onChange,
  variant = "default",
}) => {
  const [value, setValue] = useState(false);

  const changeHandler = (evt: ChangeEvent<HTMLInputElement>) => {
    setValue(evt.target.checked);
    onChange(evt);
  };

  return (
    <label className={variantsDict[variant]}>
      <input checked={value} onChange={changeHandler} type="checkbox" />
      <span>{label}</span>
    </label>
  );
};

export default Checkbox;
