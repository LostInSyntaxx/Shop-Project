import axios from "axios";


export const createProduct = async (token,form) =>  {
    return axios.post('http://localhost:3000/api/product',form,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const listProduct = async ( count = 100) =>  {
    return axios.get('http://localhost:3000/api/products/'+count,)
}

export const readProduct = async (token,  id ) =>  {
    return axios.get('http://localhost:3000/api/product/'+id,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const deleteProduct = async (token,  id ) =>  {
    return axios.delete('http://localhost:3000/api/product/'+id,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const updateProduct = async (token,  id, form ) =>  {
    return axios.put('http://localhost:3000/api/product/'+id, form,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const uploadFiles = async (token, form) =>  {
    return axios.post('http://localhost:3000/api/images', {
        image: form
    },{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const removeFiles = async (token, public_id) =>  {
    return axios.post('http://localhost:3000/api/removeimage', {
        public_id
    },{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const searchFilters = async ( arg) =>  {
    return axios.post('http://localhost:3000/api/search/filters',arg)
}

export const listProductBy = async (sort,order,limit) =>  {
    return axios.post('http://localhost:3000/api/productby',
        {
            sort,
            order,
            limit,
        }
        )
}