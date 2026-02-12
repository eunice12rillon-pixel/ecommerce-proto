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
                <a
                  href="https://www.facebook.com/artisanalleyph"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
                  title="Visit our Facebook page"
                >
                  <FaFacebookF size={16} />
                </a>
                <a
                  href="https://www.instagram.com/artisanalleyph"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
                  title="Visit our Instagram page"
                >
                  <FaInstagram size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
