export function humanSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB', 'TB']
  let i = -1
  let v = bytes
  do {
    v /= 1024
    i++
  } while (v >= 1024 && i < units.length - 1)
  return `${v.toFixed(1)} ${units[i]}`
}

export function formatDateRU(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('ru-RU')
  } catch {
    return iso
  }
}

export function normalizeFileType(type: string): string {
  return type && type.trim() ? type : 'application/octet-stream'
}

export function isImageType(type: string): boolean {
  return type.startsWith('image/')
}

export function inferEmoji(type: string): string {
  if (!type) return '📁'
  if (type.startsWith('image/')) return '🖼️'
  if (type === 'application/pdf') return '📄'
  if (type.startsWith('video/')) return '🎞️'
  if (type.startsWith('audio/')) return '🎧'
  return '📦'
}
