import React, { useEffect, useRef, useState } from "react";
import styles from "./Filter.module.scss";
import { DropdownArrow } from "../../../../ds_res/components/Dropdown/icons";
import Button from "../../../../ds_res/components/Button";
import Input from "../../../../ds_res/components/Input";
import Checkbox from "../../../../ds_res/components/Checkbox/Checkbox";
import { useOnClickOutside } from "../../../../ds_res/hooks/useOnCLickOutside";

const Filter: React.FC<{
  filters: string[];
  initialValues: string[];
  onConfirm: (selectedFilters: string[]) => void;
  onCancel?: () => void;
}> = ({ filters, initialValues, onCancel, onConfirm }) => {
  const [isOpen, setOpen] = useState(false);

  const showDropdown = () => {
    setOpen(true);
  };

  return (
    <div style={{ position: "relative" }}>
      <div className={styles.filterBtn} onClick={showDropdown}>
        <div className={styles.filterBtnWrapper}>
          <button className={styles.filterBtnSubBtn} type="button">
            {initialValues.length === 0 ? "Все" : initialValues.toString()}
          </button>
          <div className={styles.filterBtnArrow}>
            <DropdownArrow />
          </div>
        </div>
      </div>

      {isOpen && (
        <Dropdown
          filters={filters}
          setOpen={setOpen}
          onConfirm={onConfirm}
          onCancel={onCancel}
          initialValues={initialValues}
        />
      )}
    </div>
  );
};

const Dropdown = ({
  setOpen,
  filters,
  initialValues,
  onConfirm,
  onCancel,
}: {
  setOpen: (isOpen: boolean) => void;
  filters: string[];
  initialValues: string[];
  onConfirm: (selectedFilters: string[]) => void;
  onCancel: () => void;
}) => {
  const dropdownRef = useRef(null);
  useOnClickOutside(dropdownRef, () => setOpen(false));

  const [searchValue, setSearchValue] = useState("");
  const [processedFilters, setProcessedFilters] = useState(filters);
  useEffect(() => {
    if (searchValue) {
      const filteredArr = filters.filter((item: string) => {
        return item.includes(searchValue);
      });
      setProcessedFilters(filteredArr);
    } else {
      setProcessedFilters(filters);
    }
  }, [searchValue, filters]);

  const [selectedCheckboxes, setSelectedCheckboxes] = useState(
    initialValues || []
  );
  console.log(
    "🚀 ~ file: Filter.tsx:79 ~ selectedCheckboxes",
    selectedCheckboxes,
    initialValues
  );
  const [allCheckboxValue, setAllCheckboxValue] = useState(
    selectedCheckboxes.length === filters.length
  );

  const selectAllHandler = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = evt.target.checked;
    if (isChecked) {
      setSelectedCheckboxes([...filters]);
      setAllCheckboxValue(true);
    } else {
      setSelectedCheckboxes([]);
      setAllCheckboxValue(false);
    }
  };
  useEffect(() => {
    if (selectedCheckboxes.length === filters.length && !allCheckboxValue) {
      setAllCheckboxValue(true);
    }
    if (selectedCheckboxes.length !== filters.length && allCheckboxValue) {
      setAllCheckboxValue(false);
    }
  }, [selectedCheckboxes.length, filters.length, allCheckboxValue]);

  const filterHandler = (filter: string) => {
    const isChecked = selectedCheckboxes.find((item) => item === filter);
    if (isChecked) {
      setSelectedCheckboxes([
        ...selectedCheckboxes.filter((item) => item !== filter),
      ]);
    } else {
      setSelectedCheckboxes([...selectedCheckboxes, filter]);
    }
  };

  const confirmHandler = () => {
    onConfirm(selectedCheckboxes);
    setOpen(false);
  };

  const cancelHandler = () => {
    setSelectedCheckboxes([]);
    setSearchValue("");
    onCancel();
  };

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <div className={styles.buttonsWrapper}>
        <Button onClick={confirmHandler}>применить</Button>
        <Button onClick={cancelHandler}>сбросить</Button>
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
          checked={allCheckboxValue}
          onChange={selectAllHandler}
        />
        {processedFilters.map((filter) => {
          return (
            <Checkbox
              label={filter}
              checked={!!selectedCheckboxes.find((item) => item === filter)}
              onChange={() => {
                filterHandler(filter);
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Filter;
