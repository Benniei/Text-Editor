import axios from 'axios' 

axios.defaults.withCredentials = true;
let ip = 'localhost'
const api = axios.create({
    baseURL: 'http://' + ip + ':4000'
})

/* Text Editing */
export const connect = (docid, uid) => api.get('/doc/connect/'+ docid + '/' + uid)
.then(response => {
    return response
 })
 .catch(error => {
    return error.response;
 });
export const operation = (docid, uid, payload) => api.post('/doc/op/'+ docid + '/' + uid, payload)
.then(response => {
    return response
 })
 .catch(error => {
    return error.response;
 });
export const getdoc = (id) => api.get('/doc/get/'+id)
export const getAllDocs = () => api.get('/alldoc')

/* Collection */
export const createCollection = (payload) => api.post(`/collection/create`, payload)
.then(response => {
   return response
})
.catch(error => {
   return error.response;
});

export const deleteCollection = (payload) => api.post(`/collection/delete`, payload)
.then(response => {
   return response
})
.catch(error => {
   return error.response;
});

export const listCollection = () => api.get(`/collection/list`)

/* Authentication */
export const signup = (payload ) => api.post(`/users/signup`, payload)
.then(response => {
    return response
 })
 .catch(error => {
    return error.response;
 });
export const loginUser = (payload) => api.post(`/users/login`, payload)
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

export const getLoggedIn = () => api.get(`/user/loggedIn`)
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
   createCollection,
   deleteCollection,
   listCollection,
   signup,
   loginUser,
   logoutUser,
   getLoggedIn
}

export default apis