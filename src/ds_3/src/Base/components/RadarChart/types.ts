export type RadarAxisData = {
  perspective: string
  allIndicators: number
  unfulfilledIndicators: number
}

export type TAxisPayload = {
  coordinate: number
  value: string
  index: number
  offset: number
}

export type TRadarAxis = {
  [key: string]: number | string
} & {
  payload: TAxisPayload
  x: number
  y: number
  cx: number
  cy: number
}

export type TRadarChartWithLabel = {
  chartData: Array<RadarAxisData>
}

export type TLabelsLayer = {
  radarLabelData: TRadarLabel[]
}

export type TCoordinates = {
  x: number
  cx: number
  y: number
  cy: number
}

export type TRadarLabel = {
  perspective: string
  allIndicators: string
  unfulfilledIndicators: string
}
