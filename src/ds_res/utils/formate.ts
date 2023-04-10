import { IAutocompleteText } from '../components/Autocomplete/Autocomplete'

export function toAutocomplete<T>(array: Array<T>, handler: (el: T) => string): IAutocompleteText[] {
  return array.map((el, index) => {
    return {
      label: handler(el),
      id: index
    }
  })
}
