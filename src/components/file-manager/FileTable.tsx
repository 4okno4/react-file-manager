import type { FileItem } from './types'
import { formatDateRU, humanSize, inferEmoji } from './utils'

type Props = {
  files: FileItem[]
  selectedIds: number[]
  onToggleSelect: (id: number) => void
  onDelete: (id: number) => void
  onDownload: (id: number) => void
  darkMode: boolean
}

export function FileTable(props: Props) {
  if (!props.files.length) {
    return (
      <div className={['p-8 text-center rounded-xl border', props.darkMode ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-600'].join(' ')}>
        Ничего не найдено
      </div>
    )
  }

  return (
    <section className="overflow-auto rounded-xl border border-gray-200">
      <table className="w-full table-auto text-sm">
        <thead className={props.darkMode ? 'bg-gray-900/40 text-gray-200' : 'bg-gray-50 text-gray-700'}>
          <tr>
            <th className="p-3 text-left w-[56px]">Выбор</th>
            <th className="p-3 text-left w-[64px]">Тип</th>
            <th className="p-3 text-left">Имя</th>
            <th className="p-3 text-left w-[120px]">Размер</th>
            <th className="p-3 text-left w-[140px]">Дата</th>
            <th className="p-3 text-left w-[220px]">Действия</th>
          </tr>
        </thead>
        <tbody>
          {props.files.map(f => (
            <tr
              key={f.id}
              className={['border-t', props.darkMode ? 'border-gray-800 hover:bg-gray-900/40' : 'border-gray-200 hover:bg-gray-50'].join(' ')}
            >
              <td className="p-3">
                <input
                  type="checkbox"
                  checked={props.selectedIds.includes(f.id)}
                  onChange={() => props.onToggleSelect(f.id)}
                />
              </td>
              <td className="p-3 text-xl">{inferEmoji(f.type)}</td>
              <td className="p-3">
                <button
                  type="button"
                  className="text-left hover:underline"
                  title="Предпросмотр"
                >
                  {f.name}
                </button>
              </td>
              <td className="p-3">{humanSize(f.size)}</td>
              <td className="p-3">{formatDateRU(f.createdAt)}</td>
              <td className="p-3">
                <div className="flex gap-2 flex-wrap">
                  <button
                    type="button"
                    className={[
                      'border rounded px-3 py-2 transition-colors',
                      props.darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-white border-gray-300 hover:bg-gray-50',
                    ].join(' ')}
                    onClick={() => props.onDownload(f.id)}
                  >
                    Скачать
                  </button>
                  <button
                    type="button"
                    className="bg-red-50 text-red-700 border border-red-200 rounded px-3 py-2 hover:bg-red-100 transition-colors"
                    onClick={() => props.onDelete(f.id)}
                  >
                    Удалить
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
