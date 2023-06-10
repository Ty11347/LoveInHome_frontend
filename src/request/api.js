// 从http.js中引入post
import {get, del, put, post} from './http'

const localhost = "http://localhost:8080"


const apiAddress = {
  // login and register
  fmLogin: (username, password) => {
    return post(localhost + '/fm/login?' + "username=" + username + "&password=" + password, undefined)
  },
  fmRegister: (param) => {
    return post(localhost + '/fm/register', param)
  },
  // parameter
  getAllPara: (param) => {
    return get(localhost + '/parameter', param)
  },
  getAllParaById: (id) => {
    return get(localhost + '/parameter/' + id, undefined)
  },
  addPara: (id, param) => {
    return post(localhost + '/parameter/' + id, param)
  },
  updatePara: (id, param) => {
    return put(localhost + '/parameter/' + id, param)
  },
  deletePara: (id, param) => {
    return del(localhost + '/parameter/' + id, param)
  },

  // device
  getAllDevice: (param) => {
    return get(localhost + '/device', param)
  },
  getAllDeviceById: (id) => {
    return get(localhost + '/device/' + id, undefined)
  },
  addDevice: (id, param) => {
    return post(localhost + '/device', param)
  },
  updateDevice: (id, param) => {
    return put(localhost + '/device/' + id, param)
  },
  deleteDevice: (id) => {
    return del(localhost + '/parameter/' + id, undefined)
  },
}

export default apiAddress;
