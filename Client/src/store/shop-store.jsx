import { create } from 'zustand'
import axios from "axios";
import { persist,createJSONStorage } from 'zustand/middleware'
import {listCategory} from "../Api/Main-Api.jsx";
import {listProduct,searchFilters} from "../Api/Main-api-pro.jsx";
import _ from "lodash";


const shopStore = (set, get)=> ({
    user: null,
    token: null,
    categories: [],
    products: [],
    carts: [],
    actionAddtoCart: (product)=> {
        const carts = get().carts
        const updateCart = [...carts,{...product, count: 1}]
        const  uniqe = _.uniqWith(updateCart,_.isEqual)
        set({ carts: uniqe })
    },
    actionUpdateQuantity: (productId, newQuantity)=> {
        set((state)=> ({
            carts: state.carts.map((item)=>
                item.id === productId
                ? {...item, count: Math.max(1, newQuantity)}
                : item
            )
        }))
    },
    actionRemoveProduct: (productid)=> {
        set((state)=>({
            carts: state.carts.filter((item)=>
                item.id !== productid
            )
        }))
    },
    getTotalPrice: ()=> {
        return get().carts.reduce((total,item)=>{
            return total + item.price * item.count
        },0)
    },
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


