import axios from 'axios';

axios.defaults.withCredentials = true;

const baseUrl = '/api/login';
const usersUrl = '/api/users';

const login = async credentials => {
  const response = await axios.post(baseUrl, credentials);
  return response.data;
};

const signUp = async credentials => {
  const response = await axios.post(usersUrl, credentials);
  return response.data;
};

const logout = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const getUsername = async () => {
  const response = await axios.get(`${usersUrl}/name`)
  return response.data
}


export default { login, signUp, logout, getUsername };
