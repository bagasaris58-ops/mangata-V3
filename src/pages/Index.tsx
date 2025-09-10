import { SearchProvider } from "@/contexts/ProductContext"
import { ProductGrid } from "@/components/search/ProductGrid"
import { SearchInput } from "@/components/search/SearchInput"
import { SourceSettings } from "@/components/source/SourceSettings"

export default function IndexPage() {
  return (
    <>
      <div className="text-center my-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Mangata Drive Showcase
        </h1>
        <p className="text-muted-foreground">
          Streamlined photo management for e-commerce. Search, select, and export your product images with ease.
        </p>
      </div>

      <SearchProvider>
        <div className="flex flex-col items-center w-full px-4">
          <SearchInput />
          <div className="w-full max-w-4xl mt-4">
            <SourceSettings />
            <ProductGrid />
          </div>
        </div>
      </SearchProvider>
    </>
  )
}
