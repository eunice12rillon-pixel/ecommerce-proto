// src/components/PageWrapper.jsx
import React from "react";

export default function PageWrapper({ children }) {
  return <div className="max-w-7xl mx-auto px-4">{children}</div>;
}
