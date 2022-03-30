import axios from 'axios' 
axios.default.withCredentials = true;
const api = axios.create({
    baseURL: 'http://localhost:4000/api'
})

// Server Connections

export const connect = (payload) => api.post('/connect/${id}', payload)
export const operation = (payload) => api.post('/op/${id}', payload)
export const getdoc = () => api.get('/doc/${id}')
export const getAllDocs = () => api.get('/alldoc')


const apis = {
    connect,
    operation,
    getdoc,
    getAllDocs
}

export default apis