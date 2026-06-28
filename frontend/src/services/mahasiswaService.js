const API_BASE_URL = 'http://localhost:8080/api';

const mahasiswaService = {
  getAll: async (search = '') => {
    const url = search
      ? `${API_BASE_URL}/mahasiswa?search=${encodeURIComponent(search)}`
      : `${API_BASE_URL}/mahasiswa`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Gagal mengambil data');
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/mahasiswa/${id}`);
    if (!response.ok) throw new Error('Gagal mengambil data');
    return response.json();
  },

  create: async (data) => {
    const response = await fetch(`${API_BASE_URL}/mahasiswa`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Gagal menyimpan data');
    return response.json();
  },

  update: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/mahasiswa/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Gagal update data');
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/mahasiswa/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Gagal menghapus data');
    return response.json();
  },

  // DELETE semua data mahasiswa
  resetAll: async () => {
    const response = await fetch(`${API_BASE_URL}/mahasiswa/reset`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Gagal reset data');
    return response.json();
  },
};

export default mahasiswaService;