import { apiGet, apiPost, apiPut, apiDelete } from 'src/services/api';

export const useUsers = () => {
  const getUsers = () => apiGet('/users');
  const getUserById = (id: number) => apiGet(`/users/${id}`);
  const createUser = (data: any) => apiPost('/users', data);
  const updateUser = (id: number, data: any) => apiPut(`/users/${id}`, data);
  const deleteUser = (id: number) => apiDelete(`/users/${id}`);

  return {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
  };
};

export const useEntries = () => {
  const getEntries = async  () => await  apiGet('/entries');
  const createEntry = async  (data: any) => await  apiPost('/entries', data);
  const updateEntry = async  (id: number, data: any) => await  apiPut(`/entries/${id}`, data);
  const deleteEntry = async  (id: number) => await  apiDelete(`/entries/${id}`);

  return {
    getEntries,
    createEntry,
    updateEntry,
    deleteEntry,
  };
};
