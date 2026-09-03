import ax from 'axios';

const api = ax.create({
  baseURL: 'http://localhost:3000/api', // Pointing to your Express server
});

export const getWbs = async (pid: number) => {
  const r = await api.get(`/prj/${pid}/wbs`);
  return r.data;
};

export const sendEvd = async (data: any) => {
  const r = await api.post('/evd', data);
  return r.data;
};

export const apvUpdate = async (data: { aid: number, wid: number, pp: number }) => {
  const r = await api.post('/approve', data);
  return r.data;
};