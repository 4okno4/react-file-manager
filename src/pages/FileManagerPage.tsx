import { useMemo, useState } from 'react'
import type { FileItem, SortBy, SortDir, ViewMode } from '../components/file-manager/types'
import { formatDateRU, humanSize, inferEmoji, isImageType, normalizeFileType } from '../components/file-manager/utils'
import { DragDropLayer } from '../components/file-manager/DragDropLayer'
import { ToastHost, useToast } from '../components/file-manager/Toast'
import { Toolbar } from '../components/file-manager/Toolbar'
import { FileGrid } from '../components/file-manager/FileGrid'
import { FileTable } from '../components/file-manager/FileTable'
import { PreviewPanel } from '../components/file-manager/PreviewPanel'
import { StatsFooter } from '../components/file-manager/StatsFooter'

const seedFiles: FileItem[] = [
  {
    id: 1,
    name: 'Документ.pdf',
    size: 234567,
    createdAt: new Date().toISOString(),
    type: 'application/pdf',
  },
  {
    id: 2,
    name: 'Фото.jpg',
    size: 1456789,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    type: 'image/jpeg',
  },
]

export default function FileManagerPage() {
  const toast = useToast()

  const [files, setFiles] = useState<FileItem[]>(seedFiles)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('')
  const [darkMode, setDarkMode] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('cards')
  const [sortBy, setSortBy] = useState<SortBy>('name')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [previewId, setPreviewId] = useState<number | null>(null)

  const fileTypes = useMemo(() => {
    const types = new Set(files.map(f => f.type))
    return Array.from(types.values())
  }, [files])

  const filteredFiles = useMemo(() => {
    const q = search.trim().toLowerCase()
    return files.filter(f => {
      const matchesSearch = f.name.toLowerCase().includes(q)
      const matchesType = typeFilter ? f.type === typeFilter : true
      return matchesSearch && matchesType
    })
  }, [files, search, typeFilter])

  const sortedFiles = useMemo(() => {
    const arr = [...filteredFiles]
    arr.sort((a, b) => {
      let v1: string | number = a[sortBy]
      let v2: string | number = b[sortBy]
      if (sortBy === 'createdAt') {
        v1 = new Date(String(v1)).getTime()
        v2 = new Date(String(v2)).getTime()
      }
      if (v1 < v2) return sortDir === 'asc' ? -1 : 1
      if (v1 > v2) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return arr
  }, [filteredFiles, sortBy, sortDir])

  const totalFiles = sortedFiles.length
  const totalSize = useMemo(() => sortedFiles.reduce((sum, f) => sum + f.size, 0), [sortedFiles])
  const averageSize = totalFiles ? totalSize / totalFiles : 0

  const imageCount = useMemo(() => sortedFiles.filter(f => isImageType(f.type)).length, [sortedFiles])
  const pdfCount = useMemo(() => sortedFiles.filter(f => f.type === 'application/pdf').length, [sortedFiles])
  const otherCount = totalFiles - imageCount - pdfCount

  const newestFile = useMemo(() => {
    if (!sortedFiles.length) return null
    return sortedFiles.reduce((a, b) => new Date(a.createdAt) > new Date(b.createdAt) ? a : b)
  }, [sortedFiles])

  const oldestFile = useMemo(() => {
    if (!sortedFiles.length) return null
    return sortedFiles.reduce((a, b) => new Date(a.createdAt) < new Date(b.createdAt) ? a : b)
  }, [sortedFiles])

  const largestFile = useMemo(() => {
    if (!sortedFiles.length) return null
    return sortedFiles.reduce((a, b) => a.size > b.size ? a : b)
  }, [sortedFiles])

  const previewFile = useMemo(() => files.find(f => f.id === previewId) ?? null, [files, previewId])

  function toggleSelect(id: number) {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  function addFiles(incoming: File[]) {
    if (!incoming.length) return
    const now = Date.now()
    const items: FileItem[] = incoming.map((f, i) => ({
      id: now + i,
      name: f.name,
      size: f.size,
      createdAt: new Date().toISOString(),
      type: normalizeFileType(f.type),
      file: f,
    }))
    setFiles(prev => [...items, ...prev])
    toast.show(`Добавлено: ${incoming.length}`, { kind: 'success' })
  }

  function deleteFile(id: number) {
    const file = files.find(f => f.id === id)
    if (!file) return
    if (!confirm(`Удалить "${file.name}"?`)) return
    setFiles(prev => prev.filter(f => f.id !== id))
    setSelectedIds(prev => prev.filter(x => x !== id))
    if (previewId === id) setPreviewId(null)
  }

  function deleteSelected() {
    if (!selectedIds.length) return
    if (!confirm('Удалить выбранные файлы?')) return
    const toDelete = new Set(selectedIds)
    setFiles(prev => prev.filter(f => !toDelete.has(f.id)))
    setSelectedIds([])
    if (previewId != null && toDelete.has(previewId)) setPreviewId(null)
  }

  function downloadFile(id: number) {
    const file = files.find(f => f.id === id)
    if (!file) return
    alert(`Загрузка файла: ${file.name}`)
  }

  function clearPreview() {
    setPreviewId(null)
  }

  return (
    <ToastHost>
      <div
        className={[
          'min-h-screen p-6 transition-colors duration-300',
          darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900',
        ].join(' ')}
      >
        <DragDropLayer
          onFilesDropped={addFiles}
          darkMode={darkMode}
        />

        <div className={['max-w-6xl mx-auto shadow-lg rounded-2xl p-6 transition-colors duration-300', darkMode ? 'bg-gray-800' : 'bg-white'].join(' ')}>
          <Toolbar
            darkMode={darkMode}
            onToggleDark={() => setDarkMode(v => !v)}
            search={search}
            onSearchChange={setSearch}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
            fileTypes={fileTypes}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            sortDir={sortDir}
            onToggleSortDir={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}
            onAddFiles={addFiles}
            selectedCount={selectedIds.length}
            onDeleteSelected={deleteSelected}
          />

          <main className="mt-6">
            {viewMode === 'cards' ? (
              <FileGrid
                files={sortedFiles}
                selectedIds={selectedIds}
                onToggleSelect={toggleSelect}
                onPreview={setPreviewId}
                onDelete={deleteFile}
                onDownload={downloadFile}
                darkMode={darkMode}
              />
            ) : (
              <FileTable
                files={sortedFiles}
                selectedIds={selectedIds}
                onToggleSelect={toggleSelect}
                onPreview={setPreviewId}
                onDelete={deleteFile}
                onDownload={downloadFile}
                darkMode={darkMode}
              />
            )}

            <PreviewPanel
              file={previewFile}
              onClose={clearPreview}
              darkMode={darkMode}
            />
          </main>

          <StatsFooter
            totalFiles={totalFiles}
            totalSize={totalSize}
            averageSize={averageSize}
            largestFile={largestFile}
            newestFile={newestFile}
            oldestFile={oldestFile}
            imageCount={imageCount}
            pdfCount={pdfCount}
            otherCount={otherCount}
            darkMode={darkMode}
          />
        </div>
      </div>
    </ToastHost>
  )
}
