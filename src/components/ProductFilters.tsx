"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  slug: string;
  price: any;
  stock: number;
  images: { url: string }[];
  createdAt: Date;
};

type ProductFiltersProps = {
  products: Product[];
};

export default function ProductFilters({ products }: ProductFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc">("newest");
  const [selectedQuickView, setSelectedQuickView] = useState<Product | null>(null);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return Number(a.price) - Number(b.price);
        case "price-desc":
          return Number(b.price) - Number(a.price);
        case "newest":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return result;
  }, [products, searchQuery, sortBy]);

  const isNew = (createdAt: Date) => {
    const daysSinceCreated = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceCreated < 7;
  };

  return (
    <>
      {/* Modern Search and Filters */}
      <div className="mb-10 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Bar with 3D effect */}
          <div className="flex-1 relative search-container">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:outline-none focus:border-[#d97757] transition-all bg-white shadow-sm hover:shadow-md"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold transition-all hover:rotate-90"
              >
                ×
              </button>
            )}
          </div>

          {/* Sort Dropdown with 3D effect */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-6 py-4 rounded-2xl border-2 border-gray-200 focus:outline-none focus:border-[#d97757] bg-white transition-all cursor-pointer shadow-sm hover:shadow-md font-medium"
          >
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        {/* Results count with modern styling */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <span className="font-bold text-[#d97757] text-lg">{filteredAndSortedProducts.length}</span>
            <span className="ml-2">{filteredAndSortedProducts.length === 1 ? "product" : "products"}</span>
            {searchQuery && <span className="ml-1 text-gray-500">matching &quot;{searchQuery}&quot;</span>}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredAndSortedProducts.length === 0 ? (
        <div className="text-center py-24">
          <div className="empty-state-icon mb-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#f4f2f0] to-[#e8e5e1] rounded-full flex items-center justify-center border-2 border-gray-200">
              <div className="text-4xl text-[#d97757] font-bold">?</div>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search terms</p>
          <button
            onClick={() => setSearchQuery("")}
            className="px-6 py-3 bg-[#d97757] text-white rounded-full font-semibold hover:bg-[#c76543] transition-all hover:scale-105 shadow-lg"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredAndSortedProducts.map((p, idx) => (
            <div
              key={p.id}
              className="product-card-3d group"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              {/* Badges */}
              <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                {isNew(p.createdAt) && (
                  <span className="badge-new">
                    NEW
                  </span>
                )}
                {p.stock <= 5 && p.stock > 0 && (
                  <span className="badge-warning">
                    LOW STOCK
                  </span>
                )}
                {p.stock === 0 && (
                  <span className="badge-danger">
                    SOLD OUT
                  </span>
                )}
              </div>

              <Link href={`/products/${p.slug}`} className="block h-full">
                {/* Image with 3D hover effect */}
                <div className="relative overflow-hidden rounded-t-2xl">
                  <div className="aspect-[4/3] relative">
                    <img
                      src={p.images[0]?.url || "https://picsum.photos/seed/placeholder/600/400"}
                      alt={p.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>

                {/* Product Info with gradient background */}
                <div className="p-5 bg-gradient-to-br from-white to-gray-50 rounded-b-2xl">
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#d97757] transition-colors text-lg">
                    {p.name}
                  </h3>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-2xl font-black bg-gradient-to-r from-[#d97757] to-[#8b7355] bg-clip-text text-transparent">
                      ${Number(p.price).toFixed(2)}
                    </p>
                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {p.stock > 0 ? `${p.stock} left` : "Out"}
                    </span>
                  </div>
                </div>
              </Link>

              {/* Quick View Button with modern design */}
              <button
                onClick={() => setSelectedQuickView(p)}
                className="quick-view-btn"
              >
                Quick View
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Quick View Modal with glassmorphism */}
      {selectedQuickView && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedQuickView(null)}
        >
          <div
            className="modal-content-3d"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-lg border-b px-8 py-5 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-[#d97757] to-[#8b7355] bg-clip-text text-transparent">
                Quick Preview
              </h2>
              <button
                onClick={() => setSelectedQuickView(null)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-2xl transition-all hover:rotate-90"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 grid md:grid-cols-2 gap-10">
              <div className="modal-image-container">
                <img
                  src={
                    selectedQuickView.images[0]?.url ||
                    "https://picsum.photos/seed/placeholder/800/600"
                  }
                  alt={selectedQuickView.name}
                  className="w-full rounded-2xl shadow-2xl"
                />
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-3">
                    {selectedQuickView.name}
                  </h3>
                  <p className="text-4xl font-black bg-gradient-to-r from-[#d97757] to-[#8b7355] bg-clip-text text-transparent">
                    ${Number(selectedQuickView.price).toFixed(2)}
                  </p>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  {isNew(selectedQuickView.createdAt) && (
                    <span className="badge-new">NEW</span>
                  )}
                  {selectedQuickView.stock <= 5 && selectedQuickView.stock > 0 && (
                    <span className="badge-warning">
                      Only {selectedQuickView.stock} left
                    </span>
                  )}
                  {selectedQuickView.stock === 0 && (
                    <span className="badge-danger">SOLD OUT</span>
                  )}
                </div>

                {/* Action Button */}
                <Link
                  href={`/products/${selectedQuickView.slug}`}
                  className="block w-full bg-gradient-to-r from-[#d97757] to-[#8b7355] text-white px-8 py-4 rounded-2xl font-bold text-center hover:shadow-2xl transition-all hover:scale-105 text-lg"
                >
                  View Full Details
                </Link>

                {/* Product Info */}
                <div className="pt-6 border-t space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-gray-700">SKU</span>
                    <span className="text-gray-600">{selectedQuickView.id}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-gray-700">Stock</span>
                    <span className={`font-bold ${
                      selectedQuickView.stock === 0 ? "text-red-600" :
                      selectedQuickView.stock <= 5 ? "text-orange-600" :
                      "text-green-600"
                    }`}>
                      {selectedQuickView.stock} units
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
