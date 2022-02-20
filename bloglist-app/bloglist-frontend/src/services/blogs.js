import axios from 'axios'
const baseUrl = process.env.REACT_APP_BACKEND_URL || '/api'
const blogsUrl = baseUrl + '/blogs'

let token = null
const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = async () => {
  const request = await axios.get(blogsUrl)
  return request.data
}

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(blogsUrl, newObject, config)
  return response.data
}

const update = async ( blogId, newObject) => {
  const updateUrl = blogsUrl + '/' + blogId
  const response = await axios.put(updateUrl, newObject)
  return response.data
}

const remove = async (blogId) => {
  const config = {
    headers: { Authorization: token }
  }
  const removeUrl = blogsUrl + '/' + blogId
  const response = await axios.delete(removeUrl, config)
  return response
}

export default { setToken, getAll, create , update, remove }