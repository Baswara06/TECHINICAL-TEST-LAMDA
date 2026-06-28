import { useState, useEffect, useCallback } from 'react';
import MahasiswaForm from './components/MahasiswaForm';
import MahasiswaList from './components/MahasiswaList';
import mahasiswaService from './services/mahasiswaService';
import './App.css';

const INITIAL_FORM = {
  namaLengkap: '',
  nim: '',
  umur: '',
  tanggalLahir: '',
  jurusan: '',
  fakultas: '',
  jenjang: 'S1',
  alamat: '',
};

function App() {
  const [mahasiswaList, setMahasiswaList] = useState([]);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [selectedId, setSelectedId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotif = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const toFrontend = (item) => ({
    id: item.id,
    namaLengkap: item.nama,
    nim: item.nim,
    umur: item.umur,
    tanggalLahir: item.tgl_lahir,
    jurusan: item.nama_jurusan,
    fakultas: item.fakultas,
    jenjang: item.jenjang,
    alamat: item.alamat,
  });

  const toBackend = (form) => ({
    nama: form.namaLengkap,
    nim: form.nim,
    umur: parseInt(form.umur),
    tgl_lahir: form.tanggalLahir,
    nama_jurusan: form.jurusan,
    fakultas: form.fakultas,
    jenjang: form.jenjang,
    alamat: form.alamat,
  });

  const loadData = useCallback(async (search = '') => {
    setLoading(true);
    try {
      const data = await mahasiswaService.getAll(search);
      setMahasiswaList(data.map(toFrontend));
    } catch (err) {
      showNotif('Gagal memuat data: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadData(searchQuery);
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchQuery, loadData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const required = ['namaLengkap', 'nim', 'umur', 'tanggalLahir', 'jurusan', 'fakultas', 'jenjang', 'alamat'];
    for (const field of required) {
      if (!formData[field] || formData[field].toString().trim() === '') {
        showNotif(`Field ${field} wajib diisi!`, 'error');
        return false;
      }
    }
    if (isNaN(parseInt(formData.umur)) || parseInt(formData.umur) < 1) {
      showNotif('Umur harus berupa angka yang valid!', 'error');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    try {
      if (isEditing && selectedId) {
        await mahasiswaService.update(selectedId, toBackend(formData));
        showNotif('Data berhasil diperbarui! ✅');
      } else {
        await mahasiswaService.create(toBackend(formData));
        showNotif('Mahasiswa berhasil ditambahkan! ✅');
      }
      setFormData(INITIAL_FORM);
      setSelectedId(null);
      setIsEditing(false);
      loadData(searchQuery);
    } catch (err) {
      showNotif('Gagal menyimpan: ' + err.message, 'error');
    }
  };

    const handleSelect = (item) => {
    setSelectedId(item.id);
    };

    // Klik tombol edit ✏️ → isi form + mode edit
const handleUpdate = (item) => {
    setSelectedId(item.id);
    setFormData(item);
    setIsEditing(true);
    };

    // Tombol batal
const handleCancel = () => {
    setFormData(INITIAL_FORM);
    setSelectedId(null);
    setIsEditing(false);
};

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin mau hapus data ini?')) return;
    try {
      await mahasiswaService.delete(id);
      showNotif('Data berhasil dihapus! 🗑️');
      if (selectedId === id) {
        setFormData(INITIAL_FORM);
        setSelectedId(null);
        setIsEditing(false);
      }
      loadData(searchQuery);
    } catch (err) {
      showNotif('Gagal menghapus: ' + err.message, 'error');
    }
  };

  const handleResetAll = async () => {
    if (!window.confirm('⚠️ Yakin mau hapus SEMUA data mahasiswa? Aksi ini tidak bisa dibatalkan!')) return;
    try {
      await mahasiswaService.resetAll();
      showNotif('Semua data berhasil dihapus! 🔄');
      setFormData(INITIAL_FORM);
      setSelectedId(null);
      setIsEditing(false);
      loadData();
    } catch (err) {
      showNotif('Gagal reset data: ' + err.message, 'error');
    }
  };

  const handleExport = (type) => {
    if (mahasiswaList.length === 0) {
      showNotif('Tidak ada data untuk diekspor!', 'error');
      return;
    }
    if (type === 'json') {
      const blob = new Blob([JSON.stringify(mahasiswaList, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mahasiswa.json';
      a.click();
      URL.revokeObjectURL(url);
      showNotif('Export JSON berhasil! 🗂️');
    } else if (type === 'csv') {
      const headers = ['ID', 'Nama', 'NIM', 'Umur', 'Tanggal Lahir', 'Jurusan', 'Fakultas', 'Jenjang', 'Alamat'];
      const rows = mahasiswaList.map((m) => [
        m.id, m.namaLengkap, m.nim, m.umur,
        m.tanggalLahir, m.jurusan, m.fakultas, m.jenjang, `"${m.alamat}"`
      ]);
      const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mahasiswa.csv';
      a.click();
      URL.revokeObjectURL(url);
      showNotif('Export CSV berhasil! 📋');
    } else {
      showNotif(`Export ${type.toUpperCase()} coming soon!`, 'error');
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📚 Sistem Manajemen Data Mahasiswa</h1>
      </header>

      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <main className="main-content">
        <section className="input-form-section">
          <MahasiswaForm
            formData={formData}
            onChange={handleChange}
            onSave={handleSave}
            isEditing={isEditing}
            onCancel={handleCancel}
          />
        </section>

        <section className="list-section">
          {loading ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
              <p>⏳ Memuat data...</p>
            </div>
          ) : (
            <MahasiswaList
              mahasiswaList={mahasiswaList}
              selectedId={selectedId}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSelect={handleSelect}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onResetAll={handleResetAll}
              onExport={handleExport}
            />
          )}
        </section>
      </main>

      <footer className="app-footer">
        <p>Technical Test - LAMDA Technology Solution © 2024</p>
      </footer>
    </div>
  );
}

export default App;