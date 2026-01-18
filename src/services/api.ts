const API_URL = 'http://localhost:3002';
// Token'ı localStorage'den al
const getToken = () => localStorage.getItem('accessToken');


export const apiGet = async (endpoint:string) => {
  const token =  getToken();
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}`   }) },
    credentials: 'include',
  });
  return response.json();
};

export const apiPost = async (endpoint:string, data:object) => {
  const token =  getToken();
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}`   }) },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return response.json();
};

export const apiPut = async (endpoint: string, data: object) => {
  const token =  getToken();
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}`   })
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return response.json();
};


export const apiDelete = async (endpoint:string) => {
  const token =  getToken();
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}`   })
    },
    credentials: 'include',
  });
  return response.json();
};
