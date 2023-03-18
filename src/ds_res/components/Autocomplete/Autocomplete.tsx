import React, { useState } from 'react'
import { Autocomplete as AutocompleteMUI, TextField } from '@mui/material'
import style from './autocomplete.module.scss'

export interface IAutocompleteText {
  label: string
  id: number
}

const Autocomplete = (props: { labels: IAutocompleteText[]; onChangeValue?: (label: IAutocompleteText) => void }) => {
  const [value, setValue] = useState(props.labels[0])
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
        options={props.labels}
        value={value}
        renderInput={(params) => <TextField className={style.textField} {...params} label="Страна" />}
        onChange={(e, newValue) => {
          props.onChangeValue(newValue)
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
