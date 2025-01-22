import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { name, phone_number, address } = response.data;
      setName(name);
      setPhoneNumber(phone_number);
      setAddress(address);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      <form>
        <div>
          <label>Name:</label>
          <input type="text" value={name} readOnly />
        </div>
        <div>
          <label>Phone Number:</label>
          <input type="text" value={phoneNumber} readOnly />
        </div>
        <div>
          <label>Address:</label>
          <input type="text" value={address} readOnly />
        </div>
        <div>
          <input type="file" onChange={handleFileChange} />
          <button type="button" onClick={handleUpload}>Upload PDF</button>
        </div>
      </form>
    </div>
  );
}

export default App;
