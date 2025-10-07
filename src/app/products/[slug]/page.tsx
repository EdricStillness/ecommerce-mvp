import AddToCartButton from "@/components/AddToCartButton";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { images: { orderBy: { sort: "asc" } } },
  });

  if (!product) return notFound();

  const isNew = () => {
    const daysSinceCreated = (Date.now() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceCreated < 7;
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
        <Link href="/" className="hover:text-[#d97757] transition-colors">
          Home
        </Link>
        <span>›</span>
        <span className="text-gray-900 font-medium">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-white shadow-xl">
            <img
              src={product.images[0]?.url || "https://picsum.photos/seed/placeholder/800/600"}
              alt={product.name}
              className="w-full aspect-square object-cover"
            />
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              {isNew() && (
                <span className="badge-new">
                  NEW
                </span>
              )}
              {product.stock <= 5 && product.stock > 0 && (
                <span className="badge-warning">
                  Only {product.stock} left!
                </span>
              )}
              {product.stock === 0 && (
                <span className="badge-danger">
                  SOLD OUT
                </span>
              )}
            </div>
          </div>

          {/* Thumbnail gallery if multiple images */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, idx) => (
                <div
                  key={img.id}
                  className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-[#d97757] transition-all cursor-pointer"
                >
                  <img
                    src={img.url}
                    alt={`${product.name} ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              {product.name}
            </h1>
            <div className="flex items-baseline gap-3">
              <p className="text-4xl font-bold bg-gradient-to-r from-[#d97757] to-[#8b7355] bg-clip-text text-transparent">
                ${Number(product.price).toFixed(2)}
              </p>
              {product.stock > 0 && product.stock <= 10 && (
                <span className="text-sm text-orange-600 font-medium">
                  Only {product.stock} in stock!
                </span>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* Description */}
          {product.description && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Product Details */}
          <div className="bg-gradient-to-br from-[#faf9f8] to-[#f4f2f0] rounded-xl p-6 space-y-3 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Product Details</h3>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-gray-700">SKU:</span>
              <span className="text-gray-600">{product.sku}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-gray-700">Stock:</span>
              <span className={`font-semibold ${
                product.stock === 0 ? "text-red-600" : 
                product.stock <= 5 ? "text-orange-600" : 
                "text-green-600"
              }`}>
                {product.stock === 0 ? "Out of stock" : `${product.stock} units available`}
              </span>
            </div>
          </div>

          {/* Add to Cart */}
          <AddToCartButton productId={product.id} disabled={product.stock <= 0} />

          {/* Trust badges */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t">
            <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-[#faf9f8] to-[#f4f2f0] rounded-xl hover:shadow-md transition-all border border-gray-200">
              <div className="w-12 h-12 bg-gradient-to-br from-[#d97757] to-[#c76543] rounded-xl flex-shrink-0"></div>
              <div className="text-sm">
                <div className="font-bold text-gray-900">Free Shipping</div>
                <div className="text-gray-600">On orders over $50</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-[#faf9f8] to-[#f4f2f0] rounded-xl hover:shadow-md transition-all border border-gray-200">
              <div className="w-12 h-12 bg-gradient-to-br from-[#8b7355] to-[#a68a6f] rounded-xl flex-shrink-0"></div>
              <div className="text-sm">
                <div className="font-bold text-gray-900">Easy Returns</div>
                <div className="text-gray-600">30-day return policy</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
