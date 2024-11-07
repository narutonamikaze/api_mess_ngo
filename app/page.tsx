"use client";
import { useState } from 'react';
import Modal from 'react-modal';

interface Center {
  name: string;
  address: string;
  contact: string;
  description: string;
  image: string;
}

export default function Home() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState<Center | null>(null);

  const ngoCenters: Center[] = [
    {
      name: "Inderprastha IP Center",
      address: "Near Inderprastha Metro Station, Metro Pillar 343",
      contact: "0123456789",
      description: "This center focuses on education and youth empowerment.",
      image: "https://cdn.britannica.com/43/93843-050-A1F1B668/White-House-Washington-DC.jpg",
    },
    {
      name: "Rohini 07 Center",
      address: "Near Ayodhya Chowk Red-light, Naharpur Village",
      contact: "0987654321",
      description: "This center provides healthcare services and free medical camps.",
      image: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Glimpse_of_the_new_Parliament_Building%2C_in_New_Delhi.jpg",
    },
    {
      name: "Dwarka 21 Center",
      address: "Near Dwarka Sector 21 Metro Station, Metro Pillar",
      contact: "01122334455",
      description: "This center offers vocational training and skill development.",
      image: "https://curioustravelbug.com/wp-content/uploads/2019/01/IMG_0690-1-1024x683.jpg",
    },
  ];

  const openModal = (center: Center) => {
    setSelectedCenter(center);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedCenter(null);
  };

  return (
    <main className="flex flex-col items-center justify-center py-8 px-4">
      <h1 className="text-5xl font-bold text-gray-800 mb-8 text-center">
        Welcome to NGO Management Systems
      </h1>
      <p className="text-lg text-gray-600 mb-12 text-center">
        We collaborate with various NGOs across multiple locations. Below are some of the centers we work with.
      </p>

      {/* NGO Centers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {ngoCenters.map((center, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <img src={center.image} alt={center.name} className="w-full h-48 object-cover rounded-md mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">{center.name}</h2>
            <p className="text-gray-600 mb-2">
              <strong>Address:</strong> {center.address}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Contact:</strong> {center.contact}
            </p>
            <p className="text-gray-600">
              <strong>Description:</strong> {center.description}
            </p>
            <button
              onClick={() => openModal(center)}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
            >
              More Info
            </button>
          </div>
        ))}
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="NGO Center Details"
        className="bg-white p-6 rounded-lg shadow-md border border-gray-200 max-w-lg mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        {selectedCenter && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{selectedCenter.name}</h2>
            <p className="text-gray-600 mb-2">
              <strong>Address:</strong> {selectedCenter.address}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Contact:</strong> {selectedCenter.contact}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Description:</strong> {selectedCenter.description}
            </p>
            <button
              onClick={closeModal}
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        )}
      </Modal>
    </main>
  );
}

