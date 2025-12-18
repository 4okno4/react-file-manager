import type { FileItem } from './types'
import { formatDateRU, humanSize, inferEmoji } from './utils'

type Props = {
  file: FileItem
  checked: boolean
  onToggle: () => void
  onDelete: () => void
  onDownload: () => void
  darkMode: boolean
}

export function FileCard(props: Props) {
  const { file } = props

  return (
    <div
      className={[
        'p-4 border rounded-xl shadow-sm transition-colors duration-200',
        props.darkMode ? 'border-gray-700 bg-gray-900/30 hover:bg-gray-900/40' : 'border-gray-200 bg-white hover:bg-gray-50',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-3">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={props.checked}
            onChange={props.onToggle}
          />
          <span className="text-sm text-gray-500">Выбрать</span>
        </label>

        <button
          type="button"
          className={[
            'w-12 h-12 flex items-center justify-center rounded-xl border text-2xl',
            props.darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-gray-100 border-gray-200 hover:bg-gray-200',
          ].join(' ')}
          title="Предпросмотр"
        >
          {inferEmoji(file.type)}
        </button>
      </div>

      <div className="mt-3">
        <div className="font-medium break-all">{file.name}</div>
        <div className={['text-sm mt-1', props.darkMode ? 'text-gray-300' : 'text-gray-500'].join(' ')}>
          {humanSize(file.size)} • {formatDateRU(file.createdAt)}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          className={[
            'flex-1 border rounded px-3 py-2 transition-colors',
            props.darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-white border-gray-300 hover:bg-gray-50',
          ].join(' ')}
          onClick={props.onDownload}
        >
          Скачать
        </button>

        <button
          type="button"
          className="flex-1 bg-red-50 text-red-700 border border-red-200 rounded px-3 py-2 hover:bg-red-100 transition-colors"
          onClick={props.onDelete}
        >
          Удалить
        </button>
      </div>
    </div>
  )
}
