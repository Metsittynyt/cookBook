import axios from 'axios'
const baseUrl = '/api/recipes'

const getAll = (token = null, onlyUserRecipes = false) => {
  const config = {};

  if (token && onlyUserRecipes) {
    config.headers = {
      Authorization: `Bearer ${token}`
    };
    config.params = {
      myRecipes: true
    };
  }

  const request = axios.get(baseUrl, config);
  return request.then(response => response.data);
}

const create = async (newObject, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
}

const getRidOff = (id) => {
  const request = axios.delete(`${ baseUrl }/${id}`)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${ baseUrl }/${id}`, newObject)
  return request.then(response => response.data)
}

export default { getAll, create, getRidOff, update}