import React, { useState } from 'react'
import { DashDropdown } from 'src/Base/components'
import { IndicatorsTable } from 'src/Main/containers/IndicatorsTable'
import { ExpandIcon } from 'ds_res/icons/ExpandIcon'
import { CollapseIcon } from 'ds_res/icons/CollapseIcon'
import { TOptionObject } from 'src/Base/components/DropdownButton/DropdownOption'
import { UrlState } from 'bi-internal/core'
import {
  deviationOptions,
  deviationTypesOptions,
  evaluationPerspectives,
  indicatorsTypes,
  periodTypes,
  sortingOptions
} from '../../../Base/constants/options'
import styles from './IndicatorsTableWithControls.module.scss'

type TIndicatorsTableWithControls = {
  onExpandClick: () => void
  position: boolean
}
export const IndicatorsTableWithControls = ({ onExpandClick, position }: TIndicatorsTableWithControls) => {
  const urlState = UrlState.getInstance()
  urlState.subscribeUpdatesAndNotify(() => {})
  const stateCharts = UrlState.getModel()

  const [isSelectorsExpanded, setSelectorsExpanded] = useState<boolean>(false)
  const [dropdownsState, setDropdownsState] = useState({
    perspectiveDropdown: { label: stateCharts.evaluationPerspectives ?? evaluationPerspectives[0].label },
    indicatorsType: { label: stateCharts.indicatorsTypes ?? indicatorsTypes[0].label },
    periods: { label: stateCharts.periodTypes ?? periodTypes[0].label },
    deviationTypesOptions: { label: stateCharts.deviationTypesOptions ?? deviationTypesOptions[0].label },
    deviationOptions: { label: stateCharts.deviationOptions ?? deviationOptions[0].label },
    sortingOptions: { label: stateCharts.sortingOptions ?? sortingOptions[0].label }
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
    urlState.updateModel({ [name]: value.label })
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
                  value={dropdownsState.perspectiveDropdown}
                />
                <DashDropdown
                  options={indicatorsTypes}
                  onChange={onSelect}
                  name="indicatorsTypes"
                  value={dropdownsState.indicatorsType}
                />
                <DashDropdown
                  options={periodTypes}
                  onChange={onSelect}
                  name="periodTypes"
                  value={dropdownsState.periods}
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
