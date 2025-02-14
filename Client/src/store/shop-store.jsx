import { create } from 'zustand'
import axios from "axios";
import { persist,createJSONStorage } from 'zustand/middleware'

const shopStore = (set)=> ({
    user: null,
    token: null,
    //categories: [],
    actionLogin: async (form) => {
        const res = await axios.post('http://localhost:3000/api/login',form)
        set({
            user: res.data.payload,
            token: res.data.token
        })
        return res
    },
})


const useShop = {
    name: 'Shop-Project - main',
    storage: createJSONStorage(()=>localStorage)

}

const useShopStore = create(persist(shopStore,useShop))

export default useShopStore


