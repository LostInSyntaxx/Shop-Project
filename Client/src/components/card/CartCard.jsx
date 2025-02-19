import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash  } from '@fortawesome/free-solid-svg-icons';
import useShopStore from "../../store/shop-store.jsx";
import {Link} from "react-router-dom";

const CartCard = () => {
    const carts = useShopStore((state)=>state.carts)
    const actionUpdateQuantity = useShopStore((state)=>state.actionUpdateQuantity)
    const actionRemoveProduct = useShopStore((state)=>state.actionRemoveProduct)
    const getTotalPrice = useShopStore((state)=>state.getTotalPrice)

    const totalPrice = carts.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return (
        <div>
            <h1 className={'text-xl font-bold mb-4'}>ตะกร้าสินค้า</h1>
            {/* Border */}
            <div className={'bg-black/20 rounded-xl p-2'}>
                {/* Card */}
                {
                    carts.map((item,index) =>

                <div key={index} className={'bg-black/25 p-2 rounded-xl mb-2 '}>
                    {/* Row 1 */}
                    <div className={'flex justify-between mb-6'}>
                        {/* Left */}
                        <div className={'flex gap-2 items-center'}>

                            {
                                item.images && item.images.length > 0
                                    ? <img src={item.images[0].url} className={'w-16 h-16 rounded-md'}/>
                                    :  <div className={'w-16 h-16 bg-gray-200/20 rounded-md flex text-center items-center'}>
                                        No Image
                                    </div>
                            }

                            <div>
                                <p className={'font-bold text-lg'}>{item.title}</p>
                                <p className={'text-sm text-gray-40'}>{item.description}</p>
                            </div>
                        </div>
                        {/* Right */}
                        <div  onClick={()=>actionRemoveProduct(item.id)} className={'text-red-600/50 p-2'}>
                            <FontAwesomeIcon icon={faTrash} />
                        </div>
                    </div>
                    {/* Row 2 */}
                    <div className={'flex justify-between'}>
                        {/* Left */}
                        <div className={'flex justify-between items-center mt-4'}>
                            <button onClick={()=>actionUpdateQuantity(item.id,item.count-1)} className={'btn btn-sm  hover:bg-gray-400'}>-</button>
                            <span className={'px-4'}>{item.count}</span>
                            <button  onClick={()=>actionUpdateQuantity(item.id,item.count+1)} className={'btn btn-sm  hover:bg-gray-400'}>+</button>
                        </div>
                        {/* Right */}
                        <div className={'font-bold text-blue-500'}>
                            {item.price}
                        </div>
                    </div>

                </div>
                )

                }
                {/* Total */}
                <div className={'flex justify-between px-2'}>
                    <span className="text-md font-medium">รวม</span>
                    <span className="text-lg font-semibold text-green-500">฿{getTotalPrice()}</span>
                </div>
                <Link to="/cart">
                    <button className="bg-white/40 text-white py-2 w-full px-5 rounded-xl mt-6">
                        ดำเนินรายการ
                    </button>
                </Link>
            </div>
        </div>
    )
}
export default CartCard
