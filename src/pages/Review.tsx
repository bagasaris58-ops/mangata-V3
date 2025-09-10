import React from 'react';
import { useProducts } from '@/contexts/ProductContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { downloadShopeeCSVWithLog } from '@/utils/exportShopeeCsv';
import { useAppStore } from '@/store';

const Review: React.FC = () => {
  const { batch, removeFromBatch, clearBatch } = useProducts();
  const { settings } = useAppStore();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <button className="px-3 py-2 border rounded" onClick={() => navigate(-1)}>← Kembali</button>
        <h1 className="text-xl font-semibold">Review</h1>
        <div />
      </div>

      {batch.length === 0 ? (
        <div className="text-muted-foreground">Batch kosong. Tambahkan produk dari halaman Search.</div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {batch.map(p => (
              <div key={p.slug} className="border rounded p-2">
                <div className="font-medium">{p.title}</div>
                <div className="grid grid-cols-3 gap-1 mt-2">
                  {p.imagesPicked?.slice(0,6).map(img => (
                    <img key={img.id} src={img.webViewLink} className="w-full h-20 object-cover rounded" />
                  ))}
                </div>
                <div className="flex justify-end mt-2">
                  <Button variant="ghost" onClick={()=>removeFromBatch(p.slug)}>Remove</Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-6">
            <Button variant="ghost" onClick={()=>clearBatch()}>Clear Batch</Button>
            <Button onClick={()=>downloadShopeeCSVWithLog(batch as any, 'shopee.csv', { rootFolderId: settings.driveRootFolderId })}>
              Export to Shopee CSV
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Review;
