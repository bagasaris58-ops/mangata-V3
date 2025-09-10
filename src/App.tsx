import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProductsProvider } from "@/contexts/ProductContext";

import { SearchHeader } from "@/components/search/SearchHeader";
import { DataSourceTabs } from "@/components/search/DataSourceTabs";
import { ProductGrid } from "@/components/search/ProductGrid";
import { ProductDrawer } from "@/components/product/ProductDrawer";
import Settings from "@/pages/Settings";
import Batch from "@/pages/Batch";
import Logs from "@/pages/Logs";
import Review from "@/pages/Review";

const Home: React.FC = () => {
  useEffect(() => {
    document.title = 'Mangata Drive Showcase';
  }, []);

  return (
    <div className="p-6 space-y-6">
      <SearchHeader />
      <DataSourceTabs />
      <ProductGrid />
      <ProductDrawer />
    </div>
  );
};

const NotFound: React.FC = () => (
  <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-2 p-6">
    <h1 className="text-2xl font-semibold">Page not found</h1>
    <p className="text-muted-foreground">The page you’re looking for doesn’t exist.</p>
  </div>
);

const App: React.FC = () => {
  return (
    <ProductsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/batch" element={<Batch />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/index" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/review" element={<Review />} />
        </Routes>
      </BrowserRouter>
    </ProductsProvider>
  );
};

export default App;

