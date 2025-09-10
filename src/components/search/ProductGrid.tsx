import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProducts } from '@/contexts/ProductContext';
import { Eye, Package, Plus } from 'lucide-react';
import { toast } from 'sonner';

export const ProductGrid = () => {
  const { filteredProducts, setCurrentProduct, addToBatch, batch } = useProducts();

  const handleViewProduct = (product: unknown) => {
    if (product.imagesAll && product.imagesAll.length > 0) {
      setCurrentProduct({ ...product });
    } else {
      toast.error('No images found for this product');
    }
  };

  const handleAddToBatch = (product: unknown) => {
    const isInBatch = batch.some((p) => p.slug === product.slug);
    if (isInBatch) {
      toast.info('Product already in batch');
      return;
    }
    addToBatch(product);
    toast.success('Added to batch');
  };

  if (filteredProducts.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-xl font-semibold mb-2">No products found</h3>
        <p className="text-muted-foreground">Try adjusting your search or scan a data source to get started</p>
      </Card>
    );
  }

  const thumb = (p: unknown) => p.imagesAll?.[0]?.webViewLink || `https://picsum.photos/seed/${p.slug}/300/300`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredProducts.map((product) => {
        const isInBatch = batch.some((p) => p.slug === product.slug);
        return (
          <Card key={product.slug} className="overflow-hidden hover:shadow-glow transition-all duration-300 group">
            <div className="aspect-square bg-gradient-subtle relative overflow-hidden">
              <img src={thumb(product)} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.title}</h3>
              <div className="flex flex-wrap gap-1 mb-3">
                {product.tags?.slice(0, 2).map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleViewProduct(product)} className="flex-1 gap-1">
                  <Eye className="h-3 w-3" /> View
                </Button>
                <Button variant={isInBatch ? 'secondary' : 'default'} size="sm" onClick={() => handleAddToBatch(product)} disabled={isInBatch} className="gap-1 bg-gradient-secondary text-secondary-foreground hover:opacity-90">
                  <Plus className="h-3 w-3" /> {isInBatch ? 'Added' : 'Batch'}
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
