export default interface HNItem {
  id: number
  by: string
  time: number
  type: 'story' | 'comment'

  title?: string
  text?: string
  score?: number
  url?: string

  descendants?: number
  kids?: number[]
  parent?: number
}
