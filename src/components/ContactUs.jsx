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
    <footer className="bg-white shadow-md text-black py-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Social Media */}
        <div className="flex flex-col space-y-4 items-start">
          <h3 className="text-lg font-semibold">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="https://www.facebook.com" target="_blank" rel="noreferrer">
              <div className="bg-blue-600 text-white p-3 rounded-full hover:scale-110 transition-transform">
                <FaFacebookF size={20} />
              </div>
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noreferrer"
            >
              <div className="bg-pink-500 text-white p-3 rounded-full hover:scale-110 transition-transform">
                <FaInstagram size={20} />
              </div>
            </a>
          </div>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-lg font-semibold">Contact Us</h3>
          <div className="flex items-center space-x-3">
            <div className="bg-green-500 text-white p-3 rounded-full">
              <FaPhone size={18} />
            </div>
            <div className="flex flex-col text-sm">
              <span>(632) 87465873443638465</span>
              <span>(639) 87346587436734</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-500 text-white p-3 rounded-full">
              <FaEnvelope size={18} />
            </div>
            <span className="text-sm">hellojdfngjdfnjk</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-lg font-semibold">Location</h3>
          <div className="flex items-center space-x-3">
            <div className="bg-red-500 text-white p-3 rounded-full">
              <FaMapMarkerAlt size={18} />
            </div>
            <span className="text-sm">disuhfijfdsgbkjdfhbg</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
