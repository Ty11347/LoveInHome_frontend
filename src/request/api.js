// 从http.js中引入post
import {post} from './http'

const apiAddress = {
    fmLogin: (param) => {
        return post('http://localhost:8080/api/fm/login', param)
    },
    fmRegister: (param) => {
        return post('http://localhost:8080/api/fm/register', param)
    },
}

export default apiAddress;
