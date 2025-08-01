import axios from "axios";

export const getOrdersAdmin = async (token) => {
    return axios.get('http://localhost:3000/api/admin/orders', {
        headers : {
            Authorization: `Bearer ${token}`
        }
    })
}

export const changeStatus = async (token,orderId,orderStatus) => {
    return axios.put('http://localhost:3000/api/admin/order-status', {
        orderId,orderStatus
    }, {
        headers : {
            Authorization: `Bearer ${token}`
        }
    })
}

export const getListAllUsers = async (token) => {
    return axios.get('http://localhost:3000/api/users', {
        headers : {
            Authorization: `Bearer ${token}`
        }
    })
}

export const changeUserStatus = async (token,value) => {
    return axios.post('http://localhost:3000/api/change-status', value,{
        headers : {
            Authorization: `Bearer ${token}`
        }
    })
}

export const changeUserRole= async (token,value) => {
    return axios.post('http://localhost:3000/api/change-role', value,{
        headers : {
            Authorization: `Bearer ${token}`
        }
    })
}

export const deleteUser = async (token,id) => {
    return axios.delete(`http://localhost:3000/api/users/${id}`, {
        headers : {
            Authorization: `Bearer ${token}`
        }
    })
}