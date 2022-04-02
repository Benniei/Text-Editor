import axios from 'axios' 
axios.default.withCredentials = true;
const api = axios.create({
    baseURL: 'http://localhost:4000/api'
})

// Server Connections

export const connect = (id) => api.get('/connect/'+id)
.then(response => {
    return response
 })
 .catch(error => {
    return error.response;
 });
export const operation = (id, payload) => api.post('/op/'+id, payload)
.then(response => {
    return response
 })
 .catch(error => {
    return error.response;
 });
export const getdoc = (id) => api.get('/doc/'+id)
export const getAllDocs = () => api.get('/alldoc')


const apis = {
    connect,
    operation,
    getdoc,
    getAllDocs
}

export default apis