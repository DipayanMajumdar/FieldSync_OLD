'use client';
import { useState, useEffect, FormEvent } from 'react';
import { getWbs, sendEvd, apvUpdate } from '../services/api';

type WbsItem = {
  id: number;
  cd: string;
  nm: string;
};

export default function Dashboard() {
  const [wbs, setWbs] = useState<WbsItem[]>([]);
  const [selWbs, setSelWbs] = useState('');
  const [uri, setUri] = useState<File | string>(''); 
  const [res, setRes] = useState<any>(null);
  const [typ, setTyp] = useState('img');

  useEffect(() => {
    getWbs(1).then(setWbs).catch(console.error);
  }, []);

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    setRes('Processing AI...');
    try {
      const fd = new FormData();
      fd.append('id', '1');
      fd.append('w', selWbs);
      fd.append('t', typ); // Fixed: Removed quotes around typ
      if (typeof uri !== 'string') fd.append('file', uri); 
      
      const out = await sendEvd(fd); 
      setRes(out);
    } catch (err) {
      setRes({ error: 'Error connecting to backend' });
    }
  };

  const handleApprove = async () => {
    if (!res || !res.db) return;
    try {
      // Assuming AI returns a progress percentage, hardcoding 100 for now
      await apvUpdate({ aid: res.db.id, wid: parseInt(selWbs), pp: 100 });
      setRes({ ...res, status: 'Officially Approved by Manager' });
    } catch (err) {
      alert('Approval failed');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#ffffff', color: '#000000', minHeight: '100vh' }}>
      <h1>Execution Bridge Dashboard</h1>
      
      <section style={{ marginBottom: '20px' }}>
        <h2>1. Active WBS Tasks</h2>
        <ul>
          {wbs.map((w) => (
            <li key={w.id}>[{w.cd}] - {w.nm}</li>
          ))}
        </ul>
      </section>

      <section style={{ marginBottom: '20px' }}>
        <h2>2. Capture Site Evidence</h2>
        <form onSubmit={handleUpload}>
          <label>Select WBS: </label>
          <select value={selWbs} onChange={(e) => setSelWbs(e.target.value)} required style={{ color: '#000', padding: '5px' }}>
            <option value="">-- Choose Task --</option>
            {wbs.map((w) => (
              <option key={w.id} value={w.id.toString()}>{w.nm}</option>
            ))}
          </select>
          <br /><br />
          
          {/* NEW: Evidence Type Dropdown */}
          <label>Evidence Type: </label>
          <select value={typ} onChange={(e) => setTyp(e.target.value)} style={{ color: '#000', padding: '5px', marginBottom: '10px' }}>
            <option value="img">Site Photo</option>
            <option value="aud">Voice Report</option>
          </select>
          <br /><br />

          <label>Upload File: </label>
          <input 
            type="file" 
            accept={typ === 'img' ? "image/*" : "audio/*"} // Dynamically accept images or audio
            onChange={(e) => setUri(e.target.files ? e.target.files[0] : '')} 
            style={{ color: '#000', marginBottom: '10px' }}
            required
          />
          <br /><br />
          <button type="submit" style={{ padding: '8px 16px', background: '#0056b3', color: '#ffffff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Run AI Observation
          </button>
        </form>
      </section>

      <section>
        <h2>3. System Output & HITL Approval</h2>
        <pre style={{ background: '#f4f4f4', color: '#333', padding: '15px', borderRadius: '5px', overflowX: 'auto', border: '1px solid #ddd' }}>
          {typeof res === 'string' ? res : JSON.stringify(res, null, 2)}
        </pre>
        
        {/* NEW: Human-in-the-Loop Approval Button */}
        {res && res.ai && !res.status && (
          <button onClick={handleApprove} style={{ marginTop: '10px', padding: '8px 16px', background: '#28a745', color: '#ffffff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Approve AI Suggestion
          </button>
        )}
      </section>
    </div>
  );
}