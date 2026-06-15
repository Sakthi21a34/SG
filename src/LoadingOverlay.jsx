import React from "react";

export default function LoadingOverlay({ message = "Processing..." }) {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] animate-fade-in">
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl flex flex-col items-center max-w-[80vw]">
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute inset-0 border-4 border-gray-100 rounded-full" />
          <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-xl">🛡️</div>
        </div>
        <p className="text-gray-800 font-bold text-center">{message}</p>
        <p className="text-gray-500 text-sm mt-1 text-center">Please wait a moment</p>
      </div>
    </div>
  );
}
