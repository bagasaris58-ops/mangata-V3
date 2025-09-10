import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Package, Settings } from 'lucide-react';
import { useProducts } from '@/contexts/ProductContext';
import { useNavigate } from 'react-router-dom';

export const SearchHeader = () => {
  const { setFilterQuery, batch, filteredProducts, remoteSearch, isScanning } = useProducts();
  const navigate = useNavigate();
  const [localQ, setLocalQ] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setFilterQuery(localQ), 200);
    return () => clearTimeout(t);
  }, [localQ, setFilterQuery]);

  async function onSubmit(e: unknown) {
    e.preventDefault();
    if (!localQ.trim()) return;
    await remoteSearch(localQ.trim());
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between gap-3">
        <form onSubmit={onSubmit} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari produk berdasarkan nama, kategori, atau tag..."
              className="pl-9"
              value={localQ}
              onChange={(e) => setLocalQ(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={isScanning}>Search</Button>
        </form>
        <Button variant="outline" onClick={() => navigate('/settings')} className="gap-2">
          <Settings className="h-4 w-4" /> Settings
        </Button>
        <Button variant="secondary" onClick={() => navigate('/batch')} className="gap-2">
          <Package className="h-4 w-4" /> Batch
          {batch.length > 0 && <Badge variant="secondary">{batch.length}</Badge>}
        </Button>
      </div>
      <div className="mt-2 text-sm text-muted-foreground">
        {filteredProducts.length} produk ditemukan
      </div>
    </div>
  );
};
