import Mock from 'mockjs'
import { nanoid } from 'nanoid'
import { createBrowserHistory } from 'history'
const history = createBrowserHistory()


let Random = Mock.Random

let userList = Mock.mock({
    "userList|150-200": [{
        "id": /WY\d{5}$/,
        "name": "@cname",
        "phone": /^1[34578]\d{9}$/,
        "gender": "@Boolean"
    }]

})

//处理登录请求
Mock.mock('/mock/login', 'post', (req) => {
    const { username, password } = JSON.parse(req.body)
    if (username === '1' && password === '1') {
        return {
            status: 200,
            message: '登录成功！',
            token: '小猪佩奇'
        }
    } else {
        return {
            status: 401,
            message: '无权限！'
        }
    }
})

//处理员工信息请求
Mock.mock(/\/mock\/user/, 'get', (req) => {
    const { url } = req
    const queryarr = url?.split('?')
    if (queryarr[1]) {
        let [key, value] = queryarr[1]?.split('=')
        return {
            status: 200,
            message: '查询数据成功！',
            data: userList.userList.filter(user => user[key] === value)
        }
    }
    return {
        status: 200,
        message: '获取数据成功！',
        data: userList
    }

})

let list = userList.userList

//处理删除员工请求
Mock.mock('/mock/deleteuser', 'delete', (req) => {
    const keylist = JSON.parse(req.body).keylist
    for (let key of keylist) {
        list = list.filter(item => item.id !== key)
    }
    return {
        status: 200,
        message: '删除数据成功！',
        data: list
    }
})

//根据条件查询员工信息
Mock.mock(/\/mock\/finduser/, 'get', (req) => {
    const { location: { search } } = history

    // const { url } = req
    const queryarr = search.split('?')
    let id = queryarr[1].split('=')[1]
    console.log(id)
    if (id)
        list = list.filter(user => user[id] === id)
    return {
        status: 200,
        message: '查询数据成功！',
        data: list
    }
    // console.log(req)
})

//添加员工信息
Mock.mock('/mock/adduser', 'post', (req) => {
    const { name, gender, phone } = JSON.parse(req.body)
    const addnew = { id: nanoid(), name, gender, phone }
    return {
        status: 200,
        message: '添加数据成功！',
        data: [addnew, ...list]
    }
})

//修改员工信息
Mock.mock('/mock/edituser', 'post', (req) => {
    const { id, name, gender, phone } = JSON.parse(req.body)
    list.map(item => {
        if (item.id === id) {
            item.name = name
            item.gender = gender
            item.phone = phone
        }
    })
    return {
        status: 200,
        message: '添加数据成功！',
        data: list
    }
})

//综合处理：添加+修改
Mock.mock('/mock/handleuser', 'post', (req) => {
    const { id, name, gender, phone } = JSON.parse(req.body)
    //修改
    if (id) {
        list.map(item => {
            if (item.id === id) {
                item.name = name
                item.gender = gender
                item.phone = phone
            }
        })
        return {
            status: 200,
            message: '修改数据成功！',
            data: list
        }
    } else {
        //添加
        const { name, gender, phone } = JSON.parse(req.body)
        const addnew = { id: "WY" + Random.integer(10000, 99999), name, gender, phone }
        list = [addnew, ...list]
        return {
            status: 200,
            message: '添加数据成功！',
            data: list
        }
    }

})