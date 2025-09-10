import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Cloud } from 'lucide-react';
import { useProducts } from '@/contexts/ProductContext';
import { useAppStore } from '@/store';

export const DataSourceTabs = () => {
  const { testAccess, setCredentials } = useProducts();
  const { settings } = useAppStore();
  const [apiKey, setApiKey] = useState(settings.driveApiKey || '');
  const [folderId, setFolderId] = useState(settings.driveRootFolderId || '');

  async function onScan() {
    setCredentials(apiKey, folderId);
    await testAccess();
  }

  return (
    <Card className="p-4">
      <Tabs defaultValue="drive">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="drive">Google Drive</TabsTrigger>
          <TabsTrigger value="manifest">Manifest JSON</TabsTrigger>
          <TabsTrigger value="local">Local Files</TabsTrigger>
        </TabsList>

        <TabsContent value="drive" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Google API Key</Label>
              <Input value={apiKey} onChange={(e)=>setApiKey(e.target.value)} placeholder="Your Google Drive API key" />
            </div>
            <div>
              <Label>Root Folder ID</Label>
              <Input value={folderId} onChange={(e)=>setFolderId(e.target.value)} placeholder="Google Drive folder ID" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={onScan} className="gap-2"><Cloud className="h-4 w-4" /> Scan Folder</Button>
            <span className="text-sm text-muted-foreground">Scan hanya untuk konek & validasi. Pencarian dilakukan saat kamu Search.</span>
          </div>
        </TabsContent>

        <TabsContent value="manifest">
          <div className="text-sm text-muted-foreground">Manifest mode tidak berubah.</div>
        </TabsContent>

        <TabsContent value="local">
          <div className="text-sm text-muted-foreground">Local mode tetap seperti sebelumnya.</div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
