import axios from 'axios';

axios.defaults.withCredentials = true;

const baseUrl = '/api/users';

const signUp = async credentials => {
  const response = await axios.post(baseUrl, credentials);
  return response.data;
};

const getUsername = async () => {
  const response = await axios.get(`${baseUrl}/name`)
  return response.data
}

const getById = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`)
  return response.data
}

const checkUsername = async (username) => {
    const response = await axios.get(`${baseUrl}/check-username/${username}`)
    return response.data.isUnique
}

export default { signUp, getUsername, getById, checkUsername };
