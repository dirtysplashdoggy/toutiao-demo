import axios from 'axios'


//axios

const request = axios.create({
    baseURL:'http://www.ysqorz.top:8888/api/private/v1/'
})

request.interceptors.request.use(config => {
    // console.log(config);
    config.headers.Authorization =window.sessionStorage.getItem('token')
    return config
    
})

export default request