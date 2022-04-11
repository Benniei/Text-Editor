import axios from 'axios' 

axios.default.withCredentials = true;
let ip = 'localhost'
const api = axios.create({
    baseURL: 'http://' + ip + ':4000/'
})

/* Text Editing */
export const connect = (id) => api.get('/doc/connect/'+id)
.then(response => {
    return response
 })
 .catch(error => {
    return error.response;
 });
export const operation = (id, payload) => api.post('/doc/op/'+id, payload)
.then(response => {
    return response
 })
 .catch(error => {
    return error.response;
 });
export const getdoc = (id) => api.get('/doc/get/'+id)
export const getAllDocs = () => api.get('/alldoc')

/* Authentication */
export const signup = (payload ) => api.post(`/users/signup`, payload, {withCredentials: true})
.then(response => {
    return response
 })
 .catch(error => {
    return error.response;
 });
export const loginUser = (payload) => api.post(`/users/login`, payload, {withCredentials: true})
.then(response => {
    return response
 })
 .catch(error => {
    return error.response
 });
export const logoutUser = (payload) => api.post(`/users/logout`, payload)
.then(response => {
    return response
 })
 .catch(error => {
    return error.response
 });

export const userLoggedIn = () => api.get(`/user/loggedIn`)
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
    signup,
    loginUser,
    logoutUser,
    userLoggedIn
}

export default apis