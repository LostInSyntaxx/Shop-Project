import React, {useEffect, useState} from 'react'
import { listProductBy } from "../../Api/Main-api-pro.jsx";
import ProductCard from "../card/ProductCard.jsx";

const BestSeller = () => {
    const [data, setData] = useState([])

    useEffect(() => {
        loadData()
    }, []);

    const loadData = ()=> {
        listProductBy('sold','desc',10)
            .then((res)=> {
                setData(res.data)
            })
            .catch((err)=> {
                console.log(err)
            })
    }


    return (
        <div className={'flex  flex-wrap gap-4 justify-center'}>
            {
                data?.map((item,index)=>
                    <ProductCard item={item}/>
                )
            }
        </div>
    )
}
export default BestSeller
