import { useNavigate } from 'react-router-dom';
import React, { useRef } from 'react';
import { useAppStore } from '@/store';
import { useProducts } from '@/contexts/ProductContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon, Database, Image as ImageIcon, Download, Upload, Palette, Trash2 } from 'lucide-react';

export default function Settings() {
  const navigate = useNavigate();
  const { settings, updateSettings, replaceSettings, clearSettings, DEFAULT_SETTINGS } = useAppStore();
  const { clearBatch } = useProducts();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const exportSettings = () => {
    const blob = (typeof window !== "undefined" ? new Blob : (() => { throw new Error("Blob is not supported in this env") })())([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'mangata-settings.json';
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  };

  const importSettings = async (file: File) => {
    try { const text = await file.text(); replaceSettings(JSON.parse(text)); alert('Settings imported'); }
    catch { alert('Invalid settings file'); }
  };

  const handleClearAll = () => {
    clearBatch();
    if (typeof localStorage !== 'undefined') localStorage.removeItem('scanCache');
    clearSettings();
    alert('All data cleared');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2"><SettingsIcon className="h-8 w-8 text-primary" />Settings</h1>
        <p className="text-muted-foreground">Configure your Mangata Drive Showcase preferences</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="compression">Compression</TabsTrigger>
          <TabsTrigger value="csv">CSV Mapping</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Database className="h-5 w-5" />Data Sources</CardTitle>
              <CardDescription>Configure your data source connections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="drive-api-key">Google Drive API Key</Label>
                <Input id="drive-api-key" type="password" placeholder="Your Google Drive API key" value={settings.driveApiKey || ''} onChange={(e) => updateSettings({ driveApiKey: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="drive-folder-id">Root Folder ID</Label>
                <Input id="drive-folder-id" placeholder="Google Drive folder ID" value={settings.driveRootFolderId || ''} onChange={(e) => updateSettings({ driveRootFolderId: e.target.value })} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Default Product Settings</CardTitle>
              <CardDescription>Default values for new products</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="default-weight">Default Weight (kg)</Label>
                  <Input id="default-weight" type="number" step="0.1" value={settings.defaults.weight ?? ''}
                    onChange={(e) => updateSettings({ defaults: { ...settings.defaults, weight: parseFloat(e.target.value) || 0 } })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="default-stock">Default Stock</Label>
                  <Input id="default-stock" type="number" value={settings.defaults.stock ?? ''}
                    onChange={(e) => updateSettings({ defaults: { ...settings.defaults, stock: parseInt(e.target.value) || 0 } })} />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="default-preorder" checked={!!settings.defaults.preorder}
                  onCheckedChange={(checked) => updateSettings({ defaults: { ...settings.defaults, preorder: !!checked } })} />
                <Label htmlFor="default-preorder">Enable preorder by default</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compression" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ImageIcon className="h-5 w-5" />Image Compression</CardTitle>
              <CardDescription>Configure automatic image compression settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="max-dimension">Max Dimension (px)</Label>
                  <Input id="max-dimension" type="number" value={settings.compression.maxDimension}
                    onChange={(e) => updateSettings({ compression: { ...settings.compression, maxDimension: parseInt(e.target.value) || 2000 } })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target-size">Target Size (MB)</Label>
                  <Input id="target-size" type="number" step="0.1" value={settings.compression.targetSize}
                    onChange={(e) => updateSettings({ compression: { ...settings.compression, targetSize: parseFloat(e.target.value) || 2 } })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quality">Quality (0-1)</Label>
                  <Input id="quality" type="number" step="0.05" min="0" max="1" value={settings.compression.quality}
                    onChange={(e) => updateSettings({ compression: { ...settings.compression, quality: parseFloat(e.target.value) || 0.85 } })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="format">Format</Label>
                  <select id="format" className="w-full px-3 py-2 rounded-md border border-input bg-background" value={settings.compression.format}
                    onChange={(e) => updateSettings({ compression: { ...settings.compression, format: e.target.value as 'webp' | 'jpeg' } })}>
                    <option value="webp">WebP</option>
                    <option value="jpeg">JPEG</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="csv" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Download className="h-5 w-5" />Shopee CSV Mapping</CardTitle>
              <CardDescription>Customize how your product data maps to Shopee CSV columns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(settings.csvMapping).map(([csvColumn, productField]) => (
                  <div key={csvColumn} className="grid grid-cols-2 gap-4 items-center">
                    <Label className="font-medium">{csvColumn}</Label>
                    <Input value={productField} onChange={(e) => updateSettings({ csvMapping: { ...settings.csvMapping, [csvColumn]: e.target.value } })} placeholder="Product field" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5" />Store Branding</CardTitle>
              <CardDescription>Customize your store branding and templates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="store-name">Store Name</Label>
                <Input id="store-name" value={settings.branding.storeName || ''} onChange={(e) => updateSettings({ branding: { ...settings.branding, storeName: e.target.value } })} placeholder="Your store name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title-template">Title Template</Label>
                <Input id="title-template" value={settings.branding.titleTemplate || ''} onChange={(e) => updateSettings({ branding: { ...settings.branding, titleTemplate: e.target.value } })} placeholder="{TITLE} - {BRAND}" />
                <p className="text-xs text-muted-foreground">Use {'{TITLE}'}, {'{BRAND}'}, {'{CATEGORY}'} as placeholders</p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="watermark" checked={!!settings.branding.watermark} onCheckedChange={(checked) => updateSettings({ branding: { ...settings.branding, watermark: !!checked } })} />
                <Label htmlFor="watermark">Add watermark to images</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Upload className="h-5 w-5" />Data Management</CardTitle>
              <CardDescription>Backup and restore your application data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Button variant="outline" className="flex-1" onClick={exportSettings}><Download className="h-4 w-4" />Export Settings</Button>
                <input type="file" accept="application/json" className="hidden" ref={fileInputRef}
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) importSettings(f); if (fileInputRef.current) fileInputRef.current.value = ''; }} />
                <Button variant="outline" className="flex-1" onClick={() => fileInputRef.current?.click()}><Upload className="h-4 w-4" />Import Settings</Button>
              </div>
              <div className="pt-4 border-t">
                <Button variant="destructive" className="w-full" onClick={handleClearAll}><Trash2 className="h-4 w-4" />Clear All Data</Button>
                <p className="text-xs text-muted-foreground mt-2">This will delete all batches and reset settings. (Products in memory will be cleared after reload.)</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
