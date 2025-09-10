import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProducts } from '@/contexts/ProductContext';
import { ArrowLeft, Package, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { downloadShopeeCSVWithLog } from '@/utils/exportShopeeCsv';
import { useAppStore } from '@/store';

const Batch = () => {
  const { batch, removeFromBatch } = useProducts();
  const navigate = useNavigate();
  const { settings } = useAppStore();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Search
          </Button>
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Batch Management
            </h1>
          </div>
          <Badge variant="secondary" className="ml-auto">
            {batch.length} products
          </Badge>
        </div>

        {batch.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No products in batch</h3>
            <p className="text-muted-foreground mb-6">
              Add products from the search page to get started
            </p>
            <Button onClick={() => navigate('/')} className="bg-gradient-primary">
              Browse Products
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {batch.map((product) => (
              <Card key={product.slug} className="p-6 shadow-elegant">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{product.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {product.imagesPicked.length} images selected
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeFromBatch(product.slug)}
                    className="gap-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </Card>
            ))}
            
            <div className="flex justify-center pt-6">
              <Button
                onClick={() => navigate('/review')}
                className="bg-gradient-primary px-8 py-3 text-lg"
                disabled={batch.length === 0}
              >
                Continue to Review
              </Button>
            </div>
          </div>
        )}
              <div className="mt-6 flex justify-end">
          <Button onClick={() => downloadShopeeCSVWithLog(batch as any, 'shopee.csv', { rootFolderId: settings.driveRootFolderId })} className="gap-2">
            Export to Shopee CSV
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Batch;