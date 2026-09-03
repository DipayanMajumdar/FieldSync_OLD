import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSQLiteContext } from 'expo-sqlite';
import axios from 'axios';

// REPLACE WITH YOUR ACTUAL IPV4 ADDRESS
const IP_ADDRESS = '172.23.115.181'; 
const API_URL = `http://${IP_ADDRESS}:3000/api`;

interface QueueItem {
  id: number;
  wbs_id: string;
  progress: string;
  uri: string;
  type: string;
}

export default function IndexScreen() {
  const db = useSQLiteContext();
  const [wbs, setWbs] = useState('4');
  const [progress, setProgress] = useState('100');
  const [mediaUri, setMediaUri] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState('img');
  const [queueCount, setQueueCount] = useState(0);

  useEffect(() => {
    updateQueueCount();
  }, []);

  const updateQueueCount = async () => {
    try {
      const result = await db.getFirstAsync<{ cnt: number }>('SELECT COUNT(*) as cnt FROM sync_queue');
      if (result) setQueueCount(result.cnt);
    } catch (e) { console.error(e); }
  };

  const capturePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({ quality: 0.5 });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setMediaUri(result.assets[0].uri);
      setMediaType('img');
    }
  };

  const saveOffline = async () => {
    if (!mediaUri) return Alert.alert('Error', 'Capture a photo first.');
    try {
      await db.runAsync(
        'INSERT INTO sync_queue (wbs_id, progress, uri, type) VALUES (?, ?, ?, ?)',
        wbs, progress, mediaUri, mediaType
      );
      Alert.alert('Saved', 'Entry queued offline.');
      setMediaUri(null);
      updateQueueCount();
    } catch (e) { console.error(e); }
  };

  const syncData = async () => {
    try {
      const rows = await db.getAllAsync<QueueItem>('SELECT * FROM sync_queue');
      
      for (let item of rows) {
        const fd = new FormData();
        fd.append('id', '1'); 
        fd.append('w', item.wbs_id);
        fd.append('t', item.type);
        
        // @ts-ignore
        fd.append('file', {
          uri: item.uri,
          name: `upload.jpg`,
          type: 'image/jpeg',
        });

        await axios.post(`${API_URL}/evd`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        await db.runAsync('DELETE FROM sync_queue WHERE id = ?', item.id);
      }
      Alert.alert('Sync Complete', 'Queue pushed to server.');
      updateQueueCount();
    } catch (error: any) {
      Alert.alert('Sync Failed', 'Cannot reach backend server. Check your IP address!');
      console.error(error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 40, marginTop: 40 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>FieldSync Capture</Text>

      <Text>WBS ID (e.g., 4 for Concrete):</Text>
      <TextInput value={wbs} onChangeText={setWbs} style={{ borderWidth: 1, padding: 10, marginBottom: 20 }} />

      <Text>Progress %:</Text>
      <TextInput value={progress} onChangeText={setProgress} keyboardType="numeric" style={{ borderWidth: 1, padding: 10, marginBottom: 20 }} />

      <View style={{ marginBottom: 20 }}>
        <Button title="Take Photo" onPress={capturePhoto} />
      </View>

      {mediaUri && <Text style={{ color: 'green', marginBottom: 20 }}>Photo captured successfully!</Text>}

      <Button title="Save Entry Offline" onPress={saveOffline} color="green" />

      <View style={{ marginTop: 40, padding: 20, backgroundColor: '#eee' }}>
        <Text style={{ fontSize: 18, marginBottom: 10 }}>Sync Queue: {queueCount} items</Text>
        <Button title="Push to Server" onPress={syncData} color="purple" disabled={queueCount === 0} />
      </View>
    </ScrollView>
  );
}