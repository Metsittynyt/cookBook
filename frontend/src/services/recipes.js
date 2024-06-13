import axios from 'axios';

axios.defaults.withCredentials = true;

const baseUrl = '/api/recipes';


const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const getSome = (onlyUser = false, excludeUser = false, savedRecipes = false) => {
  const config = {};
  if (onlyUser) {
    config.params = { myRecipes: true };
  } else if (excludeUser) {
    config.params = { excludeMyRecipes: true };
  } else if (savedRecipes) {
    config.params = { mySavedRecipes: true };
  }
  const request = axios.get(`${baseUrl}/part`, config);
  return request.then(response => response.data);
};

const getById = (id) => {
  const request = axios.get(`${baseUrl}/${id}`);
  return request.then(response => response.data);
};

const create = async (newObject) => {
  const response = await axios.post(baseUrl, newObject);
  return response.data;
};

const getRidOff = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then(response => response.data);
};

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject);
  return request.then(response => response.data);
};

const toggleStatus = (id, action) => {
  const url = `${baseUrl}/${id}/toggleStatus?action=${action}`;
  return axios.get(url).then(response => response.data);
}


export default { getAll, getSome, getById, create, getRidOff, update, toggleStatus };
