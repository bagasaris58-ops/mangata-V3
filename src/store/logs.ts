export type ExportStatus = 'success' | 'failed';

export interface ExportLog {
  id: string;
  timestamp: string; // ISO (sudah WITA kalau kamu set offset di penulis)
  rootFolderId: string;
  query?: string;
  selectedProducts: number;
  selectedImages: number;
  csvFilename: string;
  csvFilesize: number;
  csvSha256: string;
  status: ExportStatus;
  errorMessage?: string;
  downloadUrl?: string;
}

const KEY = 'exportLogs';

function read(): ExportLog[] {
  try { return JSON.parse(localStorage.getItem(KEY)||'[]'); } catch { return []; }
}
function write(arr: ExportLog[]) { localStorage.setItem(KEY, JSON.stringify(arr)); }

export function addLog(entry: ExportLog) {
  const arr = read();
  arr.unshift(entry);
  write(arr);
}

export function getLogs(): ExportLog[] { return read(); }
export function clearLogs() { write([]); }
export function removeLog(id: string) { write(read().filter(x=>x.id!==id)); }
