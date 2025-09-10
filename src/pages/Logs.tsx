import React, { useEffect, useState } from 'react';
import { getLogs, removeLog, clearLogs, ExportLog } from '@/store/logs';
import { Button } from '@/components/ui/button';

const Logs = () => {
  const [logs, setLogs] = useState<ExportLog[]>([]);
  useEffect(()=>{ setLogs(getLogs()); },[]);

  function onDelete(id:string){
    removeLog(id);
    setLogs(getLogs());
  }
  function onClear(){ clearLogs(); setLogs([]); }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Logs</h1>
        <Button variant="outline" onClick={onClear}>Clear All</Button>
      </div>
      <div className="border rounded-md divide-y">
        {logs.length===0 && <div className="p-6 text-muted-foreground">Belum ada log export.</div>}
        {logs.map(l=>(
          <div key={l.id} className="p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">
                {l.csvFilename} <span className="text-xs text-muted-foreground">({(l.csvFilesize/1024/1024).toFixed(2)} MB)</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Time: {new Date(l.timestamp).toLocaleString()} | Products: {l.selectedProducts} | Images: {l.selectedImages} | Status: {l.status}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {l.downloadUrl && <a className="btn" href={l.downloadUrl} download={l.csvFilename}>Download</a>}
              <Button variant="ghost" onClick={()=>onDelete(l.id)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Logs;
