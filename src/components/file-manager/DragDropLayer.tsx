import { useEffect, useRef, useState } from 'react'

type Props = {
  onFilesDropped: (files: File[]) => void
  darkMode: boolean
}

function hasFiles(dt: DataTransfer | null): boolean {
  if (!dt) return false
  const types = Array.from(dt.types ?? [])
  return types.includes('Files')
}

export function DragDropLayer({ onFilesDropped, darkMode }: Props) {
  const [active, setActive] = useState(false)
  const counter = useRef(0)

  useEffect(() => {
    function onDragEnter(e: DragEvent) {
      if (!hasFiles(e.dataTransfer)) return
      counter.current += 1
      setActive(true)
    }

    function onDragOver(e: DragEvent) {
      if (!hasFiles(e.dataTransfer)) return
      e.preventDefault()
      setActive(true)
    }

    function onDragLeave(e: DragEvent) {
      if (!hasFiles(e.dataTransfer)) return
      counter.current -= 1
      if (counter.current <= 0) {
        counter.current = 0
        setActive(false)
      }
    }

    function onDrop(e: DragEvent) {
      if (!hasFiles(e.dataTransfer)) return
      e.preventDefault()
      counter.current = 0
      setActive(false)
      const list = Array.from(e.dataTransfer?.files ?? [])
      if (list.length) onFilesDropped(list)
    }

    window.addEventListener('dragenter', onDragEnter)
    window.addEventListener('dragover', onDragOver)
    window.addEventListener('dragleave', onDragLeave)
    window.addEventListener('drop', onDrop)

    return () => {
      window.removeEventListener('dragenter', onDragEnter)
      window.removeEventListener('dragover', onDragOver)
      window.removeEventListener('dragleave', onDragLeave)
      window.removeEventListener('drop', onDrop)
    }
  }, [onFilesDropped])

  if (!active) return null

  return (
    <div
      className={[
        'fixed inset-0 z-50 flex flex-col items-center justify-center',
        'bg-black/70 backdrop-blur-sm transition-all duration-150',
      ].join(' ')}
      onClick={() => setActive(false)}
    >
      <div className={[
        'rounded-2xl p-10 w-full max-w-lg mx-4 border-4 border-dashed shadow-2xl',
        darkMode ? 'bg-gray-800 border-blue-400/60' : 'bg-white border-blue-500/50',
      ].join(' ')}>
        <div className="text-center">
          <div className="text-6xl mb-6">📂</div>
          <h3 className={['text-2xl font-bold mb-2', darkMode ? 'text-white' : 'text-gray-800'].join(' ')}>
            Перетащите файлы сюда
          </h3>
          <p className={['mb-6', darkMode ? 'text-gray-300' : 'text-gray-600'].join(' ')}>
            Отпустите, чтобы добавить файлы в менеджер
          </p>
          <div className={['text-sm', darkMode ? 'text-gray-400' : 'text-gray-500'].join(' ')}>
            Поддерживаются любые типы файлов
          </div>
        </div>
      </div>
      <div className="mt-4 text-white text-sm">Нажмите в любом месте, чтобы отменить</div>
    </div>
  )
}
