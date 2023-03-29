import React from 'react'
import { Autocomplete as AutocompleteMUI, TextField } from '@mui/material'
import style from './autocomplete.module.scss'

export interface IAutocompleteText {
  label: string
  id: number
}
export interface IAutocompleteProps {
  labels: IAutocompleteText[]
  onChangeValue?: (label: IAutocompleteText) => void
  selectedValue: IAutocompleteText
}

const Autocomplete = ({ labels, onChangeValue, selectedValue }: IAutocompleteProps) => {
  if (labels.length === 0) return <h3>Путой список</h3>
  return (
    <div className={style.autocompleteContainer}>
      <AutocompleteMUI
        disableClearable={true}
        clearOnEscape={true}
        sx={{ border: 'none' }}
        noOptionsText={'Не найдено'}
        className={style.autocomplete}
        options={labels}
        value={selectedValue}
        renderInput={(params) => <TextField className={style.textField} {...params} label="Страна" />}
        onChange={(_, newValue) => {
          onChangeValue(newValue)
        }}
        getOptionLabel={(label) => label.label}
        isOptionEqualToValue={(option, val) => {
          return option.id === val.id
        }}
      />
    </div>
  )
}

export default Autocomplete
