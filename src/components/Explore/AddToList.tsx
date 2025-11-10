'use client';

import React, { useState, useEffect } from 'react';
// Hapus 'import { Destination }' jika ada, kita tidak perlu lagi

interface AddToListProps {
  // Hanya terima 'placeName' sebagai string
  placeName: string;
}

const AddToList: React.FC<AddToListProps> = ({ placeName }) => {
  const [added, setAdded] = useState(false);

  // useEffect sekarang bergantung pada placeName
  useEffect(() => {
    const list = JSON.parse(localStorage.getItem('myList') || '[]');
    setAdded(list.includes(placeName));
  }, [placeName]);

  const handleAddToList = () => {
    const list = JSON.parse(localStorage.getItem('myList') || '[]');

    if (added) {
      const newList = list.filter((item: string) => item !== placeName);
      localStorage.setItem('myList', JSON.stringify(newList));
      setAdded(false);
    } else {
      list.push(placeName);
      localStorage.setItem('myList', JSON.stringify(list));
      setAdded(true);
    }
    // Kirim event agar ExploreClient bisa update daftar favorites
    window.dispatchEvent(new Event('myListUpdated'));
  };

  return (
    <button
      onClick={handleAddToList}
      className={`mt-4 px-6 py-2 rounded-lg font-semibold transition-all duration-300 ease-in-out transform ${
        added ? 'bg-blue-300 text-black scale-105' : 'bg-gray-700 text-white scale-100'
      }`}
    >
      {added ? (
        <>
          <span role="img" aria-label="heart">❤️</span> Added to List
        </>
      ) : (
        'Add to List'
      )}
    </button>
  );
};

export default AddToList;