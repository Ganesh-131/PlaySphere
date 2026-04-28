import axiosClient from './axiosClient';

export const authAPI = {
  signup: (email, password, username) =>
    axiosClient.post('/api/auth/signup', { email, password, username }),
  
  login: (email, password) =>
    axiosClient.post('/api/auth/login', { email, password }),
};
