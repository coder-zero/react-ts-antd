/* 接口封装 */
import axios from 'axios'
import { message } from 'antd'

const axiosOption = {
    baseURL: '/mock',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
}
const instance = axios.create(axiosOption);

// token失效，清除用户信息并返回登录界面
const clearAll = () => {
    localStorage.removeItem('token')
    // router.history.replace({ path: '/login' })
    window.location.href = "/login"
}


// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    let token = localStorage.getItem('token')
    if (token) {
        // 拦截器中添加headers
        config.headers = {
            'token': token
        }
    }
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});


// 添加响应拦截器
instance.interceptors.response.use(function (response) {
    // if (JSON.stringify(response).includes('403')) {
    //     message.error('请求失败')
    //     clearAll()
    // }
    return response.data;
}, function (error) {
    try {
        if (JSON.stringify(error).includes('403')) {
            clearAll()
        }
    } catch (error) {
        clearAll()
    }
    message.destroy()
    message.error('请求失败')
    return Promise.reject(error);
});

export default instance;