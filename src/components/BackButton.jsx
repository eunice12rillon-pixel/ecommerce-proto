import React from "react";
import { useNavigate } from "react-router-dom";

export default function BackButton({ fallbackTo = "/", label = "Back" }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(fallbackTo, { replace: true });
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition"
    >
      <span aria-hidden="true">←</span>
      <span>{label}</span>
    </button>
  );
}
