export type ImageMeta = {
  id: string;
  name: string;
  path?: string[];
  webViewLink: string;
  downloadUrl?: string;
};

export type Product = {
  slug: string;
  title: string;
  tags: string[];
  imagesAll: ImageMeta[];
  imagesPicked: ImageMeta[];
};

export type DataSource = "drive" | "manifest" | "local";

export type ScanProgress = { current: number; total: number; currentFolder?: string };

export type ProductsContextValue = {
  products: Product[];
  filteredProducts: Product[];
  currentProduct: Product | null;
  batch: Product[];
  filterQuery: string;
  isScanning: boolean;
  scanProgress: ScanProgress;

  // kredensial (diambil dari Settings store)
  driveApiKey?: string;
  driveRootFolderId?: string;
  setCredentials: (key?: string, rootId?: string) => void;
  testAccess: () => Promise<boolean>;
  remoteSearch: (q: string, pageToken?: string) => Promise<{ nextPageToken?: string } | void>;

  setDataSource: (src: DataSource) => void;
  addProduct: (p: Product) => void;
  addProducts: (pps: Product[]) => void;
  setCurrentProduct: (p: Product | null) => void;
  addToBatch: (p: Product) => void;
  removeFromBatch: (slug: string) => void;
  clearBatch: () => void;
  clearProducts: () => void;

  setFilterQuery: (q: string) => void;

  setIsScanning: (b: boolean) => void;
  setScanProgress: (p: ScanProgress) => void;
};
