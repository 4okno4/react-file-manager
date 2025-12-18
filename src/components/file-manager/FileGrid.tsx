import type { FileItem } from './types'
import { FileCard } from './FileCard'

type Props = {
  files: FileItem[]
  selectedIds: number[]
  onToggleSelect: (id: number) => void
  onDelete: (id: number) => void
  onDownload: (id: number) => void
  darkMode: boolean
}

export function FileGrid(props: Props) {
  if (!props.files.length) {
    return (
      <div className={['p-8 text-center rounded-xl border', props.darkMode ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-600'].join(' ')}>
        Ничего не найдено
      </div>
    )
  }

  return (
    <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {props.files.map(f => (
        <FileCard
          key={f.id}
          file={f}
          checked={props.selectedIds.includes(f.id)}
          onToggle={() => props.onToggleSelect(f.id)}
          onDelete={() => props.onDelete(f.id)}
          onDownload={() => props.onDownload(f.id)}
          darkMode={props.darkMode}
        />
      ))}
    </section>
  )
}
