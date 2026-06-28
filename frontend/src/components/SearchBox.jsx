import React from 'react';

const SearchBox = ({ value, onChange }) => {
  return (
    <div className="search-box">
      <span>🔍</span>
      <input
        type="text"
        placeholder="Cari nama atau NIM..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBox;