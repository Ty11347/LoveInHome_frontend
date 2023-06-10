// 从http.js中引入post
import {get, del, put, post} from './http'

// const localhost = "http://localhost:8080";
// const herokuhost = "https://loveinhome.herokuapp.com";


const apiAddress = {
  // login and register
  fmLogin: (username, password) => {
    return post('/api/fm/login?' + "username=" + username + "&password=" + password, undefined)
  },
  fmRegister: (param) => {
    return post('/api/fm/register', param)
  },
  // parameter
  getAllPara: (param) => {
    return get('/api/parameter', param)
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

  // device
  getAllDevice: (param) => {
    return get('/api/device', param)
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

export default apiAddress;
