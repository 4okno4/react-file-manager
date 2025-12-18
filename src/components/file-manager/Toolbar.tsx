import { useId, useRef } from 'react'
import type { SortBy, SortDir, ViewMode } from './types'

type Props = {
  darkMode: boolean
  onToggleDark: () => void

  search: string
  onSearchChange: (v: string) => void

  typeFilter: string
  onTypeFilterChange: (v: string) => void
  fileTypes: string[]

  viewMode: ViewMode
  onViewModeChange: (v: ViewMode) => void

  sortBy: SortBy
  onSortByChange: (v: SortBy) => void

  sortDir: SortDir
  onToggleSortDir: () => void

  onAddFiles: (files: File[]) => void

  selectedCount: number
  onDeleteSelected: () => void
}

export function Toolbar(props: Props) {
  const inputId = useId()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const controlClass = [
    'border rounded px-3 py-2 outline-none transition-colors',
    props.darkMode ? 'bg-gray-700 text-gray-100 border-gray-600 focus:border-blue-400' : 'bg-white text-gray-900 border-gray-300 focus:border-blue-500',
  ].join(' ')

  function onPick() {
    fileInputRef.current?.click()
  }

  function onFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const list = Array.from(e.target.files ?? [])
    if (list.length) props.onAddFiles(list)
    e.target.value = ''
  }

  return (
    <header className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-bold">Файловый менеджер</div>
          <div className={['text-xs px-2 py-1 rounded-full border', props.darkMode ? 'border-gray-600 text-gray-300' : 'border-gray-200 text-gray-600'].join(' ')}>
            drag & drop включён
          </div>
        </div>

        <div className="flex gap-2 flex-wrap items-center justify-start sm:justify-end">
          <button
            type="button"
            className={[
              'border px-3 py-2 rounded transition-colors',
              props.darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-white border-gray-300 hover:bg-gray-50',
            ].join(' ')}
            onClick={props.onToggleDark}
          >
            {props.darkMode ? 'Светлая тема' : 'Тёмная тема'}
          </button>

          <button
            type="button"
            className={[
              'px-3 py-2 rounded border transition-colors',
              props.selectedCount ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100' : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed',
            ].join(' ')}
            disabled={!props.selectedCount}
            onClick={props.onDeleteSelected}
            title={props.selectedCount ? 'Удалить выбранные файлы' : 'Нет выбранных файлов'}
          >
            Удалить выбранные ({props.selectedCount})
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
        <div className="flex gap-3 flex-wrap items-center">
          <input
            className={[controlClass, 'min-w-[220px]'].join(' ')}
            placeholder="Поиск по имени..."
            value={props.search}
            onChange={e => props.onSearchChange(e.target.value)}
          />

          <select
            className={controlClass}
            value={props.typeFilter}
            onChange={e => props.onTypeFilterChange(e.target.value)}
          >
            <option value="">Все типы</option>
            {props.fileTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 flex-wrap items-center">
          <input
            ref={fileInputRef}
            id={inputId}
            type="file"
            className="hidden"
            multiple
            onChange={onFilesSelected}
          />

          <button
            type="button"
            onClick={onPick}
            className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span aria-hidden>📁</span>
            <span>Добавить</span>
          </button>

          <select
            className={controlClass}
            value={props.viewMode}
            onChange={e => props.onViewModeChange(e.target.value as ViewMode)}
          >
            <option value="cards">Карточки</option>
            <option value="table">Таблица</option>
          </select>

          <select
            className={controlClass}
            value={props.sortBy}
            onChange={e => props.onSortByChange(e.target.value as SortBy)}
          >
            <option value="name">Имя</option>
            <option value="size">Размер</option>
            <option value="createdAt">Дата</option>
          </select>

          <button
            type="button"
            onClick={props.onToggleSortDir}
            className={[
              'border px-3 py-2 rounded transition-colors',
              props.darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-white border-gray-300 hover:bg-gray-50',
            ].join(' ')}
            title="Сменить направление сортировки"
          >
            {props.sortDir === 'asc' ? '▲' : '▼'}
          </button>
        </div>
      </div>
    </header>
  )
}
