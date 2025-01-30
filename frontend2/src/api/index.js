import axios from 'axios'

const options = {
  baseURL: `http://localhost:8000`,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
}

const instance = axios.create(options)

export default instance
