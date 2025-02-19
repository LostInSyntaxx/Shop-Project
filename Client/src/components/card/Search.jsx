import React, {useState} from 'react'
import useShopStore from "../../store/shop-store.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const Search = () => {
    const getProduct = useShopStore((state) => state.getProduct);
    const products = useShopStore((state) => state.products);

    const [text, setText ] = useState('')
    console.log(text)

    return (
        <div>
            <div>
                <h2 className="text-xl text-white/80 font-semibold mb-4"><FontAwesomeIcon icon={faSearch} /> ค้นหาสินค้า</h2>
                <input
                    onChange={(e)=>setText(e.target.value)}
                    type="text"
                    placeholder="ค้นหาสินค้า..."
                    className="input input-bordered w-full mb-4 bg-white/10 text-white focus:bg-white/20 transition-colors"
                />
            </div>
        </div>
    )
}
export default Search
