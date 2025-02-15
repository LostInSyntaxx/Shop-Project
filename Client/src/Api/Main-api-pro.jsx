import axios from "axios";


export const createProduct = async (token,form) =>  {
    return axios.post('http://localhost:3000/api/product',form,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const listProduct = async (token, count = 100) =>  {
    return axios.get('http://localhost:3000/api/products/'+count,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}
