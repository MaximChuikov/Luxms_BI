import React, { FC, useRef, useState } from "react";
import classNames from "classnames";
import "./Dropdown.scss";

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
    <div className={"customSelect"} ref={ref}>
      <div
        className={classNames("customSelect__wrapper")}
        onClick={toggleOptions}
      >
        <button className="customSelect__btn" type="button">
          {selectedOption && selectedOption.name}
        </button>
        <div className="customSelect__arrow">
          <DropdownArrow />
        </div>
        <ul
          className={classNames("customSelect__options scroller", {
            show: isOptionsOpen,
          })}
        >
          {data.map((option, index) => {
            return (
              <li
                key={option.id}
                className="customSelect__options-item"
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
