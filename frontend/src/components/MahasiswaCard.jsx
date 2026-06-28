import React from 'react';

const MahasiswaCard = ({ item, isSelected, onSelect, onUpdate, onDelete }) => {
  return (
    <div
      className={`mahasiswa-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(item)}
    >
      <div className="card-header-row">
        <h3>{item.namaLengkap}</h3>
        <div className="card-actions">
          <button
            className="btn-icon btn-edit"
            onClick={(e) => {
              e.stopPropagation();
              onUpdate(item);
            }}
            title="Update"
          >
            ✏️
          </button>
          <button
            className="btn-icon btn-delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="card-info">
        <p><strong>NIM:</strong> {item.nim}</p>
        <p><strong>Jenjang:</strong> {item.jenjang}</p>
      </div>

      <div className="card-detail">
        <p>Jurusan: {item.jurusan}</p>
        <p>Fakultas: {item.fakultas}</p>
      </div>
    </div>
  );
};

export default MahasiswaCard;