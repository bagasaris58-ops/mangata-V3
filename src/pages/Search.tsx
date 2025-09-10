import React from 'react';
import { SearchHeader } from '@/components/search/SearchHeader';
import { DataSourceTabs } from '@/components/search/DataSourceTabs';
import { ProductGrid } from '@/components/search/ProductGrid';
import { ProductDrawer } from '@/components/product/ProductDrawer';
import { useProducts } from '@/contexts/ProductContext';

const Search = () => {
  const { currentProduct } = useProducts();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        <SearchHeader />
        <DataSourceTabs />
        <ProductGrid />
      </div>
      
      {currentProduct && <ProductDrawer />}
    </div>
  );
};

export default Search;