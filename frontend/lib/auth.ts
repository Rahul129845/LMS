import apiClient from './apiClient';

export async function loginApi(email: string, password: string) {
  const { data } = await apiClient.post('/api/auth/login', { email, password });
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', data.accessToken);
  }
  return data;
}

export async function registerApi(name: string, email: string, password: string) {
  const { data } = await apiClient.post('/api/auth/register', { name, email, password });
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', data.accessToken);
  }
  return data;
}

export async function logoutApi() {
  await apiClient.post('/api/auth/logout');
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
  }
}
