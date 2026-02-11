import { Star, Truck, Globe, Paintbrush } from "lucide-react";

export default function InfoGrid() {
  const infoItems = [
    {
      icon: <Star className="w-9 h-9 text-yellow-500" />,
      title: "Top-rated",
      subtitle: "Local Artists & Collectors",
    },
    {
      icon: <Truck className="w-9 h-9 text-blue-500" />,
      title: "Free delivery",
      subtitle: "within Philippines",
    },
    {
      icon: <Globe className="w-9 h-9 text-green-500" />,
      title: "Worldwide",
      subtitle: "Shipping",
    },
    {
      icon: <Paintbrush className="w-9 h-9 text-purple-500" />,
      title: "Distinctively",
      subtitle: "Filipino Art",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
      {infoItems.map((item, idx) => (
        <div key={idx} className="flex flex-col items-center">
          {item.icon}
          <h3 className="mt-2 font-semibold text-lg">{item.title}</h3>
          <p className="text-gray-600">{item.subtitle}</p>
        </div>
      ))}
    </div>
  );
}
