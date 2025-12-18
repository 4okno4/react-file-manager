import { useEffect, useMemo, useState } from 'react'
import type { FileItem } from './types'
import { formatDateRU, humanSize, isImageType, inferEmoji } from './utils'

type Props = {
  file: FileItem | null
  onClose: () => void
  darkMode: boolean
}

export function PreviewPanel({ file, onClose, darkMode }: Props) {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!file?.file || !isImageType(file.type)) {
      setUrl(null)
      return
    }
    const u = URL.createObjectURL(file.file)
    setUrl(u)
    return () => URL.revokeObjectURL(u)
  }, [file])

  const meta = useMemo(() => {
    if (!file) return null
    return {
      size: humanSize(file.size),
      date: formatDateRU(file.createdAt),
      type: file.type,
    }
  }, [file])

  if (!file || !meta) return null

  return (
    <section className="mt-6">
      <div className={['p-4 rounded-xl border', darkMode ? 'border-gray-700 bg-gray-900/20' : 'border-gray-200 bg-gray-50'].join(' ')}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="font-semibold text-lg flex items-center gap-2">
              <span aria-hidden className="text-2xl">{inferEmoji(file.type)}</span>
              <span className="break-all">{file.name}</span>
            </div>
            <div className={['text-sm mt-1', darkMode ? 'text-gray-300' : 'text-gray-600'].join(' ')}>
              {meta.size} • {meta.date} • {meta.type}
            </div>
          </div>

          <button
            type="button"
            className="text-blue-600 hover:text-blue-800 transition-colors"
            onClick={onClose}
          >
            Закрыть
          </button>
        </div>

        <div className="mt-4">
          {url ? (
            <img src={url} alt={file.name} className="max-h-80 rounded-lg" />
          ) : (
            <div className={['text-sm', darkMode ? 'text-gray-400' : 'text-gray-500'].join(' ')}>
              Предпросмотр доступен только для изображений, добавленных через загрузку/перетаскивание.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
