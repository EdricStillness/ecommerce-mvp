import { prisma } from "@/lib/prisma";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import ProductFilters from "@/components/ProductFilters";

export default async function Home() {
  const products = await prisma.product.findMany({
    include: { images: { orderBy: { sort: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <HeroSection />
      
      <FeaturesSection />

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#d97757] to-[#8b7355] bg-clip-text text-transparent">
          Discover Our Products
        </h1>
        <p className="text-gray-600">
          Browse through our amazing collection of {products.length} products
        </p>
      </div>

      <ProductFilters products={products} />
    </div>
  );
}
