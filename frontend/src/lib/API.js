import axios from 'axios';

import { useAuth } from '../Hooks/useAuth';

const { setToken, setUser, token } = useAuth.getState();

const instance = axios.create({
  baseURL: __CTSCAM_API_URL__,
  headers: {
    Authorization: 'Bearer ' + token,
  },
});

const login = async (username, password) => {
  const response = await instance.post('/login', { username, password });

  instance.defaults.headers.Authorization = 'Bearer ' + response.data.token;

  setToken(response.data.token);
  setUser(response.data.user);

  return response;
};

const logout = async () => {
  const response = await instance.post('/logout');

  setToken(null);
  setUser(null);

  return response;
};

const signal = async (latitude, longitude) => {
  const response = await instance.post('/signal', { latitude, longitude });

  return response.data;
};

const getSignals = async () => {
  const response = await instance.get('/signals');

  return response.data;
};

export { login, logout, signal, getSignals };
