import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null
const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = async () => {
  const request = await axios.get(baseUrl)
  return request.data
}

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async ( blogId, newObject) => {
  const updateUrl = baseUrl + '/' + blogId
  const response = await axios.put(updateUrl, newObject)
  return response.data
}

const remove = async (blogId) => {
  const config = {
    headers: { Authorization: token }
  }
  const removeUrl = baseUrl + '/' + blogId
  const response = await axios.delete(removeUrl, config)
  return response
}

export default { setToken, getAll, create , update, remove }