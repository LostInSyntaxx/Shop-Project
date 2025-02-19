import { create } from 'zustand'
import axios from "axios";
import { persist,createJSONStorage } from 'zustand/middleware'
import {listCategory} from "../Api/Main-Api.jsx";
import {listProduct,searchFilters} from "../Api/Main-api-pro.jsx";

const shopStore = (set)=> ({
    user: null,
    token: null,
    categories: [],
    products: [],
    actionLogin: async (form) => {
        const res = await axios.post('http://localhost:3000/api/login',form)
        set({
            user: res.data.payload,
            token: res.data.token
        })
        return res
    },
    getCategory : async () => {
        try {
            const res = await listCategory();
            set({categories: res.data})
        } catch (err) {
            console.log(err);
        }
    },
    getProduct : async (count) => {
        try {
            const res = await listProduct(count);
            set({ products: res.data})
        } catch (err) {
            console.log(err);
        }
    },
    actionSearchFilters : async (arg) => {
        try {
            const res = await searchFilters(arg);
            set({ products: res.data})
        } catch (err) {
            console.log(err);
        }
    },
})


const useShop = {
    name: 'Shop-Project - main',
    storage: createJSONStorage(()=>localStorage)

}

const useShopStore = create(persist(shopStore,useShop))

export default useShopStore


