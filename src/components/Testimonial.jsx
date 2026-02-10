import React from "react";
import {
  FaPaintBrush,
  FaPencilAlt,
  FaPalette,
  FaRulerCombined,
} from "react-icons/fa";

export default function Testimonial() {
  const quotes = [
    {
      icon: <FaPaintBrush className="w-6 h-6 text-brown-700" />,
      text: `"FilipinoArt.ph is the first online store offering authentic Filipino art supplies."`,
      source: "LocalArt.ph",
    },
    {
      icon: <FaPencilAlt className="w-6 h-6 text-brown-700" />,
      text: `"You can now 'add to craft' handmade materials from local artisans."`,
      source: "CraftWorld",
    },
    {
      icon: <FaPalette className="w-6 h-6 text-brown-700" />,
      text: `"Need supplies for your next creative project? Shop online now!"`,
      source: "ArtBiz",
    },
    {
      icon: <FaRulerCombined className="w-6 h-6 text-brown-700" />,
      text: `"Filipino art supplies are making their mark online with quality and originality."`,
      source: "Philippine Craft News",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-semibold mb-8 text-center">
        What They Say About Us
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quotes.map((quote, idx) => (
          <div
            key={idx}
            className="p-6 border rounded-lg shadow hover:shadow-md transition flex items-start gap-4"
          >
            <div>{quote.icon}</div>
            <div>
              <p className="italic text-gray-700">{quote.text}</p>
              <p className="mt-2 font-semibold text-gray-900 text-right">
                — {quote.source}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
