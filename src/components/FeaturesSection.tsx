"use client";

export default function FeaturesSection() {
  const features = [
    {
      title: "Free Shipping",
      description: "On orders over $50",
      gradient: "from-[#d97757] to-[#c76543]",
    },
    {
      title: "Secure Payment",
      description: "100% secure transactions",
      gradient: "from-[#8b7355] to-[#a68a6f]",
    },
    {
      title: "Easy Returns",
      description: "30-day return policy",
      gradient: "from-[#7fad7a] to-[#6b9c67]",
    },
    {
      title: "24/7 Support",
      description: "Dedicated customer service",
      gradient: "from-[#d4a574] to-[#c89860]",
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 my-16">
      {features.map((feature, idx) => (
        <div
          key={idx}
          className="feature-card-3d group"
          style={{ animationDelay: `${idx * 100}ms` }}
        >
          <div className="feature-card-inner">
            <div className="feature-card-front">
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
              />
              <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 text-center">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-4 feature-icon-rotate`} />
                <h3 className="font-bold text-gray-900 text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

