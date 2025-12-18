export type ViewMode = 'cards' | 'table'
export type SortBy = 'name' | 'size' | 'createdAt'
export type SortDir = 'asc' | 'desc'

export type FileItem = {
  id: number
  name: string
  size: number
  createdAt: string
  type: string
  file?: File
}
