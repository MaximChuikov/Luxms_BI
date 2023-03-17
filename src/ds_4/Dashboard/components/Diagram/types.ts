export type categories = {
  categoryname: string
}[]

export interface dataInput {
  data: {
    name: string
    workers: number
    normPercent: number
    coefficient: number
  }[]
}
