import React, { useState, useEffect } from 'react';
import MahasiswaForm from '../components/MahasiswaForm';
import MahasiswaList from '../components/MahasiswaList';
import mahasiswaService from '../services/mahasiswaService';

const HomePage = () => {
  // State untuk form
  const [formData, setFormData] = useState({
    namaLengkap: '',
    nim: '',
    umur: '',
    tanggalLahir: '',
    jurusan: '',
    fakultas: '',
    jenjang: 'S1',
    alamat: '',
  });

  // State untuk list mahasiswa
  const [mahasiswaList, setMahasiswaList] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch data saat mount
  useEffect(() => {
    fetchMahasiswa();
  }, []);

  const fetchMahasiswa = async () => {
    try {
      const data = await mahasiswaService.getAll();
      setMahasiswaList(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Data dummy untuk preview UI
      setMahasiswaList([
        {
          id: 1,
          namaLengkap: 'Budi Santoso',
          nim: '12345678',
          umur: 20,
          tanggalLahir: '2004-01-15',
          jurusan: 'Teknik Informatika',
          fakultas: 'Teknik',
          jenjang: 'S1',
          alamat: 'Jl. Mawar No. 1',
        },
        {
          id: 2,
          namaLengkap: 'Siti Aminah',
          nim: '87654321',
          umur: 21,
          tanggalLahir: '2003-05-20',
          jurusan: 'Sistem Informasi',
          fakultas: 'FT',
          jenjang: 'S1',
          alamat: 'Jl. Melati No. 5',
        },
        {
          id: 3,
          namaLengkap: 'Andi Wijaya',
          nim: '11223344',
          umur: 22,
          tanggalLahir: '2002-08-10',
          jurusan: 'Manajemen',
          fakultas: 'Ekonomi',
          jenjang: 'S1',
          alamat: 'Jl. Kenanga No. 10',
        },
        {
          id: 4,
          namaLengkap: 'Rina Susanti',
          nim: '55667788',
          umur: 20,
          tanggalLahir: '2004-03-25',
          jurusan: 'Akuntansi',
          fakultas: 'Ekonomi',
          jenjang: 'D3',
          alamat: 'Jl. Anggrek No. 3',
        },
      ]);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle save (create/update)
  const handleSave = async () => {
    if (!formData.namaLengkap || !formData.nim) {
      alert('Nama Lengkap dan NIM wajib diisi!');
      return;
    }

    try {
      if (selectedId) {
        // Update mode
        await mahasiswaService.update(selectedId, formData);
      } else {
        // Create mode
        await mahasiswaService.create(formData);
      }

      // Refresh list dan reset form
      fetchMahasiswa();
      handleResetForm();
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Gagal menyimpan data!');
    }
  };

  // Handle select mahasiswa dari list (untuk edit)
  const handleSelect = (item) => {
    setSelectedId(item.id);
    setFormData({
      namaLengkap: item.namaLengkap,
      nim: item.nim,
      umur: item.umur,
      tanggalLahir: item.tanggalLahir,
      jurusan: item.jurusan,
      fakultas: item.fakultas,
      jenjang: item.jenjang,
      alamat: item.alamat,
    });
  };

  // Handle update dari card mahasiswa
  const handleUpdate = (item) => {
    handleSelect(item);
    // Auto scroll ke form
    document.querySelector('.input-form-section').scrollIntoView({ behavior: 'smooth' });
  };

  // Handle delete dari card mahasiswa
  const handleDelete = async (id) => {
    if (!window.confirm('Yakin mau hapus data ini?')) return;

    try {
      await mahasiswaService.delete(id);
      fetchMahasiswa();
      if (selectedId === id) handleResetForm();
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Gagal menghapus data!');
    }
  };

  // Handle reset form (clear input)
  const handleResetForm = () => {
    setFormData({
      namaLengkap: '',
      nim: '',
      umur: '',
      tanggalLahir: '',
      jurusan: '',
      fakultas: '',
      jenjang: 'S1',
      alamat: '',
    });
    setSelectedId(null);
  };

  // Handle reset ALL data (di bagian List Data Mahasiswa)
  const handleResetAll = async () => {
    if (!window.confirm('Yakin mau reset SEMUA data? Data akan kembali ke 0!')) return;

    try {
      await mahasiswaService.resetAll();
      setMahasiswaList([]);
      handleResetForm();
      alert('Semua data berhasil direset!');
    } catch (error) {
      console.error('Error resetting:', error);
      alert('Gagal reset data!');
    }
  };

  // Filter mahasiswa berdasarkan search
  const filteredList = mahasiswaList.filter(
    (item) =>
      item.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nim.includes(searchQuery)
  );

  // Export data
  const handleExport = (format) => {
    const data = filteredList;
    switch (format) {
      case 'excel':
        // [isi controller atau penghubung backend disini]
        console.log('Export Excel:', data);
        break;
      case 'pdf':
        // [isi controller atau penghubung backend disini]
        console.log('Export PDF:', data);
        break;
      case 'csv':
        // [isi controller atau penghubung backend disini]
        console.log('Export CSV:', data);
        break;
      case 'json':
        // [isi controller atau penghubung backend disini]
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'mahasiswa.json';
        a.click();
        break;
      default:
        break;
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <h1>Form Data Mahasiswa</h1>
      </header>

      <div className="main-content">
        {/* LEFT SIDE - Input Form */}
        <div className="input-form-section">
          <MahasiswaForm
            formData={formData}
            onChange={handleChange}
            onSave={handleSave}
            isEditing={!!selectedId}
          />
        </div>

        {/* RIGHT SIDE - List Data Mahasiswa */}
        <div className="list-section">
          <MahasiswaList
            mahasiswaList={filteredList}
            selectedId={selectedId}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelect={handleSelect}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onResetAll={handleResetAll}
            onExport={handleExport}
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="app-footer">
        <p>© 2024 Student Management System</p>
      </footer>
    </div>
  );
};

export default HomePage;