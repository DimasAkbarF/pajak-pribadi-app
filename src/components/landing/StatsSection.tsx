import React from "react";

const StatsSection: React.FC = () => {
  return (
    <section className="stats-section">
      <div className="container mx-auto text-center py-12">
        <h2 className="text-4xl font-bold mb-4">50K+ Perhitungan</h2>
        <p className="text-lg text-gray-400">99.9% Akurat</p>
        <p className="text-lg text-gray-400">4 Modul Pajak</p>
        <p className="text-lg text-gray-400">0 Biaya</p>
      </div>
    </section>
  );
};

export default StatsSection;