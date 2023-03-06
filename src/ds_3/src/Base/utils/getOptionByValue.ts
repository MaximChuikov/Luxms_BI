import { TOptionObject } from 'src/Base/components/DropdownButton/DropdownOption'

export const getOptionByValue = ({ options, value }: { options: TOptionObject[]; value: string }): TOptionObject => {
  return options.filter((el) => el.value === value)[0] || options[0]
}
