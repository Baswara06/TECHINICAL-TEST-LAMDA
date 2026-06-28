import React from 'react';

const MahasiswaForm = ({ formData, onChange, onSave, onCancel, isEditing }) => {
  return (
    <div className="card">
      <h2 className="card-title">
        {isEditing ? '✏️ Edit Form' : 'Input Form'}
      </h2>
      <div className="form-grid">
        <div className="form-row">
          <div className="form-group">
            <label>Nama Lengkap</label>
            <input
              type="text"
              name="namaLengkap"
              placeholder="Masukkan nama..."
              value={formData.namaLengkap}
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <label>NIM</label>
            <input
              type="text"
              name="nim"
              placeholder="Masukkan NIM..."
              value={formData.nim}
              onChange={onChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Umur</label>
            <input
              type="number"
              name="umur"
              placeholder="20"
              value={formData.umur}
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <label>Tanggal Lahir</label>
            <input
              type="date"
              name="tanggalLahir"
              value={formData.tanggalLahir}
              onChange={onChange}
            />
          </div>
        </div>

        <div className="form-row triple">
          <div className="form-group">
            <label>Jurusan</label>
            <input
              type="text"
              name="jurusan"
              placeholder="Teknik Informatika..."
              value={formData.jurusan}
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <label>Fakultas</label>
            <input
              type="text"
              name="fakultas"
              placeholder="Fakultas Teknik..."
              value={formData.fakultas}
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <label>Jenjang</label>
            <select name="jenjang" value={formData.jenjang} onChange={onChange}>
              <option value="D3">D3</option>
              <option value="S1">S1</option>
              <option value="S2">S2</option>
              <option value="S3">S3</option>
            </select>
          </div>
        </div>

        <div className="form-group full-width">
          <label>Alamat</label>
          <textarea
            name="alamat"
            rows="3"
            placeholder="Masukkan alamat lengkap..."
            value={formData.alamat}
            onChange={onChange}
          />
        </div>
      </div>

      <div className="form-actions-left">
        <button className="btn-save" onClick={onSave}>
          <span>💾</span> {isEditing ? 'Update' : 'Save'}
        </button>

        {isEditing && (
          <button className="btn-cancel" onClick={onCancel}>
            <span>✖</span> Batal
          </button>
        )}
      </div>
    </div>
  );
};

export default MahasiswaForm;