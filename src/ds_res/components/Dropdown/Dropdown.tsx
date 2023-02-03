import React, { FC, useRef, useState } from "react";
import styles from "./Dropdown.module.scss";

import { DropdownArrow } from "./icons";
import { useOnClickOutside } from "../../hooks/useOnCLickOutside";

interface IOption {
  id: string;
  name: string;
}

interface ISelect {
  data: IOption[];
  onChange: (obj: any) => void;
  selectedOption?: { id: string; name: string };
}

export const Dropdown: FC<ISelect> = ({ data, onChange }) => {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(data[0] || null);

  const ref = useRef(null);
  useOnClickOutside(ref, () => setIsOptionsOpen(false));

  const toggleOptions = () => {
    setIsOptionsOpen(!isOptionsOpen);
  };

  const onSelectOption = (selectedObj: any) => {
    setSelectedOption(selectedObj);
    onChange(selectedObj);
    setIsOptionsOpen(false);
  };
  return (
    <div className={styles.customSelect} ref={ref}>
      <div className={styles.wrapper} onClick={toggleOptions}>
        <button className={styles.btn} type="button">
          {selectedOption && selectedOption.name}
        </button>
        <div className={styles.arrow}>
          <DropdownArrow />
        </div>
        <ul
          className={`${styles.options} scroller ${
            isOptionsOpen && styles.show
          }`}
        >
          {data.map((option, index) => {
            return (
              <li
                key={option.id}
                className={styles.optionsItem}
                onClick={() => onSelectOption(data[index])}
              >
                {option.name}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
