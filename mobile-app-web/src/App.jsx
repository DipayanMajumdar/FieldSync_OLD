import { useState } from 'react';
import axios from 'axios';

export default function App() {
  const [wbs, setWbs] = useState('4');
  const [progress, setProgress] = useState('100');
  const [file, setFile] = useState(null);
  const [queueCount, setQueueCount] = useState(0);
  const [queue, setQueue] = useState([]);

  // 1. Standard HTML5 File/Camera Input
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // 2. Mock Offline Storage (In-Memory Array)
  const saveOfflineMock = () => {
    if (!file) return alert('Select an image or capture a photo first.');
    
    // Determine type based on standard MIME types
    const isAudio = file.type.startsWith('audio');
    const newItem = { wbs_id: wbs, progress, file, type: isAudio ? 'aud' : 'img' };
    
    setQueue([...queue, newItem]);
    setQueueCount(queueCount + 1);
    setFile(null); // Reset input
    
    // Reset file input UI
    document.getElementById('media-upload').value = '';
    alert('Saved to web queue!');
  };

  // 3. Network Sync to Localhost
  const syncData = async () => {
    for (let item of queue) {
      const fd = new FormData();
      fd.append('id', '1'); // Master Project ID
      fd.append('w', item.wbs_id);
      fd.append('t', item.type);
      
      // Standard web File object appending
      fd.append('file', item.file);

      try {
        // Because it is a web app on your PC, localhost works perfectly
        await axios.post('http://localhost:3000/api/evd', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } catch (error) {
        console.error('Sync failed:', error);
        alert('Failed to connect to Express backend. Is it running?');
        return;
      }
    }
    
    alert('Sync Complete! Check your backend uploads folder.');
    setQueue([]);
    setQueueCount(0);
  };

  return (
    <div style={{ maxWidth: '450px', margin: '40px auto', padding: '30px', fontFamily: 'system-ui, sans-serif', border: '1px solid #ccc', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>FieldSync Web Mockup</h2>

      <label style={{ fontWeight: 'bold' }}>WBS ID (e.g., 4 for Concrete):</label>
      <input 
        value={wbs} 
        onChange={(e) => setWbs(e.target.value)} 
        style={{ display: 'block', width: '95%', marginBottom: '20px', padding: '10px', marginTop: '5px' }} 
      />

      <label style={{ fontWeight: 'bold' }}>Progress %:</label>
      <input 
        value={progress} 
        onChange={(e) => setProgress(e.target.value)} 
        type="number" 
        style={{ display: 'block', width: '95%', marginBottom: '20px', padding: '10px', marginTop: '5px' }} 
      />

      <label style={{ fontWeight: 'bold' }}>Capture / Upload Media:</label>
      <input 
        id="media-upload"
        type="file" 
        accept="image/*, audio/*" 
        onChange={handleFileChange} 
        style={{ display: 'block', marginBottom: '20px', marginTop: '5px' }} 
      />

      <button onClick={saveOfflineMock} style={{ width: '100%', padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer', marginBottom: '30px' }}>
        Queue Entry
      </button>

      <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
        <p style={{ fontSize: '18px', margin: '0 0 15px 0', fontWeight: 'bold' }}>Sync Queue: {queueCount} items</p>
        <button 
          onClick={syncData} 
          disabled={queueCount === 0} 
          style={{ width: '100%', padding: '12px', backgroundColor: queueCount === 0 ? '#6c757d' : '#6f42c1', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: queueCount === 0 ? 'not-allowed' : 'pointer' }}>
          Push to Server
        </button>
      </div>
    </div>
  );
}