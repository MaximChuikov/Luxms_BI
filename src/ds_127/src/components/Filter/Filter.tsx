import React, { useRef, useState } from "react";
import styles from "./Filter.module.scss";
import { DropdownArrow } from "../../../../ds_res/components/DropdownDumb/icons";
import Button from "../../../../ds_res/components/Button";
import Input from "../../../../ds_res/components/Input";
import Checkbox from "../../../../ds_res/components/Checkbox/Checkbox";
import { useOnClickOutside } from "../../../../ds_res/hooks/useOnCLickOutside";

const Filter = () => {
  const [isOpen, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const showDropdown = () => {
    setOpen((prev) => !prev);
  };
  const dropdownRef = useRef(null);
  useOnClickOutside(dropdownRef, () => setOpen(false));

  return (
    <div style={{ position: "relative" }}>
      <div className={styles.filterBtn} onClick={showDropdown}>
        <div className={styles.filterBtnWrapper}>
          <button className={styles.filterBtnSubBtn} type="button">
            {"BCE"}
          </button>
          <div className={styles.filterBtnArrow}>
            <DropdownArrow />
          </div>
        </div>
      </div>

      {isOpen && (
        <div className={styles.dropdown} ref={dropdownRef}>
          <div className={styles.buttonsWrapper}>
            <Button>применить</Button>
            <Button>сбросить</Button>
          </div>

          <div className={styles.buttonsWrapper}>
            <Input
              placeholder="поиск..."
              onChange={(evt) => {
                setSearchValue(evt.target.value);
              }}
              width="100%"
            />
          </div>

          <div className={styles.checkboxWrapper}>
            <Checkbox
              label="Все"
              variant="circle"
              onChange={(evt) => {
                console.log("%c⧭", "color: #ffa280", evt.target.checked);
              }}
            />
            <Checkbox
              label="Пункт 1"
              onChange={(evt) => {
                console.log("%c⧭", "color: #ffa280", evt.target.checked);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Filter;
