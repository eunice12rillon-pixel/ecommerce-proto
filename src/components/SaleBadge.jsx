import React from "react";

export default function SaleBadge({ onClose }) {
  return (
    <div className="pointer-events-none fixed right-3 top-1/2 -translate-y-1/2 z-20">
      <div className="relative pointer-events-auto hidden lg:flex bg-red-500 text-white rounded-full w-24 h-24 shadow-xl animate-bounce flex-col items-center justify-center rotate-12 border-4 border-yellow-300">
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-black text-white text-sm font-bold flex items-center justify-center hover:bg-gray-800"
          aria-label="Close sale badge"
        >
          x
        </button>
        <span className="text-[10px] font-semibold tracking-wide">UP TO</span>
        <span className="text-2xl font-extrabold leading-none">50%</span>
        <span className="text-xs font-bold">SALE</span>
      </div>

      <div className="relative pointer-events-auto lg:hidden bg-red-500 text-white rounded-full w-16 h-16 shadow-lg flex flex-col items-center justify-center border-2 border-yellow-300">
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center"
          aria-label="Close sale badge"
        >
          x
        </button>
        <span className="text-[8px] font-semibold leading-none">UP TO</span>
        <span className="text-base font-extrabold leading-none">50%</span>
      </div>
    </div>
  );
}
