import type { FileItem } from './types'
import { humanSize } from './utils'

type Props = {
  totalFiles: number
  totalSize: number
  averageSize: number
  largestFile: FileItem | null
  newestFile: FileItem | null
  oldestFile: FileItem | null
  imageCount: number
  pdfCount: number
  otherCount: number
  darkMode: boolean
}

export function StatsFooter(props: Props) {
  return (
    <footer className={['mt-8 p-4 rounded-xl border text-sm grid gap-2 md:grid-cols-3', props.darkMode ? 'border-gray-700 bg-gray-900/30' : 'border-gray-200 bg-gray-50'].join(' ')}>
      <div>Файлов: <b>{props.totalFiles}</b></div>
      <div>Размер: <b>{humanSize(props.totalSize)}</b></div>
      <div>Средний размер: <b>{humanSize(props.averageSize)}</b></div>

      {props.largestFile ? <div>Самый большой: <b>{props.largestFile.name}</b></div> : <div />}
      {props.newestFile ? <div>Самый новый: <b>{props.newestFile.name}</b></div> : <div />}
      {props.oldestFile ? <div>Самый старый: <b>{props.oldestFile.name}</b></div> : <div />}

      <div>Изображения: <b>{props.imageCount}</b></div>
      <div>PDF: <b>{props.pdfCount}</b></div>
      <div>Прочие: <b>{props.otherCount}</b></div>
    </footer>
  )
}
