import React, { useState, useEffect } from 'react'
import useShopStore from "../store/shop-store.jsx";
import {currentUser} from "../Api/api.jsx";
import LoadingToRedirect from "./LoadingToRedirect.jsx";

const ProtectRouteUser = ({ element }) => {
    const [ok, setOk] = useState(false)
    const user = useShopStore((state)=> state.user)
    const token = useShopStore((state)=> state.token)

    useEffect(() => {
        if (user && token) {
            currentUser(token)
                .then((res)=> setOk(true))
                .catch((err)=> setOk(false))
        }
    }, []);

    return  ok ? element : <LoadingToRedirect/>
}
export default ProtectRouteUser

