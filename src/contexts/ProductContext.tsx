import React, { createContext, useContext, useMemo, useState } from 'react';
import type {
  Product,
  ImageMeta,
  DataSource,
  ScanProgress,
  ProductsContextValue,
} from '@/types/products';
import { toast } from 'sonner';
import { useAppStore } from '@/store';

const ProductsContext = createContext<ProductsContextValue | undefined>(undefined);

// group file gambar jadi produk sederhana
function buildProductsFromFiles(files: Array<{id:string; name:string; mimeType?:string; parents?:string[]}>): Product[] {
  const map = new Map<string, ImageMeta[]>();
  for (const f of files) {
    const key = (f.name || 'untitled').split(/[\s_\-]/)[0].toLowerCase();
    const list = map.get(key) || [];
    list.push({
      id: f.id,
      name: f.name,
      webViewLink: `https://drive.google.com/uc?id=${f.id}`,
    });
    map.set(key, list);
  }
  const products: Product[] = [];
  for (const [slug, images] of map) {
    products.push({
      slug,
      title: slug,
      tags: [],
      imagesAll: images,
      imagesPicked: images.slice(0, 9),
    });
  }
  return products;
}

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings, updateSettings } = useAppStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [batch, setBatch] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [filterQuery, setFilterQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState<ScanProgress>({ current: 0, total: 0 });

  const driveApiKey = settings.driveApiKey;
  const driveRootFolderId = settings.driveRootFolderId;

  function setCredentials(key?: string, rootId?: string) {
    updateSettings({
      driveApiKey: key ?? settings.driveApiKey,
      driveRootFolderId: rootId ?? settings.driveRootFolderId
    });
  }

  async function testAccess(): Promise<boolean> {
    if (!driveApiKey || !driveRootFolderId) {
      toast.error('Isi Google Drive API Key dan Root Folder ID dulu.');
      return false;
    }
    try {
      setIsScanning(true);
      const url = `https://www.googleapis.com/drive/v3/files/${driveRootFolderId}?key=${driveApiKey}&fields=id,name,mimeType`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(await res.text());
      const j = await res.json();
      if (!j?.id) throw new Error('Folder tidak valid');
      toast.success('Connected to Google Drive');
      return true;
    } catch (e: unknown) {
      toast.error('Gagal konek Drive: ' + (e?.message || e));
      return false;
    } finally {
      setIsScanning(false);
    }
  }

  async function remoteSearch(q: string, pageToken?: string) {
    if (!driveApiKey || !driveRootFolderId) {
      toast.error('Belum terhubung ke Drive.');
      return;
    }
    setIsScanning(true);
    try {
      const params = new URLSearchParams({
        q: `name contains '${q}' and '${driveRootFolderId}' in parents and trashed=false`,
        fields: 'files(id,name,mimeType,parents),nextPageToken',
        pageSize: '50',
        key: driveApiKey,
      });
      if (pageToken) params.set('pageToken', pageToken);
      const url = `https://www.googleapis.com/drive/v3/files?${params.toString()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(await res.text());
      const j = await res.json();
      const files = (j.files || []).filter((f: unknown) => (f.mimeType || '').startsWith('image/'));
      const prods = buildProductsFromFiles(files);
      setProducts(prev => pageToken ? [...prev, ...prods] : prods);
      return { nextPageToken: j.nextPageToken };
    } catch (e: unknown) {
      toast.error('Search gagal: ' + (e?.message || e));
    } finally {
      setIsScanning(false);
    }
  }

  function setDataSource(_src: DataSource) { /* keep interface */ }
  function addProduct(p: Product) { setProducts(prev => [...prev, p]); }
  function addProducts(pps: Product[]) { setProducts(prev => [...prev, ...pps]); }
  function addToBatch(p: Product) {
    setBatch(prev => prev.some(x => x.slug === p.slug) ? prev : [...prev, p]);
    toast.success('Added to batch');
  }
  function removeFromBatch(slug: string) { setBatch(prev => prev.filter(x => x.slug !== slug)); }
  function clearBatch() { setBatch([]); }
  function clearProducts() { setProducts([]); }

  const filteredProducts = useMemo(() => {
    if (!filterQuery) return products;
    const q = filterQuery.toLowerCase();
    return products.filter(p =>
      p.title.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q))
    );
  }, [products, filterQuery]);

  const value: ProductsContextValue = {
    products, filteredProducts, currentProduct, batch, filterQuery, isScanning, scanProgress,
    driveApiKey, driveRootFolderId, setCredentials, testAccess, remoteSearch,
    setDataSource, addProduct, addProducts, setCurrentProduct,
    addToBatch, removeFromBatch, clearBatch, clearProducts,
    setFilterQuery, setIsScanning, setScanProgress,
  };

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
};

export const ProductProvider = ProductsProvider;

export const useProducts = (): ProductsContextValue => {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider');
  return ctx;
};
