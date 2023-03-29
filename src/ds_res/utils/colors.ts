export const COLORS = [
  '#00C49F',
  '#673AB7',
  '#B1D43B',
  '#E91E63',
  '#FFE900',
  '#FF5722',
  '#F44336',
  '#FF9800',
  '#9C27B0',
  '#5FCF6F'
]
export function getColor(position: number) {
  return COLORS[position % COLORS.length]
}
