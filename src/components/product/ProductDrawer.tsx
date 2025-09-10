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

  if (!currentProduct) return null;

  const images = currentProduct.imagesAll || [];
  const featuredImages = images.slice(0, 9); // First 9 as featured
  const otherImages = images.slice(9); // Rest as other images

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
      imagesPicked: selectedImageMetas
    };
    
    addToBatch(updatedProduct);
    toast.success('Added to batch for later processing');
    setCurrentProduct(null);
  };

  return (
    <Sheet open={!!currentProduct} onOpenChange={() => setCurrentProduct(null)}>
      <SheetContent className="w-full sm:max-w-4xl overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl">Product Details</SheetTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentProduct(null)}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Close
            </Button>
          </div>
          <SheetDescription>
            Select up to 9 images for this product. Featured images are automatically selected based on quality.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Product Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Product Title</Label>
              <Input
                id="title"
                value={productTitle}
                onChange={(e) => setProductTitle(e.target.value)}
                placeholder="Enter product title..."
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline">{currentProduct.slug}</Badge>
              <Badge variant="secondary">
                {selectedImages.length} of {Math.min(9, images.length)} selected
              </Badge>
            </div>
          </div>

          {/* Featured Images */}
          {featuredImages.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-secondary-warm" />
                <h3 className="text-lg font-semibold">Featured Images (Best Quality)</h3>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {featuredImages.map((image) => (
                  <div key={image.id} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-primary/50 transition-colors">
                      <img
  src={image.downloadUrl || image.webViewLink}
     
 alt={image.name}
 className="w-full h-full object-cover"
/>


                <div className="absolute top-2 left-2">
                      <Checkbox
                        checked={selectedImages.includes(image.id)}
                        onCheckedChange={() => toggleImageSelection(image.id)}
                        className="bg-background/80 backdrop-blur-sm"
<div className="absolute bottom-2 left-2 right-2">
                    
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other Images */}
          {otherImages.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">All Other Images</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {otherImages.map((image) => (
                  <div key={image.id} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-primary/50 transition-colors">
                      <img
                        src={image.downloadUrl || image.webViewLink.}
                        alt={image.name}
                        className="w-full h-full object-cover"
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

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setCurrentProduct(null)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveToLater}
              disabled={selectedImages.length === 0}
              className="gap-2 bg-gradient-primary"
            >
              <Save className="h-4 w-4" />
              Add to Batch
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
