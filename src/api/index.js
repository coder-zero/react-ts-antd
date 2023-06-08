import request from './request'

//登录
export const reqLogin = (data) => {
    return request.post('/login', data)
}

//获取员工列表信息
export const regUserList = () => {
    return request.get('/user')
}

//批量删除员工数据
export const reqDeleteUserList = (keylist) => {
    return request.delete('/deleteuser', { data: keylist })
}

//查询员工
export const reqSelectUser = (params) => {
    return request.get('/user', { params })
}

//添加员工
export const reqAddUser = (data) => {
    return request.post('/adduser', data)
}

//修改员工
export const reqEditUser = (data) => {
    console.log('data', data)
    return request.post('/edituser', data)
}

//添加+修改
export const reqHandleUser = (data) => {
    return request.post('/handleuser', data)
}