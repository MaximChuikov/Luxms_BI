import React, { useState } from 'react'
import { DashDropdown } from 'src/Base/components'
import { IndicatorsTable } from 'src/Main/containers/IndicatorsTable'
import { ExpandIcon } from 'ds_res/icons/ExpandIcon'
import { CollapseIcon } from 'ds_res/icons/CollapseIcon'
import { TOptionObject } from 'src/Base/components/DropdownButton/DropdownOption'
import {
  deviationOptions,
  deviationTypesOptions,
  evaluationPerspectives,
  indicatorsTypes,
  periodOptions,
  sortingOptions
} from './options'
import styles from './IndicatorsTableWithControls.module.scss'

type TIndicatorsTableWithControls = {
  onExpandClick: () => void
  position: boolean
}
export const IndicatorsTableWithControls = ({ onExpandClick, position }: TIndicatorsTableWithControls) => {
  const [isSelectorsExpanded, setSelectorsExpanded] = useState<boolean>(false)
  const [dropdownsState, setDropdownsState] = useState({
    evaluationPerspectives: evaluationPerspectives[0],
    indicatorsTypes: indicatorsTypes[0],
    periodOptions: periodOptions[0],
    deviationTypesOptions: deviationTypesOptions[0],
    deviationOptions: deviationOptions[0],
    sortingOptions: sortingOptions[0]
  })
  const handleExpandBtnClick = () => {
    onExpandClick()
    setSelectorsExpanded((prev: boolean) => !prev)
  }

  const onSelect = ({ name, value }: { name: string; value: TOptionObject }) => {
    setDropdownsState({
      ...dropdownsState,
      [name]: value
    })
  }
  return (
    <section className={[styles.contentWrapper, position ? styles.containerExpanded : ''].join(' ')}>
      <div className={styles.controlsContainer}>
        <div>Поиск...</div>
        <div className={styles.selectorsWithTableControlBtnContainer}>
          <div className={styles.selectorsContainer}>
            {isSelectorsExpanded && (
              <>
                <DashDropdown
                  options={evaluationPerspectives}
                  onChange={onSelect}
                  name="evaluationPerspectives"
                  value={dropdownsState.evaluationPerspectives}
                />
                <DashDropdown
                  options={indicatorsTypes}
                  onChange={onSelect}
                  name="indicatorsTypes"
                  value={dropdownsState.indicatorsTypes}
                />
                <DashDropdown
                  options={periodOptions}
                  onChange={onSelect}
                  name="periodOptions"
                  value={dropdownsState.periodOptions}
                />
                <DashDropdown
                  options={deviationTypesOptions}
                  onChange={onSelect}
                  name="deviationTypesOptions"
                  value={dropdownsState.deviationTypesOptions}
                />
              </>
            )}
            <DashDropdown
              options={deviationOptions}
              onChange={onSelect}
              name="deviationOptions"
              value={dropdownsState.deviationOptions}
            />
            <DashDropdown
              options={sortingOptions}
              onChange={onSelect}
              name="sortingOptions"
              value={dropdownsState.sortingOptions}
            />
          </div>
          <div className={styles.tableControlBtn} role="button" onClick={handleExpandBtnClick}>
            {position ? <CollapseIcon /> : <ExpandIcon />}
          </div>
        </div>
      </div>
      <IndicatorsTable />
    </section>
  )
}
