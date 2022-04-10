import axios from 'axios' 

axios.default.withCredentials = true;
let ip = 'localhost'
const api = axios.create({
    baseURL: 'http://' + ip + ':4000/'
})

/* Text Editing */
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

/* Authentication */
export const addUser = (payload ) => api.post(`/adduser`, payload)
.then(response => {
    return response
 })
 .catch(error => {
    return error.response;
 });
export const loginUser = (payload) => api.post(`/login`, payload)
.then(response => {
    return response
 })
 .catch(error => {
    return error.response
 });
export const logoutUser = (payload) => api.post(`/logout`, payload)
.then(response => {
    return response
 })
 .catch(error => {
    return error.response
 });



const apis = {
    connect,
    operation,
    getdoc,
    getAllDocs,
    addUser,
    loginUser,
    logoutUser
}

export default apis