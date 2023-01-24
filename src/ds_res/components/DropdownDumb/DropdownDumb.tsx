import React, { FC, useRef, useState } from "react";
import classNames from "classnames";
import "./DropdownDumb.scss";

import { DropdownArrow } from "./icons";
import { useOnClickOutside } from "../../hooks/useOnCLickOutside";

interface IOption {
  id: string;
  name: string;
}

interface ISelect {
  data: IOption[];
  display?: string;
  onChange: (filterName: string, obj: any) => void;
  className?: string;
  selectedOption?: { id: string; name: string };
  filterName?: string;
}

export const DropdownDumb: FC<ISelect> = ({
  data,
  display,
  onChange,
  className = "",
  selectedOption, //= data[0],
  filterName = "",
}) => {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  const ref = useRef(null);
  useOnClickOutside(ref, () => setIsOptionsOpen(false));

  const toggleOptions = () => {
    if (display === "false") return null;
    setIsOptionsOpen(!isOptionsOpen);
  };

  const onSelectOption = (selectedObj: any) => {
    onChange(filterName, selectedObj);
    setIsOptionsOpen(false);
  };
  return (
    <div className={`customSelect ${className}`} ref={ref}>
      <div
        className={classNames("customSelect__wrapper", {
          disabled: display === "false",
        })}
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
