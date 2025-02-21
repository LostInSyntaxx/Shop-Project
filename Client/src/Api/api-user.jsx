import axios from "axios";

export const userApi = async (token,cart) =>  {
    return axios.post('http://localhost:3000/api/user/cart',cart,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const listUserApi = async (token) =>  {
    return axios.get('http://localhost:3000/api/user/cart',{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const saveAddress = async (token, address) =>  {
    return axios.post('http://localhost:3000/api/user/address',
        { address },
        {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const saveOrder = async (token, payload) => {
    // code body
    return axios.post("http://localhost:3000/api/user/order", payload, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const getOrders = async (token) => {
    // code body
    return axios.get("http://localhost:3000/api/user/order", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};