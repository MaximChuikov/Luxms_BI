import React, { useState } from 'react'
import { Autocomplete as AutocompleteMUI, TextField } from '@mui/material'
import style from './autocomplete.module.scss'

export interface IAutocompleteText {
  label: string
  id: number
}

export interface IAutocompleteProps {
  labels: IAutocompleteText[]
  onChangeValue?: (label: IAutocompleteText) => void
}
const Autocomplete = ({ labels, onChangeValue }: IAutocompleteProps) => {
  onChangeValue(labels[0])
  const [value, setValue] = useState(labels[0])
  return (
    <div className={style.autocompleteContainer}>
      <AutocompleteMUI
        disableClearable={true}
        clearOnEscape={true}
        sx={{
          border: 'none'
        }}
        noOptionsText={'Не найдено'}
        className={style.autocomplete}
        options={labels}
        value={value}
        renderInput={(params) => <TextField className={style.textField} {...params} label="Страна" />}
        onChange={(e, newValue) => {
          onChangeValue(newValue)
          setValue(newValue)
        }}
        isOptionEqualToValue={(option, val) => {
          return option.id === val.id
        }}
      />
    </div>
  )
}

export default Autocomplete
