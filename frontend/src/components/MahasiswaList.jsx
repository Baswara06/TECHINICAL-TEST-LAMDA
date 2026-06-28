import React from 'react';
import SearchBox from './SearchBox';
import MahasiswaCard from './MahasiswaCard';

const MahasiswaList = ({
  mahasiswaList,
  selectedId,
  searchQuery,
  onSearchChange,
  onSelect,
  onUpdate,
  onDelete,
  onResetAll,
  onExport,
}) => {
  return (
    <div className="card">
      <div className="list-header">
        <h2 className="card-title">List Data Mahasiswa</h2>
        <SearchBox value={searchQuery} onChange={onSearchChange} />
      </div>

      {/* List Mahasiswa */}
      <div className="mahasiswa-list">
        {mahasiswaList.map((item) => (
          <MahasiswaCard
            key={item.id}
            item={item}
            isSelected={selectedId === item.id}
            onSelect={onSelect}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Export Data */}
      <div className="export-section">
        <span className="export-label">Export Data</span>
        <div className="export-buttons">
          <button className="btn-export" onClick={() => onExport('excel')}>
            📊 Excel
          </button>
          <button className="btn-export" onClick={() => onExport('pdf')}>
            📄 PDF
          </button>
          <button className="btn-export" onClick={() => onExport('csv')}>
            📋 CSV
          </button>
          <button className="btn-export" onClick={() => onExport('json')}>
            🗂️ JSON
          </button>
        </div>
      </div>

      {/* RESET BUTTON - di bagian List Data Mahasiswa */}
      <div className="reset-section">
        <button className="btn-reset" onClick={onResetAll}>
          <span>🔄</span> Reset All Data
        </button>
        <p className="reset-hint">Kembali ke 0 - Menghapus semua data mahasiswa</p>
      </div>
    </div>
  );
};

export default MahasiswaList;