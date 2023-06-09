// 从http.js中引入post
import {post} from './http'

const apiAddress = {
    fmLogin: (param) => {
        return post('/api/fm/login', param)
    },
    fmRegister: (param) => {
        return post('/api/fm/register', param)
    },
}

export default apiAddress;
