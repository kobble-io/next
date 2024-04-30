export type Quota = {
  id: string
  name: string
  remaining: number
  limit: number
  usage: number
}

export type Permission = {
  id: string
  name: string
  isAllowed: boolean
}
