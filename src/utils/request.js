import axios from 'axios'

//axios

const request = axios.create({
    baseURL:'http://timemeetyou.com:8889/api/private/v1/'
})

export default request