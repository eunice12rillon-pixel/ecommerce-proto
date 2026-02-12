// src/components/ContactUs.jsx
import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function ContactUs() {
  const policyContent = {
    "Privacy Policy":
      "We collect basic account and order information to process purchases, improve service, and keep transactions secure. We do not sell your personal data to third parties.",
    "Terms & Conditions":
      "By using Artisan Alley, you agree to provide accurate account details, follow marketplace rules, and complete payments for confirmed orders. Violations may lead to account restrictions.",
    "Return & Refund Policy":
      "Return/refund requests must be filed within 7 days after delivery with valid proof (photos/videos). Approved refunds are processed using the original payment method.",
    "Shipping Policy":
      "Orders are processed after payment confirmation and shipped based on seller location. Delivery timelines may vary by region, courier delays, and peak seasons.",
  };
  const [activePolicy, setActivePolicy] = React.useState("Privacy Policy");

  return (
    <footer className="relative overflow-hidden py-14">
      <div className="max-w-7xl mx-auto px-4">
        <div className="rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-amber-50 shadow-xl p-6 md:p-10">
          <div className="mb-8">
            <p className="text-sm font-semibold tracking-wide text-orange-600 uppercase">
              Contact Us
            </p>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
              Let&apos;s Create Something Beautiful Together
            </h2>
            <p className="mt-3 text-gray-600 max-w-2xl">
              Questions about orders, seller support, or partnerships? Reach out
              anytime. Our Artisan Alley team is ready to help.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl bg-white/90 border border-gray-100 p-5 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center">
                <FaPhone size={16} />
              </div>
              <h3 className="mt-3 font-semibold text-gray-900">Call Us</h3>
              <p className="text-sm text-gray-600 mt-1">(+63) 912 345 6789</p>
              <p className="text-sm text-gray-600">(+63) 2 8123 4567</p>
            </div>

            <div className="rounded-2xl bg-white/90 border border-gray-100 p-5 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-yellow-500 text-white flex items-center justify-center">
                <FaEnvelope size={16} />
              </div>
              <h3 className="mt-3 font-semibold text-gray-900">Email</h3>
              <p className="text-sm text-gray-600 mt-1">support@artisanalley.ph</p>
              <p className="text-sm text-gray-600">partners@artisanalley.ph</p>
            </div>

            <div className="rounded-2xl bg-white/90 border border-gray-100 p-5 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center">
                <FaMapMarkerAlt size={16} />
              </div>
              <h3 className="mt-3 font-semibold text-gray-900">Visit</h3>
              <p className="text-sm text-gray-600 mt-1">
                Makati City, Metro Manila, Philippines
              </p>
            </div>

            <div className="rounded-2xl bg-white/90 border border-gray-100 p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900">Follow Us</h3>
              <p className="text-sm text-gray-600 mt-1">
                Join our creative community and latest promos.
              </p>
              <div className="mt-4 flex gap-3">
                <div
                  className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center"
                  title="Facebook"
                >
                  <FaFacebookF size={16} />
                </div>
                <div
                  className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center"
                  title="Instagram"
                >
                  <FaInstagram size={16} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-orange-100">
            <h3 className="text-sm font-semibold tracking-wide text-gray-700 uppercase mb-3">
              Policies
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActivePolicy("Privacy Policy")}
                className={`px-3 py-1.5 rounded-full border text-sm ${
                  activePolicy === "Privacy Policy"
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-700 border-gray-200"
                }`}
              >
                Privacy Policy
              </button>
              <button
                type="button"
                onClick={() => setActivePolicy("Terms & Conditions")}
                className={`px-3 py-1.5 rounded-full border text-sm ${
                  activePolicy === "Terms & Conditions"
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-700 border-gray-200"
                }`}
              >
                Terms & Conditions
              </button>
              <button
                type="button"
                onClick={() => setActivePolicy("Return & Refund Policy")}
                className={`px-3 py-1.5 rounded-full border text-sm ${
                  activePolicy === "Return & Refund Policy"
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-700 border-gray-200"
                }`}
              >
                Return & Refund Policy
              </button>
              <button
                type="button"
                onClick={() => setActivePolicy("Shipping Policy")}
                className={`px-3 py-1.5 rounded-full border text-sm ${
                  activePolicy === "Shipping Policy"
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-700 border-gray-200"
                }`}
              >
                Shipping Policy
              </button>
            </div>
            <div className="mt-4 rounded-2xl border border-gray-200 bg-white/90 p-4">
              <h4 className="font-semibold text-gray-900">{activePolicy}</h4>
              <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                {policyContent[activePolicy]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
