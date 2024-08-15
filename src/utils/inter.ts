import { typeCompony } from '@/utils/constant';
import http from '@/utils/http';

export const addCompany = async (data: typeCompony[]) => {
  const res = await http.post('/company/assets', data);
  return res.data;
};
export const changeCompany = async (data: typeCompony[], name: string) => {
  const res = await http.post('/company/change', {
    diff: data,
    name
  });
  console.log('Log-- ', res, 'res');
  return res.data;
};

export const deleteCompany = async (name: string) => {
  const res = await http.post('/company/delete', {
    name
  });
  return res.data;
};
