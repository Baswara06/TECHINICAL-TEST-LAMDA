import React, { useState } from 'react';

const MahasiswaCard = ({ item, isSelected, onSelect, onUpdate, onDelete }) => {
  const [showDetail, setShowDetail] = useState(false);

  const handleCardClick = () => {
    onSelect(item);
    setShowDetail((prev) => !prev);
  };

  return (
    <div
      className={`mahasiswa-card ${isSelected ? 'selected' : ''}`}
      onClick={handleCardClick}
    >
      <div className="card-header-row">
        <h3>{item.namaLengkap}</h3>
        <div className="card-actions">
          <button
            className="btn-icon btn-edit"
            onClick={(e) => { e.stopPropagation(); onUpdate(item); }}
            title="Edit"
          >✏️</button>
          <button
            className="btn-icon btn-delete"
            onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
            title="Delete"
          >🗑️</button>
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

      {/* Detail lengkap */}
      {isSelected && showDetail && (
        <div className="card-expanded">
          <div className="card-expanded-divider" />
          <div className="card-expanded-row">
            <span className="expanded-label">📅 Tgl Lahir</span>
            <span className="expanded-value">{item.tanggalLahir}</span>
          </div>
          <div className="card-expanded-row">
            <span className="expanded-label">🎂 Umur</span>
            <span className="expanded-value">{item.umur} tahun</span>
          </div>
          <div className="card-expanded-row">
            <span className="expanded-label">📍 Alamat</span>
            <span className="expanded-value">{item.alamat}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MahasiswaCard;