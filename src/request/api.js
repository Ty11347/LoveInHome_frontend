// 从http.js中引入post
import {get, del, put, post} from './http'

// const localhost = "http://localhost:8080";
// const herokuhost = "https://loveinhome.herokuapp.com";

// login and register
const fmAPI = {
  // login and register
  fmLogin: (username, password) => {
    return post('/api/fm/login?' + "username=" + username + "&password=" + password, undefined)
  },
  fmRegister: (param) => {
    return post('/api/fm/register', param)
  },
}

// parameter
const paraAPI = {
  getAllPara: (param) => {
    return get('/api/parameter', param)
  },
  getAllParaName: () => {
    return get('/api/parameter/names', undefined)
  },
  getAllParaById: (id) => {
    return get('/api/parameter/' + id, undefined)
  },
  addPara: (param) => {
    return post('/api/parameter/', param)
  },
  updatePara: (id, param) => {
    return put('/api/parameter/' + id, param)
  },
  deletePara: (id, param) => {
    return del('/api/parameter/' + id, param)
  },
}

// device
const deviceAPI = {
  getAllDevice: (param) => {
    return get('/api/device', param)
  },
  getAvaDevice: () => {
    return get('/api/device/uninstalled', undefined)
  },
  getAllDeviceById: (id) => {
    return get('/api/device/' + id, undefined)
  },
  addDevice: (param) => {
    return post('/api/device', param)
  },
  updateDevice: (id, param) => {
    return put('/api/device/' + id, param)
  },
  deleteDevice: (id) => {
    return del('/api/device/' + id, undefined)
  },
}

// user
const userAPI = {
  getAllUser: () => {
    return get('/api/user', undefined)
  },
  getAvaUser: () => {
    return get('/api/user/unactive', undefined)
  },
  getUserByID: (id) => {
    return get('/api/user/' + id, undefined)
  },
  addUser: (param) => {
    return post('/api/user', param)
  },
  updateUser: (id, param) => {
    return put('/api/user/' + id, param)
  },
  deleteUser: (id) => {
    return del('/api/user/' + id, undefined)
  },
}

// house
const houseAPI = {
  getAllHouse: () => {
    return get('/api/house', undefined)
  },
  getHouseByID: (id) => {
    return get('/api/house/' + id, undefined)
  },
  addHouse: (param) => {
    return post('/api/house', param)
  },
  changeHouseAdmin: (id, userId) => {
    return put('/api/house' + id + "/admin" + userId, undefined)
  },
  updateHouse: (id, param) => {
    return put('/api/house/' + id, param)
  },
  deleteHouse: (id) => {
    return del('/api/house/' + id, undefined)
  },
}

export default {fmAPI, paraAPI, deviceAPI, userAPI, houseAPI};
