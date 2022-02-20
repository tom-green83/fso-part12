import axios from 'axios'
const baseUrl = process.env.REACT_APP_BACKEND_URL || '/api'
const loginUrl = baseUrl + '/login'

const login = async credentials => {
  const response = await axios.post(loginUrl, credentials)
  return response.data
}

export default { login }