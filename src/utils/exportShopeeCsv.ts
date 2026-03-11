// utils/exportShopeeCsv.ts
// Final, no-placeholder implementation for Shopee CSV export.

type ImageMeta = {
  id: string;
  name: string;
  webViewLink: string;
  downloadUrl?: string;
  path?: string[];
};

type ProductLike = {
  slug?: string;
  title?: string;
  tags?: string[];
  imagesAll?: ImageMeta[];
  imagesPicked?: ImageMeta[];
};

export type ProductImage =
  | { productName: string; images: string[] }
  | ProductLike;

function normalizeProduct(p: ProductImage): { name: string; images: string[] } {
  if ((p as any)?.productName && Array.isArray((p as any)?.images)) {
    const s = p as any;
    return {
      name: String(s.productName || "").trim(),
      images: (s.images || []).filter(Boolean),
    };
  }

  const pl = p as ProductLike;
  const name = String(pl.title || pl.slug || "").trim();
  const picked = (pl.imagesPicked || []).map(i => i.downloadUrl || i.webViewLink).filter(Boolean);
  const all = (pl.imagesAll || []).map(i => i.downloadUrl || i.webViewLink).filter(Boolean);
  const images = picked.length ? picked : all;
  return { name, images };
}

const SHOPEE_HEADERS = [
  "Nama Produk",
  "Deskripsi Produk",
  "Kategori",
  "Harga",
  "Stok",
  "SKU Induk",
  "Gambar1","Gambar2","Gambar3","Gambar4","Gambar5","Gambar6","Gambar7","Gambar8","Gambar9",
] as const;

type Row = Record<(typeof SHOPEE_HEADERS)[number], string | number | boolean | null | undefined>;

function csvEscape(val: unknown): string {
  if (val === null || val === undefined) return "";
  const s = String(val);
  const needsQuote = /[",\n\r]/.test(s);
  const escaped = s.replace(/"/g, '""');
  return needsQuote ? `"${escaped}"` : escaped;
}

function toCSV(headers: readonly string[], rows: Row[]): string {
  const head = headers.join(",");
  const body = rows
    .map(row => headers.map(h => csvEscape(row[h as keyof Row])).join(","))
    .join("\n");
  return head + "\n" + body + "\n";
}

export function generateShopeeCSV(products: ProductImage[]): string {
  const rows: Row[] = products
    .map(normalizeProduct)
    .filter(p => p.name)
    .map(({ name, images }) => {
      const imgs = images.slice(0, 9);
      const sku = name
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .slice(0, 60);

      const row: Row = {
        "Nama Produk": name,
        "Deskripsi Produk": (pl as any)?.description || "",
        "Kategori": "",
        "Harga": (pl as any)?.price || 0,
        "Stok": (pl as any)?.stock || 0,
        "SKU Induk": sku || "",
        "Gambar1": imgs[0] || "",
        "Gambar2": imgs[1] || "",
        "Gambar3": imgs[2] || "",
        "Gambar4": imgs[3] || "",
        "Gambar5": imgs[4] || "",
        "Gambar6": imgs[5] || "",
        "Gambar7": imgs[6] || "",
        "Gambar8": imgs[7] || "",
        "Gambar9": imgs[8] || "",
      };
      return row;
    });

  return toCSV([...SHOPEE_HEADERS], rows);
}

export function downloadShopeeCSV(products: ProductImage[], filename = "shopee.csv") {
  const csvContent = generateShopeeCSV(products);
  const blob = (typeof window !== "undefined" ? new Blob : (() => { throw new Error("Blob is not supported in this env") })())([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}


// ==============================================
// V3 stream + log tracker
// ==============================================
import { addLog } from '@/store/logs';

function ulid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2,10);
}

async function sha256Blob(blob: Blob): Promise<string> {
  const buf = await blob.arrayBuffer();
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash)).map(b=>b.toString(16).padStart(2,'0')).join('');
}

export async function downloadShopeeCSVWithLog(
  products: ProductImage[],
  filename = 'shopee.csv',
  meta?: { rootFolderId?: string; query?: string }
) {
  const csvContent = generateShopeeCSV(products);
  const blob = (typeof window !== "undefined" ? new Blob : (() => { throw new Error("Blob is not supported in this env") })())([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);

  const sha = await sha256Blob(blob);
  addLog({
    id: ulid(),
    timestamp: new Date(new Date().getTime()+8*3600*1000).toISOString(),
    rootFolderId: meta?.rootFolderId || '',
    query: meta?.query,
    selectedProducts: products.length,
    selectedImages: products.reduce((n,p)=>n+((p as any).images?.length||0),0),
    csvFilename: filename,
    csvFilesize: blob.size,
    csvSha256: sha,
    status: 'success',
    downloadUrl: url
  });
}

