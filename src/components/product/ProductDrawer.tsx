import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useProducts } from '@/contexts/ProductContext';
import { X, Save, Star } from 'lucide-react';
import { toast } from 'sonner';

export const ProductDrawer = () => {
  const { currentProduct, setCurrentProduct, addToBatch } = useProducts();
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [productTitle, setProductTitle] = useState(currentProduct?.title || '');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');

  if (!currentProduct) return null;

  const images = currentProduct.imagesAll || [];
  const featuredImages = images.slice(0, 9);
  const otherImages = images.slice(9);

  const toggleImageSelection = (imageId: string) => {
    setSelectedImages(prev =>
      prev.includes(imageId)
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const handleSaveToLater = () => {
    const selectedImageMetas = images.filter(img => selectedImages.includes(img.id));
    const updatedProduct = {
      ...currentProduct,
      title: productTitle,
      imagesPicked: selectedImageMetas.length > 0 ? selectedImageMetas : images.slice(0, 9),
      price: parseFloat(price) || 0,
      stock: parseInt(stock) || 0,
      description,
    };
    addToBatch(updatedProduct);
    toast.success('Ditambahkan ke batch!');
    setCurrentProduct(null);
  };

  return (
    <Sheet open={!!currentProduct} onOpenChange={() => setCurrentProduct(null)}>
      <SheetContent className="w-full sm:max-w-4xl overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl">Detail Produk</SheetTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentProduct(null)}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Tutup
            </Button>
          </div>
          <SheetDescription>
            Pilih hingga 9 gambar, lalu isi info produk sebelum ditambahkan ke batch.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Nama Produk</Label>
              <Input
                id="title"
                value={productTitle}
                onChange={(e) => setProductTitle(e.target.value)}
                placeholder="Masukkan nama produk..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Harga (Rp)</Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="cth: 75000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stok</Label>
                <Input
                  id="stock"
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="cth: 100"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi Produk</Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Deskripsi singkat produk..."
                rows={3}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline">{currentProduct.slug}</Badge>
              <Badge variant="secondary">
                {selectedImages.length > 0 ? selectedImages.length : Math.min(9, images.length)} gambar dipilih
              </Badge>
            </div>
          </div>

          {featuredImages.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <h3 className="text-lg font-semibold">Gambar Utama</h3>
                <span className="text-xs text-muted-foreground">(kosong = ambil semua otomatis)</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {featuredImages.map((image) => (
                  <div key={image.id} className="relative group">
                    <div className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImages.includes(image.id) ? 'border-primary' : 'border-transparent hover:border-primary/50'
                    }`}>
                      <img
                        src={image.downloadUrl || image.webViewLink}
                        alt={image.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${image.id}/300/300`; }}
                      />
                    </div>
                    <div className="absolute top-2 left-2">
                      <Checkbox
                        checked={selectedImages.includes(image.id)}
                        onCheckedChange={() => toggleImageSelection(image.id)}
                        className="bg-background/80 backdrop-blur-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {otherImages.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Gambar Lainnya</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {otherImages.map((image) => (
                  <div key={image.id} className="relative group">
                    <div className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImages.includes(image.id) ? 'border-primary' : 'border-transparent hover:border-primary/50'
                    }`}>
                      <img
                        src={image.downloadUrl || image.webViewLink}
                        alt={image.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${image.id}/300/300`; }}
                      />
                    </div>
                    <div className="absolute top-1 left-1">
                      <Checkbox
                        checked={selectedImages.includes(image.id)}
                        onCheckedChange={() => toggleImageSelection(image.id)}
                        className="bg-background/80 backdrop-blur-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setCurrentProduct(null)}>
              Batal
            </Button>
            <Button onClick={handleSaveToLater} className="gap-2 bg-gradient-primary">
              <Save className="h-4 w-4" />
              Tambah ke Batch
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
