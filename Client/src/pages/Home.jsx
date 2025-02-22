import React from 'react'
import ContentCar from "../components/home/ContentCar.jsx";
import BestSeller from "../components/home/BestSeller.jsx";

const Home = () => {
    return (
        <div>
            <ContentCar/>

    <p className={'text-2xl text-center mt-4'}>สินค้าขายอย่างดี</p>
            <BestSeller/>
        </div>
    )
}
export default Home
